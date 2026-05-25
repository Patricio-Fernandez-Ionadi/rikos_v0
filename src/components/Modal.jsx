/**
 * Simple modal overlay. Renders children inside a centered panel.
 * Clicking the overlay background or the close button closes the modal.
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
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close" onClick={onClose} type="button" aria-label="Cerrar">
              ✕
            </button>
          </div>
        )}
        {!title && (
          <button className="modal-close modal-close--absolute" onClick={onClose} type="button" aria-label="Cerrar">
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
