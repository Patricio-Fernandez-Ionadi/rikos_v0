import { useNavigate } from 'react-router-dom'

export function SupplierProductTable({
  productSuppliers, products, categories,
  editingPS, setEditingPS, editCost, setEditCost,
  handleUpdateCost, handleUnlink,
}) {
  const navigate = useNavigate()

  if (productSuppliers.length === 0) {
    return <p className='placeholder'>Este proveedor no tiene productos asignados</p>
  }

  return (
    <div className='stock-page__table-wrap'>
      <table className='stock-page__table'>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio de costo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productSuppliers.map((ps) => {
            const product = products?.find((p) => p._id === ps.productId)
            const category = product ? categories.find((c) => c._id === product.categoryId) : null
            return (
              <tr key={ps._id}>
                <td className='text-white'>
                  <a className='text-info' href={`/products/${ps.productId}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/products/${ps.productId}`) }}>
                    {product?.name ?? 'Producto eliminado'}
                  </a>
                </td>
                <td>{category?.name ?? '—'}</td>
                <td className='text-white'
                  onClick={() => {
                    if (editingPS !== ps._id) { setEditingPS(ps._id); setEditCost(String(ps.purchaseCost ?? '')) }
                  }}>
                  {editingPS === ps._id ? (
                    <input className='field-input field-input--sm' type='number' value={editCost}
                      onChange={(e) => setEditCost(e.target.value)}
                      onBlur={() => handleUpdateCost(ps._id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateCost(ps._id); if (e.key === 'Escape') setEditingPS(null) }}
                      autoFocus />
                  ) : (
                    <>${ps.purchaseCost?.toLocaleString() ?? '\u2014'}</>
                  )}
                </td>
                <td>
                  <button className='btn btn--xs btn--danger' onClick={() => handleUnlink(ps._id)}>✕</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
