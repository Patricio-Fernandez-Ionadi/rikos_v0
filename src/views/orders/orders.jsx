import { useNavigate } from 'react-router-dom'
import { useOrders } from '../../modules/orders/order-manager.js'
import { DataTable } from '../../components/data-table.jsx'
import { Button } from '../../components/button.jsx'

export const OrdersPage = () => {
  const { orders, loading, deleteOrder } = useOrders()
  const navigate = useNavigate()

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <h2 className='stock-page__title'>Pedidos</h2>
        <Button block onClick={() => navigate('/orders/new')}>
          + Nuevo pedido
        </Button>
      </div>

      {loading ? (
        <p className='placeholder'>Cargando pedidos...</p>
      ) : (
        <DataTable
          variant='stock-page'
          columns={[
            { key: 'supplier', label: 'Proveedor' },
            { key: 'items', label: 'Productos' },
            { key: 'cost', label: 'Costo total' },
            { key: 'date', label: 'Fecha' },
            { key: 'actions', label: 'Acciones' },
          ]}
          rows={orders}
          emptyMessage='No hay pedidos registrados'
          renderRow={(o) => (
            <tr key={o._id}>
              <td className='text-white'>{o.supplierName}</td>
              <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
              <td className='text-white'>${o.totalCost.toLocaleString()}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button size='xs' onClick={() => navigate(`/orders/${o._id}`)}>
                    Editar
                  </Button>
                  <Button
                    size='xs'
                    variant='danger'
                    onClick={async () => {
                      if (window.confirm('¿Eliminar este pedido?')) {
                        await deleteOrder(o._id)
                      }
                    }}
                  >
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
