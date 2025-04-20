import { Routes, Route, Outlet, Link } from "react-router-dom";
import ProductPage from './pages/Product';
import ProductList from './pages/ProductList';
import { ColorProvider } from './context/ColorContext';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Signin from './pages/Signin';

function App() {

  return (
    <>

     <ColorProvider>
     <Routes>
    {/* Set ProductList as the default page */}
    <Route path="/" element={<Layout />}>
      <Route index element={<ProductList />} />
      <Route path="signup" element={<Signup />} />
      <Route path="signin" element={<Signin />} />
      <Route path="profile" element={<Profile />} />
      {/* Route to ProductPage with a dynamic product ID */}
      <Route path="product/:id" element={<ProductPage />} />
    </Route>
  </Routes>
    </ColorProvider>
      
    </>
  )
}

export default App

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/signin">Signin</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  );
}