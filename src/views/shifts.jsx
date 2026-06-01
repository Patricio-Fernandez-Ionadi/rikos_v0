import { useState, useEffect } from 'react'
import { useShift } from '../modules/shift/shift-context.jsx'
import { ActiveShiftCard } from '../modules/shift/active-shift-card.jsx'
import { PastShiftCard } from '../modules/shift/past-shift-card.jsx'
import { OpenShiftForm } from '../modules/shift/open-shift-form.jsx'
import { CloseShiftForm } from '../modules/shift/close-shift-form.jsx'
import * as api from '../data/api.js'

/**
 * Shifts page — shows the active shift and past shift history.
 */
export const ShiftsPage = () => {
  const { shift } = useShift()
  const [pastShifts, setPastShifts] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [showOpen, setShowOpen] = useState(false)
  const [showClose, setShowClose] = useState(false)

  useEffect(() => {
    api.getShifts().then((list) => {
      setPastShifts(list.filter((s) => s.status === 'closed'))
    }).catch(() => {})
  }, [shift])

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
          <ActiveShiftCard onRequestClose={() => setShowClose(true)} />
          <CloseShiftForm open={showClose} onClose={() => setShowClose(false)} />
        </>
      )}

      <OpenShiftForm
        open={showOpen}
        onClose={() => setShowOpen(false)}
        defaultOpeningCash={pastShifts[0]?.closingCash ?? ''}
      />

      <h3 style={{ color: '#f5f5f5', margin: '24px 0 12px' }}>Turnos anteriores</h3>

      {pastShifts.length === 0 && (
        <p className="placeholder" style={{ color: '#616161', textAlign: 'center', padding: '40px' }}>
          No hay turnos anteriores registrados
        </p>
      )}

      {pastShifts.map((s) => (
        <PastShiftCard
          key={s._id}
          shift={s}
          isExpanded={expanded === s._id}
          onToggle={() => setExpanded(expanded === s._id ? null : s._id)}
        />
      ))}
    </div>
  )
}
