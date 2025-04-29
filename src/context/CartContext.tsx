import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CartContextProps, CartItem } from "../interfaces/cartItem";

const CartContext = createContext<CartContextProps | undefined>(undefined);

const TAB_ID = Math.random().toString(36).slice(2);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    console.log('storedCart', storedCart);
    try {
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart.filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel("cart_channel");
    channelRef.current = channel;

    const handler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "sync" && message.sender !== TAB_ID) {
        if (Array.isArray(message.payload)) {
          setCart(message.payload);
        }
      }
    };

    channel.addEventListener("message", handler);

    const resync = () => {
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCart(parsed.filter(Boolean));
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("focus", resync);

    return () => {
      channel.removeEventListener("message", handler);
      window.removeEventListener("focus", resync);
      channel.close();
    };
  }, []);

  const syncCart = (newCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    channelRef.current?.postMessage({
      type: "sync",
      sender: TAB_ID,
      payload: newCart,
    });
  };

  const addToCart = (item: CartItem) => {
    if (!item || !item.id) return;

    setCart((prev) => {
      const existingItem = prev.find(
        (p) =>
          p.id === item.id &&
          p.color === item.color &&
          p.filamentType === item.filamentType
      );

      const updatedCart = existingItem
        ? prev.map((p) =>
            p.id === item.id &&
            p.color === item.color &&
            p.filamentType === item.filamentType
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          )
        : [...prev, item];

      syncCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (itemToRemove: CartItem) => {
    setCart((prev) => {
      const updatedCart = prev.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.color === itemToRemove.color &&
            item.filamentType === itemToRemove.filamentType
          )
      );

      syncCart(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    const emptyCart: CartItem[] = [];
    setCart(emptyCart);
    syncCart(emptyCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be inside a CartProvider");
  return context;
}
