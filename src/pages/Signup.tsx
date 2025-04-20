/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

const Signup: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const BASE_URL = "http://localhost:8787";

	const handleSignup = async () => {
		try {
			// 1. Signup via password
			const signupRes = await fetch(`${BASE_URL}/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			if (!signupRes.ok) {
				setMessage("Signup failed");
				return;
			}

			setMessage("Signup successful, beginning passkey registration...");

			// 2. Begin passkey registration
			const beginRes = await fetch(`${BASE_URL}/webauthn/register/begin`, {
				method: "POST",
				credentials: "include",
			});

			if (!beginRes.ok) {
				setMessage("Passkey registration begin failed");
				return;
			}

			const options = await beginRes.json();

			// 3. Call WebAuthn API
			const credential = (await navigator.credentials.create({
				publicKey: {
					...options,
					challenge: Uint8Array.from(atob(options.challenge), (c) =>
						c.charCodeAt(0)
					),
					user: {
						...options.user,
						id: Uint8Array.from(String(options.user.id), (c) =>
							c.charCodeAt(0)
						),
					},
				},
			})) as PublicKeyCredential | null;

			if (!credential) {
				setMessage("User cancelled passkey creation");
				return;
			}

			// 4. Format credential for the server
			const credentialResponse = {
				id: credential.id,
				rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
				type: credential.type,
				response: {
					clientDataJSON: btoa(
						String.fromCharCode(
							...new Uint8Array(credential.response.clientDataJSON)
						)
					),
					attestationObject: btoa(
						String.fromCharCode(
							...new Uint8Array((credential.response as any).attestationObject)
						)
					),
				},
			};

			// 5. Finish passkey registration
			const finishRes = await fetch(`${BASE_URL}/webauthn/register/finish`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(credentialResponse),
			});

			if (!finishRes.ok) {
				setMessage("Passkey registration finish failed");
				return;
			}

			setMessage("Signup + Passkey registration successful! Redirecting...");
			window.location.href = "/profile";
		} catch (error: any) {
			console.error(error);
			setMessage("Error: " + error.message);
		}
	};

	return (
		<div style={{ border: "1px solid #ccc", padding: "16px" }}>
			<h2>Signup</h2>
			<div>
				<label>Email</label>
				<input value={email} onChange={(e) => setEmail(e.target.value)} />
			</div>
			<div>
				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button onClick={handleSignup}>Sign Up + Register Passkey</button>
			{message && <p>{message}</p>}
		</div>
	);
};

export default Signup;
