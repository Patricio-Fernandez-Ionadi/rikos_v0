import { BrowserRouter } from 'react-router-dom'
import { Router } from './app-router.jsx'
import { CatalogProvider } from './catalog-context.jsx'
import { ShiftProvider } from '../modules/shifts/shift-context.jsx'
import { ToastProvider } from '../components/Toast.jsx'
import '../theme/index.scss'

export const App = () => {
	return (
		<>
			<BrowserRouter>
				<ToastProvider>
					<CatalogProvider>
						<ShiftProvider>
							<Router />
						</ShiftProvider>
					</CatalogProvider>
				</ToastProvider>
			</BrowserRouter>
		</>
	)
}
