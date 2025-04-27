import { Link } from "react-router-dom";

export const EmptyCart = () => {
	return (
		<div className="flex flex-col items-center justify-center py-16">
			<div className="text-2xl font-bold mb-4">
				<h2 className='text-2xl font-bold mb-4'>Your cart is empty</h2>
				<Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
					Continue Shopping
				</Link>
			</div>
		</div>
	);
};
