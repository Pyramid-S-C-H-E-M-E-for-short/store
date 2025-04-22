import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useState } from "react";

// const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev";
const BASE_URL = "http://localhost:8787";

const base64urlToUint8Array = (input: string): Uint8Array => {
	const base64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

const bufferToBase64 = (buffer: ArrayBuffer | ArrayBufferView): string => {
	const arrayBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
	return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};

// zod schema
const schema = z.object({
	email: z.string().email({ message: "Invalid email" }),
	password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

type AuthBeginResponse = {
	options: PublicKeyCredentialRequestOptions;
};

const Signin = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
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

	const handlePasskeyLogin = async () => {
		const email = getValues("email");
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

			if (!beginRes.ok) throw new Error("User not registered or no passkey found");

			const { options } = (await beginRes.json()) as AuthBeginResponse;

			options.challenge = base64urlToUint8Array(options.challenge as unknown as string).buffer;
			options.allowCredentials = options.allowCredentials?.map((cred) => ({
				...cred,
				id: cred.id
			}));

			const credential = (await navigator.credentials.get({
				publicKey: options,
			})) as PublicKeyCredential | null;

			if (!credential) throw new Error("User cancelled passkey login");

			const authResp = credential.response as AuthenticatorAssertionResponse;

			const payload = {
				email,
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
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(payload),
			});

			if (!finishRes.ok) {
				const result = (await finishRes.json()) as { error?: string };
				throw new Error(result.error || "Passkey verification failed");
			}

			toast.success("Passkey login successful!", { id: toastId });
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

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
			<h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Sign In</h2>

			<form onSubmit={handleSubmit(onSubmitPasswordLogin)} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
					<input
						type="email"
						{...register("email")}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
					/>
					{errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
					<input
						type="password"
						{...register("password")}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
					/>
					{errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
				</div>

				<div className="flex gap-3">
					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50"
					>
						Sign In with Password
					</button>
					<button
						type="button"
						onClick={handlePasskeyLogin}
						disabled={loading}
						className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition disabled:opacity-50"
					>
						Passkey Login
					</button>
				</div>
			</form>
		</div>
	);
};

export default Signin;
