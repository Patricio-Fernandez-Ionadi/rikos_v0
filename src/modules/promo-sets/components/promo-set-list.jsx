import { PromoSetForm } from './promo-set-form.jsx'

export const PromoSetList = ({ promoSets, onEdit, onDelete, onToggleActive }) => {
  if (promoSets.length === 0) {
    return <p className='placeholder'>No hay promociones todavía</p>
  }

  return (
    <div className='promo-list'>
      {promoSets.map((set) => (
        <div key={set._id} className={`promo-list__card${!set.active ? ' promo-list__card--inactive' : ''}`}>
          <div className='promo-list__header'>
            <h3 className='promo-list__name'>{set.name}</h3>
            <span className='promo-list__price'>${set.price.toLocaleString()}</span>
            <span className={`promo-list__badge ${set.active ? 'promo-list__badge--active' : 'promo-list__badge--inactive'}`}>
              {set.active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <div className='promo-list__items'>
            {set.items.map((item, i) => (
              <span key={i} className='promo-list__item-chip'>
                x{item.quantity}
              </span>
            ))}
          </div>
          <div className='promo-list__actions'>
            <button className='btn btn--xs' onClick={() => onToggleActive(set._id, set.active)}>
              {set.active ? 'Desactivar' : 'Activar'}
            </button>
            <button className='btn btn--xs' onClick={() => onEdit(set)}>Editar</button>
            <button className='btn btn--xs btn--danger' onClick={() => onDelete(set._id)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export const PromoSetView = ({ promoSets, onAddToCart }) => {
  const active = promoSets.filter((s) => s.active)

  if (active.length === 0) {
    return <p className='placeholder'>No hay promos activas</p>
  }

  return (
    <div className='promo-grid'>
      {active.map((set) => (
        <div key={set._id} className='promo-grid__card' onClick={() => onAddToCart?.(set)}>
          <h4 className='promo-grid__name'>{set.name}</h4>
          <span className='promo-grid__price'>${set.price.toLocaleString()}</span>
          <div className='promo-grid__items'>
            {set.items.map((item, i) => (
              <span key={i} className='promo-grid__item'>x{item.quantity}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
