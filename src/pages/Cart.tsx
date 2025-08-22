import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  stl: string;
  price: number;
  filamentType: string;
  skuNumber: string;
  color: string;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const { cart, addItemToCart } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          "https://3dprinter-web-api.benhalverson.workers.dev/product/1"
        );
        const data: Product = await response.json();
        setItems([data]); // Assuming the API returns a single product
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-gray-800 font-bold mt-2">
              Price: ${item.price.toFixed(2)}
            </p>
            <button
              onClick={() => addItemToCart(item)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10">Cart Items</h2>
      {cart.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {cart.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-gray-600">Your cart is empty.</p>
      )}
    </>
  );
};

export default Cart;
