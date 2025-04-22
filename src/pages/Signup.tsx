import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tab } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { bufferToBase64, base64urlToUint8Array } from '../utils/webauthn';

const BASE_URL = 'https://3dprinter-web-api.benhalverson.workers.dev';

const schema = z.object({
	email: z.string().email({ message: 'Invalid email' }),
	password: z.string().min(6, { message: 'Password is required' }),
});

type FormData = z.infer<typeof schema>;

const Signup = () => {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
	} = useForm<FormData>({ resolver: zodResolver(schema) });

	const handlePasswordSignup = async (data: FormData) => {
		const toastId = toast.loading('Signing up...');
		try {
			const res = await fetch(`${BASE_URL}/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error('Signup failed');

			toast.success('Signup successful!', { id: toastId });
			navigate('/profile');
		} catch (err: any) {
			toast.error(`Error: ${err.message}`, { id: toastId });
		}
	};

	const handlePasskeyOnlySignup = async () => {
		const email = getValues('email');
		if (!email) return toast.error('Please enter an email');

		const toastId = toast.loading('Creating passkey account...');
		try {
			const res = await fetch(`${BASE_URL}/signup-passkey-only`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ email }),
			});
			if (!res.ok) throw new Error('Failed to initiate passkey signup');

			// Begin WebAuthn registration
			const beginRes = await fetch(`${BASE_URL}/webauthn/register/begin`, {
				method: 'POST',
				credentials: 'include',
			});
			if (!beginRes.ok) throw new Error('Failed to begin WebAuthn registration');

			const options = await beginRes.json();
			options.challenge = base64urlToUint8Array(options.challenge);
			options.user.id = base64urlToUint8Array(options.user.id);

			const credential = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential;
			if (!credential) throw new Error('User cancelled credential creation');

			const response = credential.response as AuthenticatorAttestationResponse;

			const formatted = {
				id: credential.id,
				rawId: bufferToBase64(credential.rawId),
				type: credential.type,
				response: {
					clientDataJSON: bufferToBase64(response.clientDataJSON),
					attestationObject: bufferToBase64(response.attestationObject),
				},
			};

			const finishRes = await fetch(`${BASE_URL}/webauthn/register/finish`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formatted),
			});
			if (!finishRes.ok) throw new Error('Failed to finish WebAuthn');

			toast.success('Passkey signup complete!', { id: toastId });
			navigate('/profile');
			reset();
		} catch (err: any) {
			toast.error(`Error: ${err.message}`, { id: toastId });
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white dark:bg-gray-900 dark:border-gray-700">
			<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Sign Up</h2>

			<Tab.Group>
				<Tab.List className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-gray-800 p-1 mb-4">
					<Tab className={({ selected }) =>
						`w-full py-2 text-sm font-medium rounded-lg focus:outline-none ${
							selected
								? 'bg-blue-600 text-white'
								: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
						}`
					}>
						Password
					</Tab>
					<Tab className={({ selected }) =>
						`w-full py-2 text-sm font-medium rounded-lg focus:outline-none ${
							selected
								? 'bg-blue-600 text-white'
								: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
						}`
					}>
						Passkey Only
					</Tab>
				</Tab.List>

				<Tab.Panels>
					<Tab.Panel>
						<form onSubmit={handleSubmit(handlePasswordSignup)} className="space-y-4">
							<div>
								<label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
								<input
									type="email"
									{...register('email')}
									className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
								/>
								{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
							</div>

							<div>
								<label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
								<input
									type="password"
									{...register('password')}
									className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
								/>
								{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
							</div>

							<button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">
								Sign Up with Password
							</button>
						</form>
					</Tab.Panel>

					<Tab.Panel>
						<div className="space-y-4">
							<div>
								<label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
								<input
									type="email"
									{...register('email')}
									className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
								/>
								{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
							</div>

							<button
								onClick={handlePasskeyOnlySignup}
								className="w-full py-2 bg-gray-800 text-white rounded-md"
							>
								Register with Passkey Only
							</button>
						</div>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Signup;
