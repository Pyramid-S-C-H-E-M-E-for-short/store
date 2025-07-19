/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BASE_URL, DOMAIN } from "../config";
import toast from 'react-hot-toast';


const Profile = () => {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [form,   setForm]   = useState<Profile | null>(null); // editable copy
	const [authenticators, setAuthenticators] = useState<any[]>([]);
	const [message, setMessage] = useState("");
	const [editMode, setEditMode] = useState(false);

	const getProfile = async () => {
		const res = await fetch(`${BASE_URL}/profile`, { credentials: "include" });
		if (!res.ok) throw new Error("Failed to fetch profile");
		setProfile(await res.json());
	};

	const getAuthenticators = async () => {
		const res = await fetch(`${BASE_URL}/webauthn/authenticators`, { credentials: "include" });
		if (!res.ok) throw new Error("Failed to fetch authenticators");
		setAuthenticators(await res.json());
	};

	const handleEdit  = () => { setForm(profile); setEditMode(true); };
	const handleAbort = () => { setEditMode(false); setForm(null); };

	const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
		setForm((f) => (f ? { ...f, [e.target.name]: e.target.value } as Profile : f));

	const handleSave = async (e: FormEvent) => {
		e.preventDefault();
		if (!form) return;
		const res = await fetch(`${BASE_URL}/profile/${profile?.id}`, {
			method: "POST", credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		if (!res.ok) {
			toast.error("Failed to update profile");
			return;
		}
		setProfile(await res.json());
		setEditMode(false);
		toast.success("Profile updated successfully");
	};

	const handleAddPasskey = () => {};
	const handleRemove     = () => {};

	useEffect(() => { getProfile(); getAuthenticators(); }, []);

	return (
		<div className="p-6 max-w-xl mx-auto space-y-6">
			<header className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Profile</h2>
				{!editMode && (
					<button
						onClick={handleEdit}
						className="rounded bg-blue-600 text-white px-4 py-1 hover:bg-blue-700"
					>
						Edit
					</button>
				)}
			</header>

	
			{!editMode && profile && (
				<ul className="space-y-1">
					<li><strong>Email:</strong> {profile.email}</li>
					<li><strong>Phone:</strong> {profile.phone}</li>
					<li><strong>First Name:</strong> {profile.firstName}</li>
					<li><strong>Last Name:</strong> {profile.lastName}</li>
					<li><strong>Shipping Address:</strong> {profile.shippingAddress}</li>
					<li><strong>City:</strong> {profile.city}</li>
					<li><strong>State:</strong> {profile.state}</li>
					<li><strong>Zip:</strong> {profile.zipCode}</li>
					<li><strong>Country:</strong> {profile.country}</li>
				</ul>
			)}

			{editMode && form && (
				<form onSubmit={handleSave} className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<Input name="firstName" label="First name" value={form.firstName} onChange={handleChange} />
						<Input name="lastName"  label="Last name"  value={form.lastName}  onChange={handleChange} />
						<Input name="email"     label="Email"     value={form.email}     onChange={handleChange} />
						<Input name="phone"     label="Phone"     value={form.phone}     onChange={handleChange} />
						<Input name="shippingAddress"   label="Address"   value={form.shippingAddress}   onChange={handleChange} />
						<Input name="city"      label="City"      value={form.city}      onChange={handleChange} />
						<Input name="state"     label="State"     value={form.state}     onChange={handleChange} />
						<Input name="zipCode"   label="Zip"       value={form.zipCode}   onChange={handleChange} />
						<Input name="country"   label="Country"   value={form.country}   onChange={handleChange} />
					</div>

					<div className="flex gap-3">
						<button type="submit" className="rounded bg-green-600 text-white px-4 py-1 hover:bg-green-700">
							Save
						</button>
						<button type="button" onClick={handleAbort} className="rounded bg-gray-200 px-4 py-1 hover:bg-gray-300">
							Cancel
						</button>
					</div>
				</form>
			)}

			
			<section className="space-y-2">
				<h3 className="text-xl font-semibold">Passkeys</h3>
				{authenticators.length === 0 && <p>No passkeys registered.</p>}

				<ul className="space-y-1">
					{authenticators.map((auth) => (
						<li key={auth.credentialId} className="flex items-center justify-between">
							<span className="font-mono text-sm">{auth.credentialId.slice(0, 10)}…</span>
							<button
								onClick={() => handleRemove(auth.credentialId)}
								className="text-red-600 hover:underline"
							>
								Remove
							</button>
						</li>
					))}
				</ul>

				<button
					onClick={handleAddPasskey}
					className="rounded bg-blue-600 text-white px-4 py-1 hover:bg-blue-700"
				>
					Add New Passkey
				</button>
			</section>

			{message && <p className="text-sm text-gray-600">{message}</p>}
		</div>
	);
};


const Input = ({
	name,
	label,
	value,
	onChange,
}: {
	name: keyof Profile;
	label: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
	<label className="flex flex-col text-sm">
		<span className="mb-1 font-medium">{label}</span>
		<input
			name={name}
			value={value}
			onChange={onChange}
			className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</label>
);

export interface Profile {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	shippingAddress: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	phone: string;
}

export default Profile;
