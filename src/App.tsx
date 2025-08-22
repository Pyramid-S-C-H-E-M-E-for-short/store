import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/Product";
import ProductList from "./pages/ProductList";
import { ColorProvider } from "./context/ColorContext";
import { Layout } from "./Layout";
import ShoppingCart from './pages/ShoppingCart';

function App() {
	return (
		<>
				<ColorProvider>
					<Routes>
						{/* Set ProductList as the default page */}
						<Route path="/" element={<Layout />}>
							<Route index element={<ProductList />} />
							{/* Route to ProductPage with a dynamic product ID */}
							<Route path="product/:id" element={<ProductPage />} />
							<Route path="cart" element={<ShoppingCart/>} />
						</Route>
					</Routes>
				</ColorProvider>
		</>
	);
}

export default App;
