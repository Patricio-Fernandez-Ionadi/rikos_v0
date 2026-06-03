import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/app-header.jsx'
import { useCatalog } from './catalog-context.jsx'

export const Layout = () => {
	const { loading } = useCatalog()

	return (
		<>
			<AppHeader />
			{loading ? <p className='placeholder'>Cargando datos...</p> : <Outlet />}
		</>
	)
}
