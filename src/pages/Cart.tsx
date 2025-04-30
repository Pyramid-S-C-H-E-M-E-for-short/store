import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
	const { cart, removeFromCart, clearCart } = useCart();

	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	if (cart.length === 0) {
		return (
			<div className="text-center py-20">
				<h1 className="text-2xl font-semibold">Your cart is empty</h1>
				<Link
					to="/"
					className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
				>
					Continue Shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">My Cart</h1>

			<div className="space-y-6">
				{cart.map((item) => (
					<div
						key={`${item.id}-${item.color}-${item.filamentType}`}
						className="flex justify-between items-center border-b pb-4"
					>
						<div className="flex items-center space-x-4">
							{item.image && (
								<img
									src={item.image}
									alt={item.name}
									className="w-16 h-16 object-cover rounded"
								/>
							)}
							<div>
								<h2 className="font-medium">{item.name}</h2>
								<p className="text-sm text-gray-500">Color: {item.color}</p>
								<p className="text-sm text-gray-500">
									Filament: {item.filamentType}
								</p>
								<p className="text-sm text-gray-500">Qty: {item.quantity}</p>
							</div>
						</div>

						<div className="text-right">
							<p className="font-semibold">
								${(item.price * item.quantity).toFixed(2)}
							</p>
							<button
								onClick={() => removeFromCart(item)}
								className="text-red-500 text-sm hover:underline mt-2"
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 pt-6">
				<div className="flex justify-between text-xl font-semibold">
					<span>Subtotal</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>

				<div className="mt-6 space-y-3">
					<Link to="/checkout">
						<button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
							Secure Checkout
						</button>
					</Link>

					<button onClick={clearCart} className="w-full text-red-500 underline">
						Clear Cart
					</button>
				</div>
			</div>
		</div>
	);
}
