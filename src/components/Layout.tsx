import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

export function Layout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/signout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        navigate('/signin');
      } else {
        console.error('Failed to sign out');
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/signup" className="hover:underline">
            Signup
          </Link>
          <Link to="/signin" className="hover:underline">
            Signin
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Sign Out
        </button>
      </nav>

      <main className="p-6 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
