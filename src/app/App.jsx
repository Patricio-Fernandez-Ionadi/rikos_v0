import { ProductBrowser } from './ProductBrowser.jsx'
import '../theme/index.css'

/**
 * Root application component.
 * Renders the app header and the product browser.
 */
export const App = () => {
	return (
		<div className='app-header'>
			<h1>RIKOS</h1>
			<ProductBrowser />
		</div>
	)
}
