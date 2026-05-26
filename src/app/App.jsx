import { BrowserRouter } from 'react-router-dom'
import { Router } from './app-router.jsx'
import { DataProvider } from './data-context.jsx'
import { ShiftProvider } from '../modules/shift/shift-context.jsx'
import '../theme/index.scss'

export const App = () => {
	return (
		<>
			<BrowserRouter>
				<DataProvider>
					<ShiftProvider>
						<Router />
					</ShiftProvider>
				</DataProvider>
			</BrowserRouter>
		</>
	)
}
