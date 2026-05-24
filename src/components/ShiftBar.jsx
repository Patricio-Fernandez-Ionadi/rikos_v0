import { useState } from 'react'
import { useShift } from '../context/ShiftContext.jsx'

/**
 * Top bar for managing the active shift.
 * Shows shift status, sale count, open/close/sync controls.
 */
export const ShiftBar = () => {
  const { shift, synced, openShift, closeShift, syncToDb } = useShift()
  const [showOpen, setShowOpen] = useState(false)
  const [showClose, setShowClose] = useState(false)
  const [openingCash, setOpeningCash] = useState('')
  const [closingCash, setClosingCash] = useState('')
  const [closingNotes, setClosingNotes] = useState('')
  const [error, setError] = useState('')

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
    setError('')
    const result = await closeShift(cash, closingNotes)
    if (result?.error) {
      setError(result.error)
      return
    }
    setShowClose(false)
    setClosingCash('')
    setClosingNotes('')
  }

  const totalSales = shift?.sales?.reduce((sum, s) => sum + s.total, 0) ?? 0
  const saleCount = shift?.sales?.length ?? 0

  return (
    <div className="shift-bar">
      {!shift ? (
        <div className="shift-bar__idle">
          <span className="shift-bar__label">No hay turno activo</span>
          <button className="shift-bar__btn shift-bar__btn--primary" onClick={() => setShowOpen(true)}>
            Abrir Turno
          </button>
        </div>
      ) : (
        <div className="shift-bar__active">
          <div className="shift-bar__info">
            <span className="shift-bar__badge shift-bar__badge--open">Turno abierto</span>
            <span className="shift-bar__stat">
              Apertura: ${shift.openingCash?.toLocaleString()}
            </span>
            <span className="shift-bar__stat">
              Ventas: {saleCount} (${totalSales.toLocaleString()})
            </span>
            <span className="shift-bar__stat">
              Esperado: ${(shift.openingCash + totalSales).toLocaleString()}
            </span>
            {!synced && (
              <span className="shift-bar__badge shift-bar__badge--warn">Ventas sin sincronizar</span>
            )}
          </div>
          <div className="shift-bar__actions">
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
      )}

      {showOpen && (
        <div className="modal-overlay" onClick={() => setShowOpen(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Abrir Turno</h3>
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
          </div>
        </div>
      )}

      {showClose && (
        <div className="modal-overlay" onClick={() => setShowClose(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Cerrar Turno</h3>
            {error && <p className="field-error">{error}</p>}
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
          </div>
        </div>
      )}
    </div>
  )
}
