import { Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { Dashboard, ProductsPage, ShiftsPage, StockPage } from '../views'

/**
 * Root application component — sets up all routes.
 */
export const Router = () => {
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
