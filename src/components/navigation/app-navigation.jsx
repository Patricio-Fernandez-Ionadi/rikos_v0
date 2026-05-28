import { useData } from '../../app/data-context'
import { useShift } from '../../modules/shift/shift-context'
import { NavItem } from './app-nav-item'

export const Navigation = () => {
	const { online, dirty, syncData } = useData()
	const { shift, synced, syncToDb } = useShift()

	const hasPendingData = dirty || (shift && !synced)
	const canSync = online && hasPendingData

	const handleSync = async () => {
		if (dirty) await syncData()
		if (shift && !synced) await syncToDb()
	}

	return (
		<nav className='navigation__nav'>
			<NavItem to={'/'} label={"RIKO'S"} isLogo={true} />
			<NavItem to={'/products'} label={'Productos'} />
			<NavItem to={'/stock'} label={'Stock'} />
			<NavItem to={'/shifts'} label={'Turnos'} />
			<NavItem to={'/soporte'} label={'Soporte'} />

			<div className='navigation__sync'>
				{canSync && (
					<button
						className='shift-bar__btn shift-bar__btn--primary'
						onClick={handleSync}
					>
						Sincronizar cambios
					</button>
				)}
				{!online && hasPendingData && (
					<span className='shift-bar__badge shift-bar__badge--warn'>
						Pendiente de sincronizar
					</span>
				)}
				{!online && !hasPendingData && (
					<span className='shift-bar__badge shift-bar__badge--warn'>
						Sin conexión
					</span>
				)}
			</div>
		</nav>
	)
}
