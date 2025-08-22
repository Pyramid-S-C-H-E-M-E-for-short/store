import React from 'react';
import Cart from './Cart';
import { CartProvider } from '../context/CartContext';

const ShoppingCart: React.FC = () => {
  return (
    <CartProvider>
      <div>
        <Cart />
      </div>)
    </CartProvider>
  );
};

export default ShoppingCart;