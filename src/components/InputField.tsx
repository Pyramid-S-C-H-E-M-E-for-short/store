import { forwardRef } from 'react';
import { InputFieldProps } from '../interfaces/inputField';

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	({ id, label, autoComplete, ...rest }, ref) => {
		return (
			<div>
				<label htmlFor={id} className="block text-sm/6 font-medium text-gray-700">
					{label}
				</label>
				<div className="mt-2">
					<input
						ref={ref}
						id={id}
						name={id}
						autoComplete={autoComplete}
						className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						{...rest}
					/>
				</div>
			</div>
		);
	}
);

InputField.displayName = 'InputField';
export default InputField;
