import { Routes, Route } from 'react-router-dom'
import { Layout } from './Layout.jsx'
import { Dashboard, StockPage, ShiftsPage, ProductsPage } from '../views'

/**
 * Root application component — sets up all routes.
 */
export const App = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Dashboard />} />
				<Route path='products' element={<ProductsPage />} />
				<Route path='stock' element={<StockPage />} />
				<Route path='shifts' element={<ShiftsPage />} />
			</Route>
		</Routes>
	)
}
