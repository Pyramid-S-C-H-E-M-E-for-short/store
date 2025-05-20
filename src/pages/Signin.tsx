import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { BASE_URL } from '../config';
import { base64urlToUint8Array, bufferToBase64 } from '../utils/webauthn';

const Signin = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState<"password" | "passkey">("password");

	const schema = z.object({
		email: z.string().email({ message: "Invalid email address" }),
		password: z.string().min(6, { message: "Password must be at least 6 characters" }),
	});

	type FormData = z.infer<typeof schema>;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	// For passkey, we only need email
	const {
		register: registerPasskey,
		getValues: getValuesPasskey,
		formState: { errors: errorsPasskey },
		handleSubmit: handleSubmitPasskey,
	} = useForm<{ email: string }>({
		resolver: zodResolver(
			z.object({ email: z.string().email({ message: "Invalid email" }) })
		),
	});

	const onSubmitPasswordLogin = async (data: FormData) => {
		setLoading(true);
		const toastId = toast.loading("Signing in...");
		try {
			const res = await fetch(`${BASE_URL}/auth/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(data),
			});

			if (!res.ok) throw new Error("Invalid credentials");
			toast.success("Signed in!", { id: toastId });
			navigate("/profile");
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast.error(`Login failed: ${err.message}`, { id: toastId });
			} else {
				toast.error("Login failed", { id: toastId });
			}
		} finally {
			setLoading(false);
		}
	};

	const handlePasskeyLogin = async (data?: { email: string }) => {
		const email = data?.email || getValuesPasskey("email");
		if (!email) {
			toast.error("Enter your email to continue with passkey");
			return;
		}

		setLoading(true);
		const toastId = toast.loading("Authenticating with passkey...");

		try {
			const beginRes = await fetch(`${BASE_URL}/webauthn/auth/begin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email }),
			});

			if (!beginRes.ok)
				throw new Error("User not registered or no passkey found");

			const { options } = (await beginRes.json()) as {
				options: PublicKeyCredentialRequestOptions;
			};

			options.challenge = base64urlToUint8Array(
				options.challenge as unknown as string
			).buffer;
			options.allowCredentials = options.allowCredentials?.map((cred) => ({
				...cred,
				id:
					typeof cred.id === "string"
						? base64urlToUint8Array(cred.id)
						: cred.id,
			}));


			const credential = (await navigator.credentials.get({
				publicKey: options,
			})) as PublicKeyCredential | null;

			console.log('credential', credential);

			if (!credential) throw new Error("User cancelled passkey login");

			const authResp = credential.response as AuthenticatorAssertionResponse;

			const payload = {
				email,
				response: {
					id: base64urlToUint8Array(credential.id),
					rawId: bufferToBase64(credential.rawId),
					type: credential.type,
					response: {
						authenticatorData: bufferToBase64(authResp.authenticatorData),
						clientDataJSON: bufferToBase64(authResp.clientDataJSON),
						signature: bufferToBase64(authResp.signature),
						userHandle: authResp.userHandle
							? bufferToBase64(authResp.userHandle)
							: null,
					},
				},
			};

			console.log('payload', payload);

			const finishRes = await fetch(`${BASE_URL}/webauthn/auth/finish`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(payload),
			});
			console.log('finishRes', finishRes);

			if (!finishRes.ok) {
				const result = (await finishRes.json()) as { error?: string };
				console.log('error', result);
				throw new Error(result.error || "Passkey verification failed");
			}

			toast.success("Passkey login successful!", { id: toastId });
			navigate("/profile");
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.log('catch error', err);
				toast.error(`Login failed: ${err.message}`, { id: toastId });
			} else {
				toast.error("Login failed", { id: toastId });
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
			<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
				Sign In
			</h2>

			{/* Tab Switcher */}
			<div className="flex mb-6">
				<button
					className={`flex-1 py-2 rounded-tl-md rounded-bl-md border border-b-0 ${
						tab === "password"
							? "bg-blue-600 text-white"
							: "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
					} transition`}
					onClick={() => setTab("password")}
					type="button"
					disabled={loading}
				>
					Password
				</button>
				<button
					className={`flex-1 py-2 rounded-tr-md rounded-br-md border border-b-0 ${
						tab === "passkey"
							? "bg-blue-600 text-white"
							: "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
					} transition`}
					onClick={() => setTab("passkey")}
					type="button"
					disabled={loading}
				>
					Passkey
				</button>
			</div>

			{/* Password Login Tab */}
			{tab === "password" && (
				<form
					onSubmit={handleSubmit(onSubmitPasswordLogin)}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Email
						</label>
						<input
							type="email"
							{...register("email")}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
						/>
						{errors.email && (
							<p className="text-sm text-red-600 mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Password
						</label>
						<input
							type="password"
							{...register("password")}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
						/>
						{errors.password && (
							<p className="text-sm text-red-600 mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
					>
						Sign In with Password
					</button>
				</form>
			)}

			{/* Passkey Login Tab */}
			{tab === "passkey" && (
				<form
					onSubmit={handleSubmitPasskey(handlePasskeyLogin)}
					className="space-y-4"
				>
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Email
						</label>
						<input
							type="email"
							{...registerPasskey("email")}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
						/>
						{errorsPasskey.email && (
							<p className="text-sm text-red-600 mt-1">
								{errorsPasskey.email.message}
							</p>
						)}
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition disabled:opacity-50"
					>
						Passkey Login
					</button>
				</form>
			)}
		</div>
	);
};

export default Signin;
