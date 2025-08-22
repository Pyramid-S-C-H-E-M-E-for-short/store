import React from "react";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <li
      className="bg-white p-3 rounded shadow flex justify-between items-center"
    >
      <span>{item.name}</span>
      <span>${item.price.toFixed(2)}</span>
    </li>
  );
};

export default CartItem;
