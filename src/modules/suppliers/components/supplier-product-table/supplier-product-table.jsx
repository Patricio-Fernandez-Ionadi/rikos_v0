import { useNavigate } from 'react-router-dom'
import { DottedMenu } from '../../../../components/dotted-menu.jsx'

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
    <div className='supplier-product-table-wrap'>
      <table className='supplier-product-table'>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio de costo</th>
            <th className='supplier-product-table__th--desktop'>Categoría</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productSuppliers.map((ps) => {
            const product = products?.find((p) => p._id === ps.productId)
            const category = product ? categories.find((c) => c._id === product.categoryId) : null
            return (
              <tr key={ps._id}>
                <td>
                  <a className='supplier-product-table__link' href={`/products/${ps.productId}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/products/${ps.productId}`) }}>
                    <span className='text-truncate'>{product?.name ?? 'Producto eliminado'}</span>
                  </a>
                </td>
                <td className='supplier-product-table__cost'
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
                    <span className='supplier-product-table__cost-value'>${ps.purchaseCost?.toLocaleString() ?? '\u2014'}</span>
                  )}
                </td>
                <td className='supplier-product-table__desktop-cell'>{category?.name ?? '—'}</td>
                <td>
                  <DottedMenu items={[
                    { label: 'Desvincular', onClick: () => handleUnlink(ps._id), danger: true },
                  ]} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
