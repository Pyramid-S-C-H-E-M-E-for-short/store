import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import InputField from '../components/InputField';
import { TrashIcon } from '@heroicons/react/20/solid';
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL, STRIPE_PUBLISHABLE_KEY } from '../config';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);


interface Profile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export default function Checkout() {
	const { cart, removeFromCart, updateQuantity } = useCart();
	const [profile, setProfile] = useState<Profile >();

	
	// Refs for card inputs
	const cardNumberRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const expRef = useRef<HTMLInputElement>(null);
	const cvcRef = useRef<HTMLInputElement>(null);

	const getProfileData = async () => {

		try {
			const response = await fetch(`${BASE_URL}/profile`, {
				credentials: 'include',
			});
			const data: Profile = await response.json();
			setProfile(data);
			console.log('profile', data.email);
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.log(`Error fetching profile: ${err.message}`);
			} else {
				console.log('An unknown error occurred while fetching profile data.');
			}
		}
	};

	useEffect(() => {
		getProfileData();
	}, []);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const stripe = await stripePromise;
		if (!stripe) return console.log('Stripe failed to load');


		const res = await fetch(`${BASE_URL}/cart/checkout?cartId=${profile?.id}`, {
			method: 'POST',
			credentials: 'include',
		});

		if (!res.ok) {
			console.error(await res.text());
			return console.log('Failed to create PaymentIntent');
		}

		const {clientSecret} = await res.json() 

		const cardNumber = cardNumberRef.current?.value || '';
		const name = nameRef.current?.value || '';
		const exp = expRef.current?.value || '';
		const cvc = cvcRef.current?.value || '';
		const [exp_month, exp_year] = exp.split('/').map(s => s.trim());

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: {
					number: cardNumber,
					exp_month: Number(exp_month),
					exp_year: Number(`20${exp_year}`),
					cvc,
				},
				billing_details: {
					name,
				},
			},
		});

		if (result.error) {
			console.error(result.error.message);
			toast.error(`Payment failed: ${result.error.message}`);
		} else if (result.paymentIntent?.status === 'succeeded') {
			toast.success('Payment successful! Thank you for your order.');
		}
	};

	// Render the cart total UI
	const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shipping = cart.length > 0 ? 5.0 : 0.0;
	const taxes = +(subtotal * 0.0862).toFixed(2);
	const total = +(subtotal + shipping + taxes).toFixed(2);

	return (
		<div className="bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Checkout</h2>
				<form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handleSubmit}>
					<div>
						<h2 className="text-lg font-medium text-gray-900">Payment Info</h2>
						<div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
							<div className="col-span-4">
								<InputField
									id="card-number"
									label="Card number"
									ref={cardNumberRef}
									autoComplete="cc-number"
								/>
							</div>
							<div className="col-span-4">
								<InputField
									id="name-on-card"
									label="Name on card"
									ref={nameRef}
									autoComplete="cc-name"
								/>
							</div>
							<div className="col-span-3">
								<InputField
									id="expiration-date"
									label="Expiration date (MM/YY)"
									ref={expRef}
									autoComplete="cc-exp"
								/>
							</div>
							<div className="col-span-1">
								<InputField
									id="cvc"
									label="CVC"
									ref={cvcRef}
									autoComplete="csc"
								/>
							</div>
						</div>
					</div>

					{/* Order Summary */}
					<div className="mt-10 lg:mt-0">
						<h2 className="text-lg font-medium text-gray-900">Order summary</h2>
						<div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
							<ul role="list" className="divide-y divide-gray-200">
								{cart.map(product => (
									<li
										key={product.id + product.color + product.filamentType}
										className="flex px-4 py-6 sm:px-6"
									>
										<div className="shrink-0 w-20 h-20 border rounded-md bg-white flex items-center justify-center">
											<div
												className="w-12 h-12 rounded-full border border-gray-300 shadow"
												style={{ backgroundColor: `#${product.color}` }}
											/>
										</div>
										<div className="ml-4 flex-1 flex flex-col">
											<div className="flex justify-between">
												<div>
													<h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
													<p className="mt-1 text-sm text-gray-500">Filament: {product.filamentType}</p>
												</div>
												<div className="ml-4 flow-root shrink-0">
													<button
														type="button"
														className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
														onClick={() => removeFromCart(product)}
													>
														<span className="sr-only">Remove</span>
														<TrashIcon aria-hidden="true" className="size-5" />
													</button>
												</div>
											</div>
											<div className="flex justify-between pt-2">
												<p className="text-sm font-medium text-gray-900">
													${(product.price * product.quantity).toFixed(2)}
												</p>
												<select
													className="w-20 border rounded-md text-sm"
													value={product.quantity}
													onChange={(e) => updateQuantity(product, Number(e.target.value))}
												>
													{[...Array(8)].map((_, i) => (
														<option key={i + 1} value={i + 1}>
															{i + 1}
														</option>
													))}
												</select>
											</div>
										</div>
									</li>
								))}
							</ul>
							<dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
								<div className="flex justify-between text-sm">
									<dt>Subtotal</dt>
									<dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
								</div>
								<div className="flex justify-between text-sm">
									<dt>Shipping</dt>
									<dd className="font-medium text-gray-900">${shipping.toFixed(2)}</dd>
								</div>
								<div className="flex justify-between text-sm">
									<dt>Taxes</dt>
									<dd className="font-medium text-gray-900">${taxes.toFixed(2)}</dd>
								</div>
								<div className="flex justify-between border-t pt-6 text-base font-medium">
									<dt>Total</dt>
									<dd className="text-gray-900">${total.toFixed(2)}</dd>
								</div>
							</dl>
							<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
								<button
									type="submit"
									className="w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									Confirm order
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
