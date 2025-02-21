function ContactInformation() {
	return (
		<div className="text-lg font-medium text-gray-900">
			<h2>Contact Info</h2>
			<div className="mt-4">
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email address
				</label>
				<input
					type="email"
					className="mt-2 block w-full rounded-md bg-white px-3 py-2 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 "
				/>
			</div>
		</div>
	);
}

export default ContactInformation;
