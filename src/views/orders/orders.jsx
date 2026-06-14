import { useOrdersList } from '../../modules/orders/hooks/use-orders-list.js'
import { OrderCardsList } from '../../modules/orders/components/order-cards-list.jsx'
import { OrderHistoryTable } from '../../modules/orders/components/order-history-table.jsx'
import { Button } from '../../components/button.jsx'

export function OrdersPage() {
  const {
    loading, filterStatus, setFilterStatus,
    filteredOrders, handleEdit, handleClose, handleDelete,
  } = useOrdersList()

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <h2 className='stock-page__title'>Pedidos</h2>
        <Button onClick={() => handleEdit('new')}>+ Nuevo pedido</Button>
      </div>

      <div className='orders-filters'>
        <button
          className={`orders-filters__btn${filterStatus === 'open' ? ' orders-filters__btn--active' : ''}`}
          onClick={() => setFilterStatus('open')}>Abiertos</button>
        <button
          className={`orders-filters__btn${filterStatus === '' ? ' orders-filters__btn--active' : ''}`}
          onClick={() => setFilterStatus('')}>Historial</button>
      </div>

      {loading ? (
        <p className='placeholder'>Cargando pedidos...</p>
      ) : filterStatus === 'open' ? (
        <OrderCardsList orders={filteredOrders} onEdit={handleEdit} onClose={handleClose} onDelete={handleDelete} />
      ) : (
        <OrderHistoryTable orders={filteredOrders} onView={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  )
}
