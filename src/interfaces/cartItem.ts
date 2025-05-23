export interface CartItemsProps  {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onRemove: (id: string) => void;
}


export interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  updateQuantity: (item: CartItem, quantity: number) => void;
}


export type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  color: string;
  filamentType: string;
  // Optionally add more fields as needed
};
