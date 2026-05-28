import { Route, Routes } from 'react-router-dom'
import { Layout } from './layout'
import { Dashboard, ProductsPage, ProductDetailPage, ShiftsPage, StockPage, SoportePage, SuppliersPage, SupplierDetailPage, SalePage } from '../views'

export const Router = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Dashboard />} />
				<Route path='products' element={<ProductsPage />} />
				<Route path='products/:id' element={<ProductDetailPage />} />
				<Route path='suppliers' element={<SuppliersPage />} />
				<Route path='suppliers/:id' element={<SupplierDetailPage />} />
				<Route path='stock' element={<StockPage />} />
				<Route path='shifts' element={<ShiftsPage />} />
				<Route path='shifts/sale' element={<SalePage />} />
				<Route path='soporte' element={<SoportePage />} />
			</Route>
		</Routes>
	)
}
