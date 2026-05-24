import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useShift } from '../context/ShiftContext.jsx'
import { ShiftSalesList } from '../modules/shift/ShiftSalesList.jsx'
import * as api from '../data/api.js'

/**
 * Shifts page — shows the active shift and past shift history.
 */
export const ShiftsPage = () => {
  const { products, online } = useData()
  const { shift, synced, syncToDb } = useShift()
  const [pastShifts, setPastShifts] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!online) return
    api.getShifts().then((list) => {
      setPastShifts(list.filter((s) => s.status === 'closed'))
    }).catch(() => {})
  }, [online])

  const getProductName = (id) => products.find((p) => p._id === id)?.name ?? '—'

  return (
    <div className="shifts-page">
      <h2 className="shifts-page__title">Turnos</h2>

      {/* Active shift */}
      {shift && (
        <div className="shifts-page__card">
          <div className="shifts-page__card-header">
            <span className="dashboard__badge dashboard__badge--open">Turno activo</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {!synced && (
                <button className="shift-bar__btn" onClick={() => syncToDb()}>
                  Sincronizar
                </button>
              )}
            </div>
          </div>
          <div className="shifts-page__stats">
            <div className="shifts-page__stat">
              Apertura: <span className="shifts-page__stat-value">{new Date(shift.openingTime).toLocaleString()}</span>
            </div>
            <div className="shifts-page__stat">
              Efectivo inicial: <span className="shifts-page__stat-value">${shift.openingCash.toLocaleString()}</span>
            </div>
            <div className="shifts-page__stat">
              Ventas: <span className="shifts-page__stat-value">{shift.sales.length}</span>
            </div>
            <div className="shifts-page__stat">
              Total: <span className="shifts-page__stat-value">
                ${shift.sales.reduce((s, x) => s + x.total, 0).toLocaleString()}
              </span>
            </div>
            <div className="shifts-page__stat">
              Esperado: <span className="shifts-page__stat-value">
                ${(shift.openingCash + shift.sales.reduce((s, x) => s + x.total, 0)).toLocaleString()}
              </span>
            </div>
          </div>
          <ShiftSalesList />
        </div>
      )}

      {/* Past shifts */}
      <h3 style={{ color: '#f5f5f5', margin: '24px 0 12px' }}>Turnos anteriores</h3>

      {pastShifts.length === 0 && !online && (
        <p className="placeholder" style={{ color: '#616161', textAlign: 'center', padding: '40px' }}>
          {shift ? 'No hay turnos anteriores registrados' : 'Conectá el servidor para ver el historial de turnos'}
        </p>
      )}

      {pastShifts.map((s) => {
        const isOpen = expanded === s._id
        const diffClass = s.difference != null
          ? s.difference < 0 ? 'shifts-page__diff--negative' : s.difference > 0 ? 'shifts-page__diff--positive' : ''
          : ''

        return (
          <div key={s._id} className="shifts-page__card">
            <div className="shifts-page__card-header">
              <div>
                <span className="dashboard__badge dashboard__badge--closed" style={{ marginRight: 8 }}>Cerrado</span>
                <span className="shifts-page__card-date">
                  {new Date(s.openingTime).toLocaleDateString()} · {new Date(s.openingTime).toLocaleTimeString()} — {new Date(s.closingTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="shifts-page__stats">
              <div className="shifts-page__stat">
                Ventas: <span className="shifts-page__stat-value">{s.sales?.length ?? 0}</span>
              </div>
              <div className="shifts-page__stat">
                Total ventas: <span className="shifts-page__stat-value">${s.sales?.reduce((sum, x) => sum + x.total, 0).toLocaleString() ?? 0}</span>
              </div>
              <div className="shifts-page__stat">
                Apertura: <span className="shifts-page__stat-value">${s.openingCash?.toLocaleString() ?? 0}</span>
              </div>
              <div className="shifts-page__stat">
                Cierre: <span className="shifts-page__stat-value">${s.closingCash?.toLocaleString() ?? '—'}</span>
              </div>
              <div className="shifts-page__stat">
                Esperado: <span className="shifts-page__stat-value">${s.expectedBalance?.toLocaleString() ?? '—'}</span>
              </div>
              <div className="shifts-page__stat">
                Diferencia:{' '}
                <span className={`shifts-page__stat-value ${diffClass}`}>
                  {s.difference != null ? `$${s.difference.toLocaleString()}` : '—'}
                </span>
              </div>
            </div>
            {s.notes && <div style={{ color: '#8e8e8e', fontSize: '0.85em', marginTop: 8 }}>Notas: {s.notes}</div>}

            {s.sales?.length > 0 && (
              <div className="shifts-page__toggle" onClick={() => setExpanded(isOpen ? null : s._id)}>
                {isOpen ? 'Ocultar ventas' : `Ver ${s.sales.length} ventas`}
              </div>
            )}

            {isOpen && (
              <div className="shifts-page__sales-wrap">
              <table className="shifts-page__sales-table">
                <thead>
                  <tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {s.sales.map((sale, i) => (
                    <tr key={i}>
                      <td>{getProductName(sale.productId)}</td>
                      <td>{sale.quantity}</td>
                      <td>${sale.unitPrice?.toLocaleString()}</td>
                      <td>${sale.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
