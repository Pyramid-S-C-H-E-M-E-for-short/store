/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const Signin = () => {
	// const BASE_URL = "http://localhost:8787";
	const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handlePasswordLogin = async () => {
		try {
			const response = await fetch(`${BASE_URL}/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				setMessage("Password sign-in failed");
				return;
			}

			setMessage("Signed in with password. Redirecting...");
			window.location.href = "/profile";
		} catch (err: any) {
			console.error(err);
			setMessage("Error: " + err.message);
		}
	};

	const handlePasskeyLogin = async () => {
		setMessage("Starting passkey authentication...");

		try {
			// 1. Begin passkey login
			const beginRes = await fetch(`${BASE_URL}/webauthn/auth/begin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email }),
			});

			if (!beginRes.ok) {
				setMessage("No passkey found or user not registered");
				return;
			}

			const { options, userId } = (await beginRes.json()) as any;

			// Helper to decode base64url to Uint8Array
			const decodeBase64url = (input: string | Uint8Array): Uint8Array => {
				if (input instanceof Uint8Array) return input;
				const base64 = input
					.replace(/-/g, "+")
					.replace(/_/g, "/")
					.padEnd(Math.ceil(input.length / 4) * 4, "=");
				return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
			};

			const credential = (await navigator.credentials.get({
				publicKey: {
					...options,
					challenge: decodeBase64url(options.challenge),
					allowCredentials: options.allowCredentials.map((cred: any) => {
						return {
							...cred,
							id: decodeBase64url(cred.id),
						};
					}),
				},
			})) as PublicKeyCredential | null;

			if (!credential) {
				setMessage("User canceled passkey login");
				return;
			}

			// 3. Build response payload
			const responsePayload = {
				userId,
				response: {
					id: credential.id,
					// rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
          rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),

					type: credential.type,
					response: {
						authenticatorData: btoa(
							String.fromCharCode(
								...new Uint8Array(
									(
										credential.response as AuthenticatorAssertionResponse
									).authenticatorData
								)
							)
						),
						clientDataJSON: btoa(
							String.fromCharCode(
								...new Uint8Array(credential.response.clientDataJSON)
							)
						),
						signature: btoa(
							String.fromCharCode(
								...new Uint8Array(
									(
										credential.response as AuthenticatorAssertionResponse
									).signature
								)
							)
						),
						userHandle: (credential.response as AuthenticatorAssertionResponse)
							.userHandle
							? btoa(
									String.fromCharCode(
										...new Uint8Array(
											(
												credential.response as AuthenticatorAssertionResponse
											).userHandle!
										)
									)
							  )
							: null,
					},
				},
			};

			// 4. Finish login
			const finishRes = await fetch(`${BASE_URL}/webauthn/auth/finish`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(responsePayload),
			});

			if (!finishRes.ok) {
				const { error } = await finishRes.json() as any;
				setMessage("Authentication failed: " + error);
				return;
			}

			setMessage("Passkey login successful!");
			// Optionally redirect here
			// window.location.href = '/profile';
		} catch (err: any) {
			setMessage("Login error: " + err.message);
		}
	};

	return (
		<div style={{ border: "1px solid #ccc", padding: "16px" }}>
			<h2>Sign In</h2>

			<label>Email</label>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<label>Password</label>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<div style={{ marginTop: "8px" }}>
				<button onClick={handlePasswordLogin}>Sign In with Password</button>
				<button onClick={handlePasskeyLogin} style={{ marginLeft: "8px" }}>
					Sign In with Passkey
				</button>
			</div>

			{message && <p>{message}</p>}
		</div>
	);
};

export default Signin;
