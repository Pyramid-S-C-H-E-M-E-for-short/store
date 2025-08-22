/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';


function ProductList() {
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const getData = async () => {
		const response = await fetch(`${BASE_URL}/products`);

		try {
			const data = (await response.json()) as ProductResponse[];

			setProducts(data);
			return data;
		} catch (error) {
			console.error("error", error);
		}
	};

	useEffect(() => {
		getData();
	}, []);
	return (
		<div className='bg-white'>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-semibold'>Products</h1>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
					{products.map((product) => (
						<div key={product.id} className='bg-white rounded-lg shadow-md'>
							<img
								src={product.image}
								alt={product.name}
								className='w-full h-48 object-cover object-center rounded-t-lg'
							/>
							<div className='p-4'>
								<h2 className='text-xl font-semibold'>{product.name}</h2>
								<p className='text-gray-500 mt-2'>{product.description}</p>
								<p className='text-gray-500 mt-2'>${product.price}</p>
								<Link
									to={`/product/${product.id}`}
									className='block bg-blue-500 hover:bg-blue-400 text-white font-semibold text-center rounded-lg px-4 py-2 mt-4'
								>
									View Product
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default ProductList;


export interface ProductResponse {
	id:           number;
	name:         string;
	description:  string;
	image:        string;
	stl:          string;
	price:        number;
	filamentType: string;
	color:        string;
}
