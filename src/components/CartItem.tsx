import { CartItemsProps } from '../interfaces/cartItem';

const CartItem = ({ name, imageUrl, price, quantity}: CartItemsProps) => {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img src={imageUrl} alt={name} className="w-20 h-20 object-cover rounded" />
        <div>
          <h2 className="font-semibold">{name}</h2>
          <p className="text-gray-500">Qty: {quantity}</p>
        </div>
        <div className="flex items-center space-x-6">
          <p className="text-gray-500">${(price * quantity).toFixed(2)}</p>
        </div>
        <button className="text-red-500 hover:text-red-700">
          Remove
        </button>

      </div>

    </div>
  )
}

export default CartItem