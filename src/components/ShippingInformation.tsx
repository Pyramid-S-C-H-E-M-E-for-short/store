import InputField from "./InputField";

const ShippingInformation = () => {
	return (
		<div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
			<InputField id="firstName" label="First Name" autoComplete="given-name" />
			<InputField id="lastName" label="Last Name" autoComplete="family-name" />
			<InputField id="address" label="Address" autoComplete="street-address" />
			<InputField id="city" label="City" autoComplete="city" />
			<InputField id="state" label="State" autoComplete="state" />
			<InputField id="zipCode" label="Zip Code" autoComplete="zip-code" />
			<InputField id="phone" label="Phone" autoComplete="tel" />
		</div>
	);
};

export default ShippingInformation;
