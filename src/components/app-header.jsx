import { Navigation } from './navigation/app-navigation.jsx'
import { ShiftBar } from './shift-bar.jsx'

export const AppHeader = () => {
	return (
		<header className='app-header'>
			<Navigation />
			<ShiftBar />
		</header>
	)
}
