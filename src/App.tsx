import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProductPage from "./pages/Product";
import ProductList from "./pages/ProductList";
import { ColorProvider } from "./context/ColorContext";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import { Layout } from "./components/Layout";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";

function App() {
	return (
		<>
			<CartProvider>
				<ColorProvider>
					<Toaster position="top-right" />
					<Routes>
						{/* Set ProductList as the default page */}
						<Route path="/" element={<Layout />}>
							<Route index element={<ProductList />} />
							<Route path="signup" element={<Signup />} />
							<Route path="signin" element={<Signin />} />
							<Route path="profile" element={<Profile />} />
							<Route path="/cart" element={<Cart />} />

							{/* Route to ProductPage with a dynamic product ID */}
							<Route path="product/:id" element={<ProductPage />} />
						</Route>
					</Routes>
				</ColorProvider>
			</CartProvider>
		</>
	);
}

export default App;
