import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/app-header.jsx'
import { useData } from './data-context.jsx'

export const Layout = () => {
	const { loading } = useData()

	return (
		<>
			<AppHeader />
			{loading ? <p className='placeholder'>Cargando datos...</p> : <Outlet />}
		</>
	)
}
