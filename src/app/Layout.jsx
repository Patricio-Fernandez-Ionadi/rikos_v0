import { Outlet, Link } from 'react-router-dom'
import { useData } from '../app/data-context.jsx'
import { useShift } from '../modules/shift/shift-context.jsx'
import { ShiftBar } from '../components/ShiftBar.jsx'

/**
 * Shared layout rendered by the router.
 * Shows the app header with navigation, sync status, the shift bar, and the routed page content.
 */
export const Layout = () => {
  const { loading, online, dirty, syncData } = useData()
  const { shift, synced, syncToDb } = useShift()

  const hasPendingData = dirty || (shift && !synced)
  const canSync = online && hasPendingData

  const handleSync = async () => {
    if (dirty) await syncData()
    if (shift && !synced) await syncToDb()
  }

  return (
    <div className="app-header">
      <div className="layout__nav">
        <Link to="/" className="layout__logo">RIKO'S</Link>
        <div className="layout__links">
          <Link to="/products" className="layout__link">
            Productos
          </Link>
          <Link to="/stock" className="layout__link">
            Stock
          </Link>
          <Link to="/shifts" className="layout__link">
            Turnos
          </Link>
        </div>
        <div className="layout__sync">
          {canSync && (
            <button className="shift-bar__btn shift-bar__btn--primary" onClick={handleSync}>
              Sincronizar cambios
            </button>
          )}
          {!online && hasPendingData && (
            <span className="shift-bar__badge shift-bar__badge--warn">Pendiente de sincronizar</span>
          )}
          {!online && !hasPendingData && !loading && (
            <span className="shift-bar__badge shift-bar__badge--warn">Sin conexión</span>
          )}
        </div>
      </div>
      <ShiftBar />
      {loading ? <p className="placeholder">Cargando datos...</p> : <Outlet />}
    </div>
  )
}
