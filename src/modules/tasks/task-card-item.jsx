import { Link } from 'react-router-dom'

export function TaskCardItem({ task, index, isNameType, isTextBased, getProduct, editingNoteId, noteValue, setNoteValue, handleNoteSave, handleNoteKeyDown, handleNoteClick, removeTask }) {
  const hasProduct = !!task.productId
  const prod = hasProduct ? getProduct(task.productId) : null
  const displayName = isNameType || isTextBased ? task.name : (prod?.name ?? '—')
  const linkTo = hasProduct && prod ? `/products/${prod._id}` : null

  return (
    <li key={task._id ?? index} className='tasks__card-item'>
      <div className='tasks__card-item-body'>
        {linkTo ? (
          <Link to={linkTo} className='tasks__card-item-name'>{displayName}</Link>
        ) : (
          <span className='tasks__card-item-name'>{displayName}</span>
        )}

        {editingNoteId === task._id ? (
          <input
            className='tasks__card-note-input' type='text'
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            onBlur={() => handleNoteSave(task._id)}
            onKeyDown={(e) => handleNoteKeyDown(e, task._id)}
            autoFocus placeholder='Agregar detalle…'
          />
        ) : (
          <span
            className='tasks__card-note'
            onClick={() => handleNoteClick(task._id, task.note)}
            title={task.note || 'Agregar detalle'}
          >
            {task.note || '✎ Agregar detalle'}
          </span>
        )}
      </div>

      {isTextBased && hasProduct && prod && (
        <Link to={`/products/${prod._id}`} className='tasks__card-product-badge'>
          {prod.name}
        </Link>
      )}

      <button
        className='tasks__card-btn tasks__card-btn--remove'
        onClick={() => removeTask(task._id)}
        title='Eliminar'
      >✕</button>
    </li>
  )
}
