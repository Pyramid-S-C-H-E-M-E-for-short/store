/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

const BASE_URL = 'http://localhost:8787'
const Profile = () => {

  const [profile, setProfile] = useState<any>('');
  const getData = async () => {
    try {
     const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      credentials: 'include', 
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('data', data)
    setProfile(data); 
    } catch (error) {
      console.log('Error:', error);
    }
  }

  useEffect(() => {
    getData()
  }, []);
  return (
    <div>
      <h1>Profile</h1>
      <ul>
        <li>{profile.id}</li>
        <li>{profile.email}</li>
      </ul>
      
      <button onClick={getData}>Get Profile</button>
    </div>
  )
}

export default Profile