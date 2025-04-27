import ContactInformation from "../components/ContactInformation";
import InputField from '../components/InputField';
import OrderSummary from "../components/OrderSummary";
import ShippingInformation from "../components/ShippingInformation";
import { CheckoutProvider } from "../context/CheckoutContext";

export default function Checkout() {
	return (
		<CheckoutProvider>
			<div className="bg-gray-50">
				<div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
					<h2 className="sr-only">Checkout</h2>
					<form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
						<div>
							<ContactInformation />
							<ShippingInformation />
							{/* Payment Section */}
							<div className="mt-10 border-t border-gray-200 pt-10">
                <InputField id="cardNumber" label="Card Number" autoComplete="cc-number" />
                <InputField id="NameOnCard" label="Name on Card" autoComplete="name-on-card" />
                <InputField id="expirationDate" label="Expiration Date" autoComplete="cc-exp" />
                <InputField id="cvv" label="CVV" autoComplete="cc-cvc" />
								
							</div>
						</div>
						<OrderSummary />
					</form>
				</div>
			</div>
		</CheckoutProvider>
	);
}
