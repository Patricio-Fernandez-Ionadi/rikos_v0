import { Button } from '../../../components/button.jsx'

export function SupplierProductsPanel({ supplierName, supplierProducts, productMap, addedProductIds, onAdd }) {
  return (
    <div className='surface-card p-16 mb-16'>
      <div className='flex-row' style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 className='text-white m-0'>
          Productos de {supplierName}
          {supplierProducts.length > 0 && ` (${supplierProducts.length})`}
        </h4>
      </div>
      {supplierProducts.length === 0 ? (
        <p className='placeholder'>Este proveedor no tiene productos asignados</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {supplierProducts.map((sp) => {
            const prod = productMap.get(sp.productId)
            if (!prod || addedProductIds.has(sp.productId)) return null
            return (
              <div key={sp._id} className='flex-row'
                style={{ justifyContent: 'space-between', alignItems: 'center', background: 'var(--black)', padding: '8px 12px', borderRadius: 6 }}>
                <span className='text-white'>{prod.name}</span>
                <span style={{ color: 'var(--grey-light)', fontSize: '0.85em' }}>
                  ${sp.purchaseCost?.toLocaleString() ?? '\u2014'} u.
                </span>
                <Button size='xs' onClick={() => onAdd(prod, sp.purchaseCost)}>+ Agregar</Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
