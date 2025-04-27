import { TrashIcon } from "@heroicons/react/20/solid";
import { useCheckout } from '../context/CheckoutContext';

export default function OrderSummary() {
  const { products, removeProduct } = useCheckout();

  console.log('products', products);
  const subtotal = products.reduce((total, product) => total + parseFloat(product.price.toString().replace("$", "")), 0);
  const shipping = 5.00;
  const taxes = subtotal * 0.086; // Assume 8.6% tax
  const total = subtotal + shipping + taxes;

  return (
    <div className="mt-10 lg:mt-0">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="flex px-4 py-6 sm:px-6">
              <div className="shrink-0">
                <img alt={product.imgSrc} src={product.imgSrc} className="w-20 rounded-md" />
              </div>
              <div className="ml-6 flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{product.color}</h4>
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <dl className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm">Shipping</dt>
            <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm">Taxes</dt>
            <dd className="text-sm font-medium text-gray-900">${taxes.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
          </div>
        </dl>
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700"
          >
            Confirm order
          </button>
        </div>
      </div>
    </div>
  );
}
