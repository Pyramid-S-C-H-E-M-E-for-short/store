import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/20/solid";
import { BASE_URL } from "../config";
import InputField from "../components/InputField";

const products = [
	{
		id: 1,
		title: "Basic Tee",
		href: "#",
		price: "$32.00",
		color: "Black",
		size: "Large",
		imageSrc:
			"https://tailwindcss.com/plus-assets/img/ecommerce-images/checkout-page-02-product-01.jpg",
		imageAlt: "Front of men's Basic Tee in black.",
	},
	// More products...
];

const paymentMethods = [
	{ id: "credit-card", title: "Credit card" },
	{ id: "paypal", title: "PayPal" },
];

export default function Checkout() {
	const [profile, setProfile] = useState<Profile | undefined>(undefined);
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
		console.log('profile', profile);

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

				<form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handleSubmit}>
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
								<InputField id='firstName' label='First Name' key='firstName' />
								<InputField id='lastName' label='Last Name' key='lastname' />

								<div className="sm:col-span-2">
									<InputField id='address' label='Address' key='address' />
								</div>

								<div className="sm:col-span-2">
									<InputField id='address2' label='Apartment, suite, etc' key='address2' />
									
								</div>

								<div>
									<label
										htmlFor="city"
										className="block text-sm/6 font-medium text-gray-700"
									>
										City
									</label>
									<div className="mt-2">
										<input
											id="city"
											name="city"
											type="text"
											autoComplete="address-level2"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>

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

								<div>
									<label
										htmlFor="region"
										className="block text-sm/6 font-medium text-gray-700"
									>
										State / Province
									</label>
									<div className="mt-2">
										<input
											id="region"
											name="region"
											type="text"
											autoComplete="address-level1"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="postal-code"
										className="block text-sm/6 font-medium text-gray-700"
									>
										Postal code
									</label>
									<div className="mt-2">
										<input
											id="postal-code"
											name="postal-code"
											type="text"
											autoComplete="postal-code"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="sm:col-span-2">
									<label
										htmlFor="phone"
										className="block text-sm/6 font-medium text-gray-700"
									>
										Phone
									</label>
									<div className="mt-2">
										<input
											id="phone"
											name="phone"
											type="text"
											autoComplete="tel"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
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
									<label
										htmlFor="card-number"
										className="block text-sm/6 font-medium text-gray-700"
									>
										Card number
									</label>
									<div className="mt-2">
										<input
											id="card-number"
											name="card-number"
											type="text"
											autoComplete="cc-number"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="col-span-4">
									<label
										htmlFor="name-on-card"
										className="block text-sm/6 font-medium text-gray-700"
									>
										Name on card
									</label>
									<div className="mt-2">
										<input
											id="name-on-card"
											name="name-on-card"
											type="text"
											autoComplete="cc-name"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div className="col-span-3">
									<label
										htmlFor="expiration-date"
										className="block text-sm/6 font-medium text-gray-700"
									>
										Expiration date (MM/YY)
									</label>
									<div className="mt-2">
										<input
											id="expiration-date"
											name="expiration-date"
											type="text"
											autoComplete="cc-exp"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="cvc"
										className="block text-sm/6 font-medium text-gray-700"
									>
										CVC
									</label>
									<div className="mt-2">
										<input
											id="cvc"
											name="cvc"
											type="text"
											autoComplete="csc"
											className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Order summary */}
					<div className="mt-10 lg:mt-0">
						<h2 className="text-lg font-medium text-gray-900">Order summary</h2>

						<div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
							<h3 className="sr-only">Items in your cart</h3>
							<ul role="list" className="divide-y divide-gray-200">
								{products.map((product) => (
									<li key={product.id} className="flex px-4 py-6 sm:px-6">
										<div className="shrink-0">
											<img
												alt={product.imageAlt}
												src={product.imageSrc}
												className="w-20 rounded-md"
											/>
										</div>

										<div className="ml-6 flex flex-1 flex-col">
											<div className="flex">
												<div className="min-w-0 flex-1">
													<h4 className="text-sm">
														<a
															href={product.href}
															className="font-medium text-gray-700 hover:text-gray-800"
														>
															{product.title}
														</a>
													</h4>
													<p className="mt-1 text-sm text-gray-500">
														{product.color}
													</p>
													<p className="mt-1 text-sm text-gray-500">
														{product.size}
													</p>
												</div>

												<div className="ml-4 flow-root shrink-0">
													<button
														type="button"
														className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
													>
														<span className="sr-only">Remove</span>
														<TrashIcon aria-hidden="true" className="size-5" />
													</button>
												</div>
											</div>

											<div className="flex flex-1 items-end justify-between pt-2">
												<p className="mt-1 text-sm font-medium text-gray-900">
													{product.price}
												</p>

												<div className="ml-4">
													<div className="grid grid-cols-1">
														<select
															id="quantity"
															name="quantity"
															aria-label="Quantity"
															className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
														>
															<option value={1}>1</option>
															<option value={2}>2</option>
															<option value={3}>3</option>
															<option value={4}>4</option>
															<option value={5}>5</option>
															<option value={6}>6</option>
															<option value={7}>7</option>
															<option value={8}>8</option>
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
							<dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
								<div className="flex items-center justify-between">
									<dt className="text-sm">Subtotal</dt>
									<dd className="text-sm font-medium text-gray-900">$64.00</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-sm">Shipping</dt>
									<dd className="text-sm font-medium text-gray-900">$5.00</dd>
								</div>
								<div className="flex items-center justify-between">
									<dt className="text-sm">Taxes</dt>
									<dd className="text-sm font-medium text-gray-900">$5.52</dd>
								</div>
								<div className="flex items-center justify-between border-t border-gray-200 pt-6">
									<dt className="text-base font-medium">Total</dt>
									<dd className="text-base font-medium text-gray-900">
										$75.52
									</dd>
								</div>
							</dl>

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
