import { useNavigate } from 'react-router-dom'
import { useAlertsManager } from '../modules/alerts/alerts-manager.js'
import { DataTable } from '../components/data-table.jsx'

export const AlertsPage = () => {
  const navigate = useNavigate()
  const { alert, rows, categories } = useAlertsManager()

  if (!alert) {
    return (
      <div className='dashboard'>
        <h2 className='dashboard__title'>Alerta no encontrada</h2>
        <p className='placeholder text-muted'>La alerta solicitada no existe.</p>
      </div>
    )
  }

  const columns = [
    { key: 'name', label: 'Producto' },
    { key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
  ]

  return (
    <div className='dashboard'>
      <h2 className='dashboard__title'>{alert.title}</h2>
      <p className='dashboard__count'>{rows.length} producto{rows.length !== 1 ? 's' : ''}</p>
      <DataTable
        variant='dashboard'
        columns={columns}
        rows={rows}
        emptyMessage={alert.emptyMsg}
        renderRow={(p) => {
          const cat = categories.find((c) => c._id === p.categoryId)
          return (
            <tr key={p._id} className='dashboard__row--clickable' onClick={() => navigate(`/products/${p._id}`)}>
              <td>{p.name}</td>
              <td className='dashboard__td--desktop'>{cat?.name ?? '—'}</td>
            </tr>
          )
        }}
      />
    </div>
  )
}
