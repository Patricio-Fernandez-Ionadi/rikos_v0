import { Link } from 'react-router-dom'
import { useShift } from '../modules/shift/shift-context.jsx'

/**
 * Minimal top bar for the active shift.
 * Only renders when a shift is open — shows a badge, sync info, and a link to the shift view.
 * Opening and closing a shift is handled on the /shifts page.
 */
export const ShiftBar = () => {
	const { shift, synced, syncToDb } = useShift()

	if (!shift) return null

	return (
		<div className='shift-bar'>
			<div className='shift-bar__active'>
				<span className='shift-bar__badge shift-bar__badge--open'>
					Turno abierto
				</span>

				{!synced && (
					<>
						<span className='shift-bar__badge shift-bar__badge--warn'>
							Ventas sin sincronizar
						</span>
						<button className='shift-bar__btn' onClick={() => syncToDb()}>
							Sincronizar
						</button>
					</>
				)}

				{synced && <span className='shift-bar__stat'>Sincronizado</span>}
				<Link to='/shifts' className='shift-bar__btn shift-bar__btn--primary'>
					Ir al turno
				</Link>
			</div>
		</div>
	)
}
