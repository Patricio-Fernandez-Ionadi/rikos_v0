import { BrowserRouter } from 'react-router-dom'
import { Router } from './app-router.jsx'
import { CatalogProvider } from './catalog-context.jsx'
import { ShiftProvider } from '../modules/shift/shift-context.jsx'
import '../theme/index.scss'

export const App = () => {
	return (
		<>
			<BrowserRouter>
				<CatalogProvider>
					<ShiftProvider>
						<Router />
					</ShiftProvider>
				</CatalogProvider>
			</BrowserRouter>
		</>
	)
}
