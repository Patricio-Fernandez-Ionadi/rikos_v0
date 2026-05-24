import { Outlet, Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useShift } from '../context/ShiftContext.jsx'
import { ShiftBar } from '../components/ShiftBar.jsx'

/**
 * Shared layout rendered by the router.
 * Shows the app header with navigation, sync status, the shift bar, and the routed page content.
 */
export const Layout = () => {
  const { loading, online, dirty, syncData } = useData()
  const { shift, synced, syncToDb } = useShift()

  const needsDataSync = online && dirty
  const needsShiftSync = shift && !synced

  const handleSync = async () => {
    if (needsDataSync) await syncData()
    if (needsShiftSync) await syncToDb()
  }

  return (
    <div className="app-header">
      <div className="layout__nav">
        <Link to="/" className="layout__logo">RIKOS</Link>
        <div className="layout__links">
          <Link to="/" className="layout__link">Dashboard</Link>
          <Link to="/products" className="layout__link">Productos</Link>
          <Link to="/stock" className="layout__link">Stock</Link>
          <Link to="/shifts" className="layout__link">Turnos</Link>
        </div>
        {(needsDataSync || needsShiftSync) && (
          <button className="shift-bar__btn shift-bar__btn--primary" onClick={handleSync} style={{ marginLeft: 'auto' }}>
            Sincronizar {needsDataSync ? 'datos' : ''}{needsDataSync && needsShiftSync ? ' y ' : ''}{needsShiftSync ? 'turno' : ''}
          </button>
        )}
        {!online && !loading && (
          <span className="shift-bar__badge shift-bar__badge--warn" style={{ marginLeft: 'auto' }}>Offline</span>
        )}
      </div>
      <ShiftBar />
      {loading ? <p className="placeholder">Cargando datos...</p> : <Outlet />}
    </div>
  )
}
