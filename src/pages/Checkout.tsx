import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/20/solid";
import { BASE_URL } from "../config";
import InputField from "../components/InputField";

const paymentMethods = [
	{ id: "credit-card", title: "Credit card" },
	{ id: "paypal", title: "PayPal" },
];

export default function Checkout() {
	const [profile, setProfile] = useState<Profile | undefined>(undefined);
	const { cart, removeFromCart, updateQuantity } = useCart();
	const getProfileData = async () => {
		try {
			const response = await fetch(`${BASE_URL}/profile`, {
				credentials: "include",
			});
			const data = await response.json();

			return data;
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error(`Error fetching profile: ${err.message}`);
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		console.log("profile", profile);

		try {
			const response = await fetch(`${BASE_URL}/profile`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				credentials: "include",
			});
			if (response.ok) {
				const updatedProfile = (await response.json()) as Profile;
				setProfile(updatedProfile);
			} else {
				console.error("Failed to update profile");
			}
		} catch (err) {
			console.error("Error updating profile:", err);
		}
	};

	useEffect(() => {
		getProfileData();
	}, []);

	return (
		<div className="bg-gray-50">
			<div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Checkout</h2>
				<form
					className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
					onSubmit={handleSubmit}
				>
					<div>
						<div>
							<h2 className="text-lg font-medium text-gray-900">
								Contact information
							</h2>
							<div className="mt-4">
								<div className="mt-2">
									<InputField
										key="emailAddress"
										label="Email Address"
										id="emailAddress"
									/>
								</div>
							</div>
						</div>
						<div className="mt-10 border-t border-gray-200 pt-10">
							<h2 className="text-lg font-medium text-gray-900">
								Shipping information
							</h2>
							<div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
								<InputField id="firstName" label="First Name" key="firstName" />
								<InputField id="lastName" label="Last Name" key="lastname" />
								<div className="sm:col-span-2">
									<InputField id="address" label="Address" key="address" />
								</div>
								<div className="sm:col-span-2">
									<InputField
										id="address2"
										label="Apartment, suite, etc"
										key="address2"
									/>
								</div>
								<InputField
									id="city"
									label="City"
									key="city"
									autoComplete="address-level2"
								/>
								<div>
									<label
										htmlFor="country"
										className="block text-sm/6 font-medium text-gray-700"
									>
										Country
									</label>
									<div className="mt-2 grid grid-cols-1">
										<select
											id="country"
											name="country"
											autoComplete="country-name"
											className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										>
											<option>United States</option>
											<option>Canada</option>
											<option>Mexico</option>
										</select>
										<ChevronDownIcon
											aria-hidden="true"
											className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
										/>
									</div>
								</div>
								<InputField
									id="region"
									label="State / Province"
									key="region"
									autoComplete="address-level1"
								/>
								<InputField
									id="postal-code"
									label="Postal code"
									key="postal-code"
									autoComplete="postal-code"
								/>
								<div className="sm:col-span-2">
									<InputField
										id="phone"
										label="Phone"
										key="phone"
										autoComplete="tel"
									/>
								</div>
							</div>
						</div>
						{/* Payment */}
						<div className="mt-10 border-t border-gray-200 pt-10">
							<h2 className="text-lg font-medium text-gray-900">Payment</h2>
							<fieldset className="mt-4">
								<legend className="sr-only">Payment type</legend>
								<div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
									{paymentMethods.map((paymentMethod, paymentMethodIdx) => (
										<div key={paymentMethod.id} className="flex items-center">
											<input
												defaultChecked={paymentMethodIdx === 0}
												id={paymentMethod.id}
												name="payment-type"
												type="radio"
												className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
											/>
											<label
												htmlFor={paymentMethod.id}
												className="ml-3 block text-sm/6 font-medium text-gray-700"
											>
												{paymentMethod.title}
											</label>
										</div>
									))}
								</div>
							</fieldset>
							<div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
								<div className="col-span-4">
									<InputField
										id="card-number"
										label="Card number"
										key="card-number"
										autoComplete="cc-number"
									/>
								</div>
								<div className="col-span-4">
									<InputField
										id="name-on-card"
										label="Name on card"
										key="name-on-card"
										autoComplete="cc-name"
									/>
								</div>
								<div className="col-span-3">
									<InputField
										id="expiration-date"
										label="Expiration date (MM/YY)"
										key="expiration-date"
										autoComplete="cc-exp"
									/>
								</div>
								<InputField id="cvc" label="CVC" key="cvc" autoComplete="csc" />
							</div>
						</div>
					</div>
					{/* Order summary */}
					<div className="mt-10 lg:mt-0">
						<h2 className="text-lg font-medium text-gray-900">Order summary</h2>
						<div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
							<h3 className="sr-only">Items in your cart</h3>
							<ul role="list" className="divide-y divide-gray-200">
								{cart.map((product) => (
									<li
										key={product.id + product.color + product.filamentType}
										className="flex px-4 py-6 sm:px-6"
									>
										<div className="shrink-0 flex items-center justify-center w-20 h-20 rounded-md border border-gray-200 bg-white">
											<div
												className="block w-12 h-12 rounded-full border border-gray-300 shadow"
												style={{ backgroundColor: `#${product.color}` }}
												aria-label="Product color preview"
											/>
										</div>
										<div className="ml-4 flex-1 flex flex-col">
											<div className="flex justify-between">
												<div>
													<h4 className="text-sm font-medium text-gray-900">
														{product.name}
													</h4>
													<p className="mt-1 text-sm text-gray-500">
														Filament: {product.filamentType}
													</p>
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
											<div className="flex flex-1 items-end justify-between pt-2">
												<p className="mt-1 text-sm font-medium text-gray-900">
													${(product.price * product.quantity).toFixed(2)}
												</p>
												<div className="ml-4">
													<div className="grid grid-cols-1">
														<select
															id="quantity"
															name="quantity"
															aria-label="Quantity"
															className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
															value={product.quantity || 1}
															onChange={(e) => {
																const qty = parseInt(e.target.value, 10);
																updateQuantity(product, qty);
															}}
														>
															{[...Array(8)].map((_, i) => (
																<option key={i + 1} value={i + 1}>
																	{i + 1}
																</option>
															))}
														</select>
														<ChevronDownIcon
															aria-hidden="true"
															className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
														/>
													</div>
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
							{(() => {
								const subtotal = cart.reduce(
									(sum, item) => sum + item.price * item.quantity,
									0
								);
								const shipping = cart.length > 0 ? 5.0 : 0.0;
								const taxes = +(subtotal * 0.0862).toFixed(2); // Example: 8.62% tax
								const total = +(subtotal + shipping + taxes).toFixed(2);
								return (
									<dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
										<div className="flex items-center justify-between">
											<dt className="text-sm">Subtotal</dt>
											<dd className="text-sm font-medium text-gray-900">
												${subtotal.toFixed(2)}
											</dd>
										</div>
										<div className="flex items-center justify-between">
											<dt className="text-sm">Shipping</dt>
											<dd className="text-sm font-medium text-gray-900">
												${shipping.toFixed(2)}
											</dd>
										</div>
										<div className="flex items-center justify-between">
											<dt className="text-sm">Taxes</dt>
											<dd className="text-sm font-medium text-gray-900">
												${taxes.toFixed(2)}
											</dd>
										</div>
										<div className="flex items-center justify-between border-t border-gray-200 pt-6">
											<dt className="text-base font-medium">Total</dt>
											<dd className="text-base font-medium text-gray-900">
												${total.toFixed(2)}
											</dd>
										</div>
									</dl>
								);
							})()}
							<div className="border-t border-gray-200 px-4 py-6 sm:px-6">
								<button
									type="submit"
									className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
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

interface Profile {
	email: string;
	firstName: string;
	lastName: string;
}
