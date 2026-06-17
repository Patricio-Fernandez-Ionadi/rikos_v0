import { Route, Routes } from 'react-router-dom'
import { Layout } from './layout'
import { Dashboard, ProductsPage, ProductDetailPage, ShiftsPage, StockPage, SoportePage, SuppliersPage, SupplierDetailPage, SupplierFormPage, SalePage, TasksPage, NewProductPage, OrdersPage, OrderFormPage, AlertsPage, CategoriesPage, PromoSetsPage, MenuPage } from '../views'

export const Router = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Dashboard />} />
				<Route path='products' element={<ProductsPage />} />
				<Route path='products/new' element={<NewProductPage />} />
				<Route path='products/:id' element={<ProductDetailPage />} />
				<Route path='suppliers' element={<SuppliersPage />} />
        <Route path='suppliers/new' element={<SupplierFormPage />} />
        <Route path='suppliers/:id/edit' element={<SupplierFormPage />} />
        <Route path='suppliers/:id' element={<SupplierDetailPage />} />
				<Route path='stock' element={<StockPage />} />
				<Route path='categories' element={<CategoriesPage />} />
				<Route path='shifts' element={<ShiftsPage />} />
				<Route path='shifts/sale' element={<SalePage />} />
				<Route path='soporte' element={<SoportePage />} />
        <Route path='tasks' element={<TasksPage />} />
        <Route path='orders' element={<OrdersPage />} />
        <Route path='orders/new' element={<OrderFormPage />} />
        <Route path='orders/:id' element={<OrderFormPage />} />
        <Route path='alerts/:type' element={<AlertsPage />} />
        <Route path='promo-sets' element={<PromoSetsPage />} />
        <Route path='menu' element={<MenuPage />} />
			</Route>
		</Routes>
	)
}
