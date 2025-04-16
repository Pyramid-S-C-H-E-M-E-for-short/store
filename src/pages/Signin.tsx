import { useState } from 'react'

const Signin = () => {
  const BASE_URL = 'http://localhost:8787'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const signIn = async () => {
    try {
      const response = await fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setMessage('Signin failed')
        return
      }

      setMessage('Signin successful, redirecting...')
      const data = await response.json()
      console.log('data', data)
      // window.location.href = '/profile'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log('Error:', err)
      setMessage('Error: ' + err.message)
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px' }}>
      <h2>Sign In</h2>
      <div>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      <button onClick={signIn}>Sign In</button>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Signin
