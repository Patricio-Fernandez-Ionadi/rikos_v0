import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrders } from '../../modules/orders/order-manager.js'
import { DataTable } from '../../components/data-table.jsx'
import { Button } from '../../components/button.jsx'

export function OrdersPage() {
  const { orders, loading, deleteOrder, closeOrder } = useOrders()
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('open')

  const filteredOrders = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <h2 className='stock-page__title'>Pedidos</h2>
        <Button block onClick={() => navigate('/orders/new')}>
          + Nuevo pedido
        </Button>
      </div>

      <div className='orders-filters'>
        <button
          className={`orders-filters__btn${filterStatus === 'open' ? ' orders-filters__btn--active' : ''}`}
          onClick={() => setFilterStatus('open')}>
          Abiertos
        </button>
        <button
          className={`orders-filters__btn${filterStatus === '' ? ' orders-filters__btn--active' : ''}`}
          onClick={() => setFilterStatus('')}>
          Todos
        </button>
      </div>

      {loading ? (
        <p className='placeholder'>Cargando pedidos...</p>
      ) : (
        <DataTable
          variant='stock-page'
          columns={[
            { key: 'status', label: 'Estado' },
            { key: 'supplier', label: 'Proveedor' },
            { key: 'items', label: 'Productos' },
            { key: 'cost', label: 'Costo total' },
            { key: 'date', label: 'Fecha' },
            { key: 'actions', label: 'Acciones' },
          ]}
          rows={filteredOrders}
          emptyMessage={filterStatus === 'open' ? 'No hay pedidos abiertos' : 'No hay pedidos registrados'}
          renderRow={(o) => (
            <tr key={o._id}>
              <td>
                <span className={`badge badge--${o.status === 'open' ? 'warn' : 'success'}`}>
                  {o.status === 'open' ? 'Abierto' : 'Pedido'}
                </span>
              </td>
              <td className='text-white'>{o.supplierName}</td>
              <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
              <td className='text-white'>${o.totalCost.toLocaleString()}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button size='xs' onClick={() => navigate(`/orders/${o._id}`)}>
                    Editar
                  </Button>
                  {o.status === 'open' && (
                    <Button size='xs' variant='primary'
                      onClick={async () => {
                        await closeOrder(o._id)
                      }}>
                      Cerrar
                    </Button>
                  )}
                  <Button size='xs' variant='danger'
                    onClick={async () => {
                      if (window.confirm('¿Eliminar este pedido?')) {
                        await deleteOrder(o._id)
                      }
                    }}>
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  )
}
