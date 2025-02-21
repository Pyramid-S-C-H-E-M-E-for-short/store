/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, Suspense, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ColorPicker from "../components/ColorPicker";
import FilamentDropdown from "../components/FilamentDropdown";
import { BASE_URL } from '../config';
import { useColorContext } from '../context/ColorContext';
import { useCart } from "../context/CartContext";

const PreviewComponent = lazy(() => import("../components/PreviewComponent"));

export default function ProductPage() {
	const { dispatch } = useColorContext();
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | undefined>(undefined);
	const [selectedFilament, setSelectedFilament] = useState<string>("PLA");

	const  {addToCart} = useCart();

	// Fetch product data based on ID
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await fetch(`${BASE_URL}/product/${id}`)
				const data = await response.json() as Product;

				setProduct(data);

				if(data.color) {
					dispatch({ type: "SET_INITIAL_COLOR", payload: data.color });
				}
			} catch (error) {
				console.error("Error fetching product:", error);
			}
		};

		if (id) fetchProduct();
	}, [id, dispatch]);

	if (!product) return <div>Loading product...</div>;

	const handleAddToCart = () => {
		console.log('clicked')
		if (!product) return;
		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			filament: selectedFilament,
		});
	};

	return (
		<div className="bg-white">
			<main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
				<div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
					<div className="lg:col-span-5 lg:col-start-8">
						<div className="flex justify-between">
							<h1 className="text-xl font-medium text-gray-900">
								{product.name}
							</h1>
							<p className="text-xl font-medium text-gray-900">
								{product.price}
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
							</div>

							<button
								onClick={handleAddToCart}
								type="button"
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
		id: string;
		name: string;
		price: string;
		stl: string;
		description: string;
		color: string;
	}

