import { Routes, Route, Outlet, Link } from "react-router-dom";
import ProductPage from './pages/Product';
import ProductList from './pages/ProductList';
import { ColorProvider } from './context/ColorContext';

function App() {

  return (
    <>

     <ColorProvider>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<ProductPage />} />
        <Route path="list" element={<ProductList />} />
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