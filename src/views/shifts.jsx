import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext.jsx'
import { useShift } from '../context/ShiftContext.jsx'
import { ShiftSalesList } from '../modules/shift/ShiftSalesList.jsx'
import { Modal } from '../components/Modal.jsx'
import * as api from '../data/api.js'

/**
 * Shifts page — shows the active shift and past shift history.
 */
export const ShiftsPage = () => {
  const { products, online } = useData()
  const { shift, synced, syncToDb, openShift, closeShift } = useShift()
  const [pastShifts, setPastShifts] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [showOpen, setShowOpen] = useState(false)
  const [showClose, setShowClose] = useState(false)
  const [openingCash, setOpeningCash] = useState('')
  const [closingCash, setClosingCash] = useState('')
  const [closingNotes, setClosingNotes] = useState('')
  const [closeError, setCloseError] = useState('')

  useEffect(() => {
    if (!online) return
    api.getShifts().then((list) => {
      setPastShifts(list.filter((s) => s.status === 'closed'))
    }).catch(() => {})
  }, [online])

  const getProductName = (id) => products.find((p) => p._id === id)?.name ?? '—'

  const handleOpen = async () => {
    const cash = parseFloat(openingCash)
    if (isNaN(cash) || cash < 0) return
    await openShift(cash)
    setShowOpen(false)
    setOpeningCash('')
  }

  const handleClose = async () => {
    const cash = parseFloat(closingCash)
    if (isNaN(cash) || cash < 0) return
    setCloseError('')
    const result = await closeShift(cash, closingNotes)
    if (result?.error) {
      setCloseError(result.error)
      return
    }
    setShowClose(false)
    setClosingCash('')
    setClosingNotes('')
  }

  return (
    <div className="shifts-page">
      <h2 className="shifts-page__title">Turnos</h2>

      {!shift ? (
        <div className="shifts-page__card shifts-page__card--empty">
          <p className="shifts-page__empty-text">No hay turno activo</p>
          <button className="shift-bar__btn shift-bar__btn--primary" onClick={() => setShowOpen(true)}>
            Abrir Turno
          </button>
        </div>
      ) : (
        <>
          {/* Active shift info */}
          <div className="shifts-page__card">
            <div className="shifts-page__card-header">
              <span className="dashboard__badge dashboard__badge--open">Turno activo</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {!synced && (
                  <button className="shift-bar__btn" onClick={() => syncToDb()}>
                    Sincronizar
                  </button>
                )}
                <button className="shift-bar__btn shift-bar__btn--danger" onClick={() => setShowClose(true)}>
                  Cerrar Turno
                </button>
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

          {/* Close shift modal */}
          {showClose && (
            <Modal open={showClose} onClose={() => setShowClose(false)} title="Cerrar Turno">
              {closeError && <p className="field-error">{closeError}</p>}
              <label className="field-label">Efectivo final ($)</label>
              <input
                className="field-input"
                type="number"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                autoFocus
              />
              <label className="field-label">Notas (opcional)</label>
              <textarea
                className="field-input"
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                rows={2}
              />
              <div className="modal-actions">
                <button className="shift-bar__btn" onClick={() => setShowClose(false)}>Cancelar</button>
                <button className="shift-bar__btn shift-bar__btn--danger" onClick={handleClose}>
                  Cerrar
                </button>
              </div>
            </Modal>
          )}
        </>
      )}

      {/* Open shift modal */}
      {showOpen && (
        <Modal open={showOpen} onClose={() => setShowOpen(false)} title="Abrir Turno">
          <label className="field-label">Efectivo inicial ($)</label>
          <input
            className="field-input"
            type="number"
            value={openingCash}
            onChange={(e) => setOpeningCash(e.target.value)}
            autoFocus
          />
          <div className="modal-actions">
            <button className="shift-bar__btn" onClick={() => setShowOpen(false)}>Cancelar</button>
            <button className="shift-bar__btn shift-bar__btn--primary" onClick={handleOpen}>
              Abrir
            </button>
          </div>
        </Modal>
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
