import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext.jsx'
import { ShiftProvider } from './context/ShiftContext.jsx'
import { App } from './app/App'
import './theme/index.scss'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<DataProvider>
				<ShiftProvider>
					<App />
				</ShiftProvider>
			</DataProvider>
		</BrowserRouter>
	</StrictMode>,
)
