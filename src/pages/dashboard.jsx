import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useShift } from '../context/ShiftContext.jsx'

/**
 * Main dashboard — shows summary cards, low-stock warnings, recent shifts.
 */
export const Dashboard = () => {
  const { categories, products, presentations } = useData()
  const { shift } = useShift()

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalPresentations = presentations.length
  const withStock = presentations.filter((p) => (p.stock ?? 0) > 0).length
  const lowStock = presentations.filter((p) => (p.stock ?? 0) > 0 && p.stock <= 5)
  const activeSales = shift?.sales?.length ?? 0
  const activeTotal = shift?.sales?.reduce((s, x) => s + x.total, 0) ?? 0

  return (
    <div className="dashboard">
      <h2 className="dashboard__title">Dashboard</h2>

      <div className="dashboard__grid">
        <Link to="/products" className="dashboard__card">
          <h3 className="dashboard__card-title">Productos</h3>
          <p className="dashboard__card-desc">Gestionar catálogo y precios</p>
          <p className="dashboard__card-value">{totalProducts}</p>
        </Link>

        <Link to="/stock" className="dashboard__card">
          <h3 className="dashboard__card-title">Stock</h3>
          <p className="dashboard__card-desc">Control de inventario</p>
          <p className="dashboard__card-value">{withStock}</p>
        </Link>

        <Link to="/shifts" className="dashboard__card">
          <h3 className="dashboard__card-title">Turnos</h3>
          <p className="dashboard__card-desc">
            {shift ? `Turno activo · ${activeSales} ventas` : 'Historial de turnos'}
          </p>
          <p className="dashboard__card-value">
            {shift ? `$${activeTotal.toLocaleString()}` : '—'}
          </p>
        </Link>

        <div className="dashboard__card" style={{ cursor: 'default' }}>
          <h3 className="dashboard__card-title">Categorías</h3>
          <p className="dashboard__card-desc">Total en el catálogo</p>
          <p className="dashboard__card-value">{totalCategories}</p>
        </div>

        <div className="dashboard__card" style={{ cursor: 'default' }}>
          <h3 className="dashboard__card-title">Presentaciones</h3>
          <p className="dashboard__card-desc">Variantes de producto</p>
          <p className="dashboard__card-value">{totalPresentations}</p>
        </div>
      </div>

      {/* Products without cost */}
      <h3 className="dashboard__section-title">Productos sin costo</h3>
      <table className="dashboard__table">
        <thead>
          <tr><th>Producto</th><th>Categoría</th></tr>
        </thead>
        <tbody>
          {products.filter((p) => p.purchaseCost == null).slice(0, 10).map((p) => {
            const cat = categories.find((c) => c._id === p.categoryId)
            return (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{cat?.name ?? '—'}</td>
              </tr>
            )
          })}
          {products.filter((p) => p.purchaseCost == null).length === 0 && (
            <tr><td colSpan={2} style={{ color: '#616161' }}>Todos los productos tienen costo cargado</td></tr>
          )}
        </tbody>
      </table>

      {/* Low stock */}
      {lowStock.length > 0 && (
        <>
          <h3 className="dashboard__section-title">Stock bajo (≤5 unidades)</h3>
          <table className="dashboard__table">
            <thead>
              <tr><th>Producto</th><th>Presentación</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {lowStock.slice(0, 10).map((pres) => {
                const prod = products.find((p) => p._id === pres.productId)
                return (
                  <tr key={pres._id}>
                    <td>{prod?.name ?? '—'}</td>
                    <td>{pres.label}</td>
                    <td><span className="dashboard__badge dashboard__badge--low">{pres.stock}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      )}

      {/* Active shift summary */}
      {shift && (
        <>
          <h3 className="dashboard__section-title">Turno activo</h3>
          <table className="dashboard__table">
            <thead>
              <tr><th>Ventas</th><th>Total</th><th>Efectivo inicial</th><th>Esperado</th><th>Estado</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{activeSales}</td>
                <td>${activeTotal.toLocaleString()}</td>
                <td>${shift.openingCash.toLocaleString()}</td>
                <td>${(shift.openingCash + activeTotal).toLocaleString()}</td>
                <td><span className="dashboard__badge dashboard__badge--open">Abierto</span></td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
