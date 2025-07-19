/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingBagIcon, UserIcon } from "@heroicons/react/24/outline";
import ColorPicker from "../components/ColorPicker";
import FilamentDropdown from "../components/FilamentDropdown";
import { BASE_URL } from "../config";
import { useColorContext } from "../context/ColorContext";
import { useCart } from "../context/CartContext";

const PreviewComponent = lazy(() => import("../components/PreviewComponent"));

export default function ProductPage() {
	const { dispatch, state } = useColorContext();
	const {  cart, addToCart } = useCart();
	const [quantity, setQuantity] = useState(1);

	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | undefined>(undefined);
	const [selectedFilament, setSelectedFilament] = useState<string>("PLA");

	// Fetch product data based on ID
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await fetch(`${BASE_URL}/product/${id}`);
				const data = (await response.json()) as Product;
				setProduct(data);

				if (data.color) {
					dispatch({ type: "SET_INITIAL_COLOR", payload: data.color });
				}
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		if (id) fetchProduct();
	}, [id, dispatch]);

	if (!product) return <div>Loading product...</div>;

	return (
		<div className="bg-white">
			<header className="relative bg-white">
				<nav
					aria-label="Top"
					className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
				>
					<div className="border-b border-gray-200">
						<div className="flex h-16 items-center justify-between">
							<div className="flex flex-1 items-center justify-end">
								{/* Account */}
								<a
									href="/profile"
									className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4"
								>
									<span className="sr-only">Account</span>
									<UserIcon aria-hidden="true" className="h-6 w-6" />
								</a>

								{/* Cart */}
								<div className="ml-4 flow-root lg:ml-6">
									<Link to="/cart" className="group -m-2 flex items-center p-2">
										<ShoppingBagIcon
											aria-hidden="true"
											className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
										/>
										<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
											{cart.length}
										</span>
										<span className="sr-only">items in cart, view bag</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>

			<main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
				<div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
					<div className="lg:col-span-5 lg:col-start-8">
						<div className="flex justify-between">
							<h1 className="text-xl font-medium text-gray-900">
								{product.name}
							</h1>
							<p className="text-xl font-medium text-gray-900">
								${product.price}
							</p>
						</div>
					</div>

					<div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
						<h2 className="sr-only">Images</h2>

						<div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
							<Suspense fallback={<div data-id="loading">Loading...</div>}>
								<PreviewComponent
									color={product.color}
									url={product.stl}
									onExceedsLimit={() => false}
									onError={() => (
										<div>
											<p>There was an error loading the model</p>
										</div>
									)}
								/>
							</Suspense>
						</div>
					</div>

					<div className="mt-8 lg:col-span-5">
						<form>
							<div>
								<h2 className="text-sm font-medium text-gray-900">
									Filament Selection
								</h2>
								<FilamentDropdown
									selectedFilament={selectedFilament}
									setSelectedFilament={setSelectedFilament}
								/>
							</div>
							<div>
								<h2 className="text-sm font-medium text-gray-900">Color</h2>
								<ColorPicker filamentType={selectedFilament} />
								<div className="mt-4">
									<h2 className="text-sm font-medium text-gray-900">
										Quantity
									</h2>
									<div>
										<input
											type="number"
											value={quantity}
											onChange={(e) =>
												setQuantity(Math.max(1, parseInt(e.target.value) || 1))
											}
										/>
										
										<button
											type="button"
											onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
											className="px-3 py-1 border rounded-r bg-gray-200 hover:bg-gray-300"
										>
											-
										</button>
										<button
											type="button"
											onClick={() => setQuantity((qty) => qty + 1)}
											className="px-3 py-1 border rounded-r bg-gray-200 hover:bg-gray-300"
										>
											+
										</button>
									</div>
								</div>
							</div>

							<button
								type="button"
								onClick={() =>
									addToCart({
										id: Number(id),
										name: product.name,
										price: parseFloat(product.price),
										color: state.color,
										quantity,
										filamentType: selectedFilament,
										image: "",
									})
								}
								className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								Add to cart
							</button>
						</form>

						{/* Product details */}
						<div className="mt-10">
							<h2 className="text-sm font-medium text-gray-900">Description</h2>

							<div
								dangerouslySetInnerHTML={{ __html: product.description }}
								className="prose prose-sm mt-4 text-gray-500"
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

interface Product {
	name: string;
	price: string;
	stl: string;
	description: string;
	color: string;
}
