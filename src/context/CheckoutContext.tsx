import { createContext, ReactNode, useContext, useState } from "react";
import { PaymentMethod } from "../interfaces/paymentMethod";
import { Product } from "../interfaces/product";

interface CheckoutContextProps {
	products: Product[];
	paymentMethod: PaymentMethod[];
	removeProduct: (id: number) => void;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(
	undefined
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod[]>([]);

	try {
    // TODO: Write an endpoint to fetch the payment methods
		console.log("CheckoutProvider");
	} catch (error) {
		console.error(error);
	}

	const removeProduct = (id: number) => {
		setProducts(products.filter((product) => product.id !== id));
	};

	return (
		<CheckoutContext.Provider
			value={{ products, paymentMethod, removeProduct }}
		>
			{children}
		</CheckoutContext.Provider>
	);
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};