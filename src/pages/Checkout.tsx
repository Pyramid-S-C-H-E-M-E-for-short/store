import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import InputField from '../components/InputField';
import { TrashIcon } from '@heroicons/react/20/solid';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { BASE_URL, STRIPE_PUBLISHABLE_KEY } from '../config';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface Profile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

function CheckoutForm({ profile }: { profile?: Profile }) {
	// 🔥 Using the hook here, as in your original
	const { cart, removeFromCart, updateQuantity } = useCart();

	const [shipping, setShipping] = useState({
		name: '',
		address: '',
		city: '',
		state: '',
		zip: '',
		country: '',
	});
	const stripe = useStripe();
	const elements = useElements();

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setShipping((s) => ({ ...s, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		const res = await fetch(`${BASE_URL}/cart/checkout?cartId=${profile?.id}`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ shipping }),
		});
		if (!res.ok) {
			console.error(await res.text());
			return console.log('Failed to create PaymentIntent');
		}
		const { clientSecret } = await res.json();

		const cardElement = elements.getElement(CardElement);

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: cardElement!,
				billing_details: {
					name: shipping.name,
					address: {
						line1: shipping.address,
						city: shipping.city,
						state: shipping.state,
						postal_code: shipping.zip,
						country: shipping.country,
					},
				},
			},
			shipping: {
				name: shipping.name,
				address: {
					line1: shipping.address,
					city: shipping.city,
					state: shipping.state,
					postal_code: shipping.zip,
					country: shipping.country,
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

	const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shippingFee = cart.length > 0 ? 5.0 : 0.0;
	const taxes = +(subtotal * 0.0862).toFixed(2);
	const total = +(subtotal + shippingFee + taxes).toFixed(2);

	return (
		<form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handleSubmit} autoComplete="off">
			<div>
				<h2 className="text-lg font-medium text-gray-900">Shipping Info</h2>
				<div className="mt-6 grid grid-cols-6 gap-x-4 gap-y-6">
					<div className="col-span-6">
						<InputField
							id="name"
							label="Full name"
							name="name"
							autoComplete="name"
							value={shipping.name}
							onChange={handleInput}
							required
						/>
					</div>
					<div className="col-span-6">
						<InputField
							id="address"
							label="Address"
							name="address"
							autoComplete="address-line1"
							value={shipping.address}
							onChange={handleInput}
							required
						/>
					</div>
					<div className="col-span-4">
						<InputField
							id="city"
							label="City"
							name="city"
							autoComplete="address-level2"
							value={shipping.city}
							onChange={handleInput}
							required
						/>
					</div>
					<div className="col-span-2">
						<InputField
							id="state"
							label="State"
							name="state"
							autoComplete="address-level1"
							value={shipping.state}
							onChange={handleInput}
							required
						/>
					</div>
					<div className="col-span-3">
						<InputField
							id="zip"
							label="ZIP / Postal code"
							name="zip"
							autoComplete="postal-code"
							value={shipping.zip}
							onChange={handleInput}
							required
						/>
					</div>
					<div className="col-span-3">
						<InputField
							id="country"
							label="Country"
							name="country"
							autoComplete="country"
							value={shipping.country}
							onChange={handleInput}
							required
						/>
					</div>
				</div>

				<h2 className="text-lg font-medium text-gray-900 mt-10">Payment Info</h2>
				<div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
					<div className="col-span-4">
						<label htmlFor="card-element" className="block text-sm/6 font-medium text-gray-700">
							Card details
						</label>
						<div className="mt-2">
							<div className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
								<CardElement
									id="card-element"
									options={{
										style: {
											base: {
												fontSize: '16px',
												color: '#1a202c',
												'::placeholder': { color: '#a0aec0' },
												fontFamily: 'inherit',
											},
											invalid: { color: '#e53e3e' },
										},
									}}
								/>
							</div>
						</div>
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
							<dd className="font-medium text-gray-900">${shippingFee.toFixed(2)}</dd>
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
	);
}

export default function Checkout() {
	const { cart } = useCart(); // Can still use here if you want
	const [profile, setProfile] = useState<Profile>();

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

	return (
		<div className="bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Checkout</h2>
				<Elements stripe={stripePromise}>
					<CheckoutForm profile={profile} />
				</Elements>
			</div>
		</div>
	);
}
