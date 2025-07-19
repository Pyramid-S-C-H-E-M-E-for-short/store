export interface InputFieldProps {
	id: string;
	label: string;
	autoComplete?: string;
}

// interfaces/inputField.ts
export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
}
