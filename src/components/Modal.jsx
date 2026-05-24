/**
 * Simple modal overlay. Renders children inside a centered panel.
 * Clicking the overlay background closes the modal.
 *
 * @param {Object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onClose
 * @param {string}   [props.title]
 * @param {ReactNode} props.children
 */
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
