/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ProductResponse } from '../interfaces';

const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev/list";

function ProductList() {
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const getData = async () => {
		const response = await fetch(BASE_URL);

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
		<ul>
			{products.map((product, ) => (
				<li key={product.version}>{product.stl}</li>
			))}
		</ul>
	);
}

export default ProductList;

