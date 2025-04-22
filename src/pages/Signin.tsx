import { useForm } from 'react-hook-form';
import { useState } from 'react';

const BASE_URL = 'https://3dprinter-web-api.benhalverson.workers.dev';

const base64urlToUint8Array = (input: string): Uint8Array => {
	const base64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
	return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
};

const bufferToBase64 = (buffer: ArrayBuffer): string => {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

type FormData = {
	email: string;
	password: string;
};

const Signin = () => {
	const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>();
	const [message, setMessage] = useState('');

	const onSubmitPasswordLogin = async (data: FormData) => {
		try {
			const res = await fetch(`${BASE_URL}/auth/signin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(data),
			});

			if (!res.ok) throw new Error('Password sign-in failed');
			setMessage('Signed in. Redirecting...');
			window.location.href = '/profile';
		} catch (err: any) {
			setMessage(`Error: ${err.message}`);
		}
	};

	const handlePasskeyLogin = async () => {
		const email = getValues('email');
		if (!email) {
			setMessage('Please enter your email to use passkey login.');
			return;
		}

		try {
			setMessage('Starting passkey authentication...');
			const beginRes = await fetch(`${BASE_URL}/webauthn/auth/begin`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ email }),
			});

			if (!beginRes.ok) throw new Error('User not registered or no passkey found');
			const { options, userId } = await beginRes.json();

			options.challenge = base64urlToUint8Array(options.challenge);
			options.allowCredentials = options.allowCredentials.map((cred: any) => ({
				...cred,
				id: base64urlToUint8Array(cred.id),
			}));

			const credential = (await navigator.credentials.get({ publicKey: options })) as PublicKeyCredential;
			if (!credential) throw new Error('User cancelled passkey login');

			const authResp = credential.response as AuthenticatorAssertionResponse;

			const payload = {
				userId,
				response: {
					id: credential.id,
					rawId: bufferToBase64(credential.rawId),
					type: credential.type,
					response: {
						authenticatorData: bufferToBase64(authResp.authenticatorData),
						clientDataJSON: bufferToBase64(authResp.clientDataJSON),
						signature: bufferToBase64(authResp.signature),
						userHandle: authResp.userHandle ? bufferToBase64(authResp.userHandle) : null,
					},
				},
			};

			const finishRes = await fetch(`${BASE_URL}/webauthn/auth/finish`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(payload),
			});

			if (!finishRes.ok) {
				const { error } = await finishRes.json();
				throw new Error(`Authentication failed: ${error}`);
			}

			setMessage('Passkey login successful!');
			// window.location.href = '/profile';
		} catch (err: any) {
			setMessage(`Login error: ${err.message}`);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
			<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Sign In</h2>

			<form onSubmit={handleSubmit(onSubmitPasswordLogin)} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
					<input
						type="email"
						{...register('email', { required: 'Email is required' })}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
					/>
					{errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
					<input
						type="password"
						{...register('password', { required: 'Password is required' })}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
					/>
					{errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
				</div>

				<div className="flex gap-3">
					<button
						type="submit"
						className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
					>
						Sign In with Password
					</button>
					<button
						type="button"
						onClick={handlePasskeyLogin}
						className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition"
					>
						Passkey Login
					</button>
				</div>

				{message && (
					<p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>
				)}
			</form>
		</div>
	);
};

export default Signin;
