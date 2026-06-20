import { Button } from '../../../components/button.jsx'

function getBultoLabel(ps) {
  if (ps.bultoUnits != null) return `${ps.bultoUnits} uds`
  if (ps.bultoKg != null) return `${ps.bultoKg} kg`
  return ps.supplierUnitLabel ?? 'Unidad'
}

function getUnitLabel(product) {
  return product?.saleType === 'fraction' ? 'kg' : 'Unidad'
}

export function SupplierProductsPanel({ supplierName, supplierProducts, productMap, addedProductIds, onAdd, presentationMap }) {
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
            if (!prod) return null
            const presList = presentationMap?.get(prod._id) ?? []
            const allAdded = presList.length > 0
              ? presList.every((pres) => addedProductIds.has(`${prod._id}-${pres._id}`))
              : addedProductIds.has(prod._id)
            if (!presList.length && addedProductIds.has(prod._id)) return null
            if (allAdded) return null

            return (
              <div key={sp._id} className='supplier-product-group'>
                <div className='supplier-product-group__header'>
                  <span className='text-white'>{prod.name}</span>
                  <span className='supplier-product-group__cost'>
                    ${sp.purchaseCost?.toLocaleString() ?? '—'} ({getBultoLabel(sp)})
                  </span>
                </div>
                {presList.length > 0 ? (
                  <div className='supplier-product-group__presents'>
                    {presList.map((pres) => {
                      const key = `${prod._id}-${pres._id}`
                      if (addedProductIds.has(key)) return null
                      return (
                        <div key={pres._id} className='supplier-product-group__pres-row'>
                          <span className='supplier-product-group__pres-label'>
                            {pres.code != null && <span className='pres-code-sm'>{pres.code}</span>}
                            {pres.label || 'Sin etiqueta'}
                          </span>
                          <Button size='xs' onClick={() => onAdd(prod, sp.purchaseCost, getUnitLabel(prod), pres)}>
                            + Agregar
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className='supplier-product-group__no-pres'>
                    <Button size='xs' onClick={() => onAdd(prod, sp.purchaseCost, getUnitLabel(prod))}>
                      + Agregar producto
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}