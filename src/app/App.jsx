import { Routes, Route } from 'react-router-dom'
import { Layout } from './Layout.jsx'
import { Dashboard } from '../pages/dashboard.jsx'
import { StockPage } from '../pages/stock.jsx'
import { ShiftsPage } from '../pages/shifts.jsx'
import { ProductsPage } from '../pages/products.jsx'

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
