import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCatalog } from '../app/catalog-context.jsx'
import { DataTable } from '../components/data-table.jsx'

const ALERTS = {
  'no-cost': {
    title: 'Productos sin costo',
    filter: (products) =>
      products.filter((p) => p.purchaseCost == null),
    emptyMsg: 'Todos los productos tienen costo cargado',
  },
  'no-margin': {
    title: 'Productos sin margen',
    filter: (products) =>
      products.filter((p) => p.margin == null),
    emptyMsg: 'Todos los productos tienen margen cargado',
  },
  'no-sale-price': {
    title: 'Productos sin precio de venta',
    filter: (products, presentations) =>
      products.filter((p) => {
        const pres = presentations.filter((pr) => pr.productId === p._id)
        return pres.length > 0 && pres.every((pr) => pr.salePrice == null)
      }),
    emptyMsg: 'Todos los productos tienen precio de venta cargado',
  },
  'no-presentations': {
    title: 'Productos sin presentaciones',
    filter: (products, presentations) =>
      products.filter((p) => !presentations.some((pr) => pr.productId === p._id)),
    emptyMsg: 'Todos los productos tienen presentaciones cargadas',
  },
}

export const AlertsPage = () => {
  const { type } = useParams()
  const navigate = useNavigate()
  const { categories, products, presentations } = useCatalog()

  const alert = ALERTS[type]

  const rows = useMemo(
    () => (alert ? alert.filter(products, presentations) : []),
    [alert, products, presentations],
  )

  const columns = [
    { key: 'name', label: 'Producto' },
    { key: 'cat', label: 'Categoría', className: 'dashboard__th--desktop' },
  ]

  if (!alert) {
    return (
      <div className='dashboard'>
        <h2 className='dashboard__title'>Alerta no encontrada</h2>
        <p className='placeholder text-muted'>La alerta solicitada no existe.</p>
      </div>
    )
  }

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
            <tr
              key={p._id}
              className='dashboard__row--clickable'
              onClick={() => navigate(`/products/${p._id}`)}
            >
              <td>{p.name}</td>
              <td className='dashboard__td--desktop'>{cat?.name ?? '—'}</td>
            </tr>
          )
        }}
      />
    </div>
  )
}
