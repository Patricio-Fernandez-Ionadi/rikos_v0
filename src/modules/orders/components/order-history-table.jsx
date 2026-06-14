import { DataTable } from '../../../components/data-table.jsx'
import { Button } from '../../../components/button.jsx'

export function OrderHistoryTable({ orders, onView, onDelete }) {
  return (
    <DataTable
      variant='stock-page'
      columns={[
        { key: 'supplier', label: 'Proveedor', className: 'orders-table__col--supplier' },
        { key: 'date', label: 'Fecha', className: 'orders-table__col--date' },
        { key: 'cost', label: 'Total', className: 'orders-table__col--cost' },
        { key: 'actions', label: '', className: 'orders-table__col--actions' },
      ]}
      rows={orders}
      emptyMessage='No hay pedidos registrados'
      renderRow={(o) => (
        <tr key={o._id}>
          <td className='text-white'>{o.supplierName}</td>
          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
          <td className='text-white'>${o.totalCost.toLocaleString()}</td>
          <td>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button size='xs' onClick={() => onView(o._id)}>Ver</Button>
              <Button size='xs' variant='danger'
                onClick={() => onDelete(o._id)}>Eliminar</Button>
            </div>
          </td>
        </tr>
      )}
    />
  )
}
