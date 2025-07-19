export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	autoComplete?: string;
}
