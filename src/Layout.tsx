import { ShoppingBagIcon, } from '@heroicons/react/24/outline';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from './context/CartContext';

function Layout() {

  const { cart } = useCart();
	return (
		<div>
			<header className="relative bg-white">
				<nav
					aria-label="Top"
					className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
				>
					<div className="border-b border-gray-200">
						<div className="flex h-16 items-center justify-between">
							<Link to="/" className="flex">
								<span className="sr-only">RC stuff</span>
								RC Stuff
							</Link>

							<div className="flex flex-1 items-center justify-end">
								<div className="ml-4 flow-root lg:ml-6">
									<Link to="checkout" className="group -m-2 flex items-center p-2">
										<ShoppingBagIcon
											aria-hidden="true"
											className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
										/>
										<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cart.length}
										</span>
										<span className="sr-only">items in cart, view bag</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>

			<Outlet />
		</div>
	);
}

export default Layout;