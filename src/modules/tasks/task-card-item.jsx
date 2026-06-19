import { Link } from 'react-router-dom'
import { DottedMenu } from '../../components/dotted-menu.jsx'

const PRES_GROUP_KEYS = ['falta-envasar', 'falta-stock']

export function TaskCardItem({ task, isNameType, isTextBased, groupKey, getProduct, getProductPresentations, editingNoteId, noteValue, setNoteValue, handleNoteSave, handleNoteKeyDown, handleNoteClick, handleTogglePres, removeTask }) {
  const hasProduct = !!task.productId
  const prod = hasProduct ? getProduct(task.productId) : null
  const displayName = isNameType || isTextBased ? task.name : (prod?.name ?? '—')
  const linkTo = hasProduct && prod ? `/products/${prod._id}` : null

  const productPres = hasProduct && PRES_GROUP_KEYS.includes(groupKey) && prod
    ? getProductPresentations(prod._id)
    : []

  let selectedPresIds = []
  try { selectedPresIds = JSON.parse(task.note || '[]') } catch { selectedPresIds = [] }
  if (!Array.isArray(selectedPresIds)) selectedPresIds = []

  const showNote = isTextBased

  const dottedItems = [
    { label: 'Eliminar', onClick: () => removeTask(task._id), danger: true },
  ]

  return (
    <li className='tasks__card-item'>
      <div className='tasks__card-item-body'>
        <div className='tasks__card-item-top'>
          {linkTo ? (
            <Link to={linkTo} className='tasks__card-item-name'>{displayName}</Link>
          ) : (
            <span className='tasks__card-item-name'>{displayName}</span>
          )}
          <DottedMenu items={dottedItems} />
        </div>

        {productPres.length > 1 && (
          <div className='tasks__card-pres-list'>
            {productPres.map((p) => {
              const isSel = selectedPresIds.includes(p._id)
              return (
                <button
                  key={p._id}
                  className={`tasks__card-pres-btn${isSel ? ' tasks__card-pres-btn--sel' : ''}`}
                  onClick={() => handleTogglePres(task._id, p._id)}
                  type='button'
                >
                  {p.label || `#${p.code || '?'}`}
                </button>
              )
            })}
          </div>
        )}

        {showNote && editingNoteId === task._id ? (
          <input
            className='tasks__card-note-input' type='text'
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            onBlur={() => handleNoteSave(task._id)}
            onKeyDown={(e) => handleNoteKeyDown(e, task._id)}
            autoFocus placeholder='Agregar detalle…'
          />
        ) : showNote ? (
          <span
            className='tasks__card-note'
            onClick={() => handleNoteClick(task._id, task.note)}
            title={task.note || 'Agregar detalle'}
          >
            {task.note || '✎ Agregar detalle'}
          </span>
        ) : null}
      </div>

      {isTextBased && hasProduct && prod && (
        <Link to={`/products/${prod._id}`} className='tasks__card-product-badge'>
          {prod.name}
        </Link>
      )}
    </li>
  )
}