const InputField = ({ id, label, autoComplete }: InputFIeldProps) => {
	return (
		<div>
			<label htmlFor={id} className="block text-sm/6 font-medium text-gray-700">
				{label}
			</label>
			<div className="mt-2">
				<input
					id={id}
					name={id}
					type="text"
					autoComplete={autoComplete}
					className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-ind
igo-600 sm:text-sm/6"
				/>
			</div>
		</div>
	);
};

export default InputField;

interface InputFIeldProps {
	id: string;
	label: string;
	autoComplete?: string;
}
