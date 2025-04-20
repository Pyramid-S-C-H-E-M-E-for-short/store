/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

// const BASE_URL = 'http://localhost:8787'
const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null)
  const [authenticators, setAuthenticators] = useState<any[]>([])
  const [message, setMessage] = useState<string>('')

  const getProfile = async () => {
    const res = await fetch(`${BASE_URL}/profile`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch profile')
    const data = await res.json()
    setProfile(data)
  }

  const getAuthenticators = async () => {
    const res = await fetch(`${BASE_URL}/webauthn/authenticators`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch authenticators')
    const data: any[] = await res.json()
    setAuthenticators(data)
  }

  const handleAddPasskey = async () => {
    try {
      setMessage('Starting passkey registration...');
      const beginRes = await fetch(`${BASE_URL}/webauthn/register/begin`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email: profile.email }),
      });
  
      if (!beginRes.ok) {
        setMessage('Begin registration failed');
        return;
      }
  
      const options = (await beginRes.json()) as {
        challenge: string;
        user: { id: string; [key: string]: any };
        [key: string]: any;
      };
  
      // Convert Base64URL to Base64
      const base64ToBase64Url = (base64url: string): string => {
        return base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(base64url.length + (4 - (base64url.length % 4)) % 4, '=');
      };
  
      const challengeBase64 = base64ToBase64Url(options.challenge);
  
      const credential = (await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: Uint8Array.from(atob(challengeBase64), (c) => c.charCodeAt(0)),
          user: {
            ...options.user,
            id: Uint8Array.from(String(options.user.id), (c) => c.charCodeAt(0)),
            displayName: '',
            name: '',
          },
          pubKeyCredParams: [],
          rp: { id: 'rc-store.benhalverson.dev', name: "Lulu's Raceshop" },
        },
      })) as PublicKeyCredential | null;
      console.log('credential:', credential);
  
      if (!credential) {
        setMessage('User cancelled passkey creation');
        return;
      }
  
      const credentialResponse = {
        id: credential.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        type: credential.type,
        response: {
          clientDataJSON: btoa(
            String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))
          ),
          attestationObject: btoa(
            String.fromCharCode(...new Uint8Array((credential.response as any).attestationObject))
          ),
        },
      };
  
      const finishRes = await fetch(`${BASE_URL}/webauthn/register/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentialResponse),
      });
  
      if (!finishRes.ok) {
        setMessage('Finish registration failed');
        return;
      }
  
      setMessage('Passkey added!');
      await getAuthenticators();
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
  };
  const handleRemove = async (id: string) => {
    await fetch(`${BASE_URL}/webauthn/authenticators/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    await getAuthenticators()
  }

  useEffect(() => {
    getProfile()
    getAuthenticators()
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Profile</h2>
      {profile ? (
        <ul>
          <li>ID: {profile.id}</li>
          <li>Email: {profile.email}</li>
        </ul>
      ) : (
        <p>Loading profile...</p>
      )}

      <h3>Passkeys</h3>
      {authenticators.length === 0 && <p>No passkeys registered.</p>}
      <ul>
        {authenticators.map((auth: any) => (
          <li key={auth.credentialId}>
            <span>{auth.credentialId.slice(0, 10)}...</span>
            <button onClick={() => handleRemove(auth.credentialId)} style={{ marginLeft: '1rem' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddPasskey}>Add New Passkey</button>

      {message && <p>{message}</p>}
    </div>
  )
}

export default Profile
