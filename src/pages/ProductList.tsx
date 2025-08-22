/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import { ProductResponse, ProductListResponse, PaginationInfo } from '../interfaces/productResponse';
import { Pagination } from '../components/Pagination';


function ProductList() {
	const [products, setProducts] = useState<ProductResponse[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 5,
		totalItems: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPreviousPage: false
	});
	const [loading, setLoading] = useState(false);

	const getData = async (page: number = 1, limit: number = 5) => {
		setLoading(true);
		try {
			const response = await fetch(`${BASE_URL}/products?page=${page}&limit=${limit}`);
			const data = await response.json() as ProductListResponse;

			setProducts(data.products);
			setPagination(data.pagination);
		} catch (error) {
			console.error("error", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (page: number) => {
		getData(page, pagination.limit);
	};

	const handleLimitChange = (limit: number) => {
		getData(1, limit); // Reset to page 1 when changing limit
	};

	useEffect(() => {
		getData();
	}, []);
	return (
		<div className='bg-white'>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-semibold'>Products</h1>
				
				{loading ? (
					<div className="flex items-center justify-center min-h-64">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
							{products.map((product) => (
								<div key={product.id} className='bg-white rounded-lg shadow-md flex flex-col h-full'>
									<img
										src={product.image}
										alt={product.name}
										className='w-full h-48 object-cover object-center rounded-t-lg'
									/>
									<div className='p-4 flex flex-col flex-grow'>
										<h2 className='text-xl font-semibold'>{product.name}</h2>
										<p className='text-gray-500 mt-2 flex-grow'>{product.description}</p>
										<p className='text-gray-500 mt-2'>${product.price}</p>
										<div className='flex items-center justify-between mt-2'>
											<span className='text-xs text-gray-400'>{product.skuNumber}</span>
											<span 
												className='w-4 h-4 rounded-full border' 
												style={{ backgroundColor: product.color }}
												title={`Color: ${product.color}`}
											></span>
										</div>
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

						<Pagination
							currentPage={pagination.page}
							totalPages={pagination.totalPages}
							totalItems={pagination.totalItems}
							limit={pagination.limit}
							hasNextPage={pagination.hasNextPage}
							hasPreviousPage={pagination.hasPreviousPage}
							onPageChange={handlePageChange}
							onLimitChange={handleLimitChange}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default ProductList;
