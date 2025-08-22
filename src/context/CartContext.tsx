import React, { createContext, useContext, useState } from "react";

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

interface CartContextType {
  cart: Product[];
  addItemToCart: (item: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addItemToCart = (item: Product) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};
