import { Route, Routes } from 'react-router-dom'
import { Layout } from './layout'
import { Dashboard, ProductsPage, ShiftsPage, StockPage, SoportePage } from '../views'

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
				<Route path='soporte' element={<SoportePage />} />
			</Route>
		</Routes>
	)
}
