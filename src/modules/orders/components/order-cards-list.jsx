import { Button } from '../../../components/button.jsx'

export function OrderCardsList({ orders, onEdit, onClose, onDelete }) {
  if (orders.length === 0) {
    return <p className='placeholder text-muted'>No hay pedidos abiertos</p>
  }

  return (
    <div className='orders-cards'>
      {orders.map((o) => (
        <div key={o._id} className='orders-cards__card'>
          <div className='orders-cards__header'>
            <span className='orders-cards__supplier'>{o.supplierName}</span>
            <span className='badge badge--warn'>Abierto</span>
          </div>
          <div className='orders-cards__info'>
            <span>{o.items.length} producto{o.items.length !== 1 ? 's' : ''}</span>
            <span>${o.totalCost.toLocaleString()}</span>
            <span className='orders-cards__date'>{new Date(o.createdAt).toLocaleDateString()}</span>
          </div>
          <div className='orders-cards__actions'>
            <Button size='xs' onClick={() => onEdit(o._id)}>Editar</Button>
            <Button size='xs' variant='primary' onClick={() => onClose(o._id)}>Cerrar</Button>
            <Button size='xs' variant='danger' onClick={() => onDelete(o._id)}>Eliminar</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
