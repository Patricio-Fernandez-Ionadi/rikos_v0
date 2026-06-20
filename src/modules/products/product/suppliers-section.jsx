import { Button } from '../../../components/button.jsx'

function getSupplierQty(ps) {
  if (ps.bultoUnits != null) return ps.bultoUnits
  if (ps.bultoKg != null) return ps.bultoKg
  return ps.supplierUnitQty ?? 1
}

function getDerivedCost(ps) {
  const qty = getSupplierQty(ps)
  return +(ps.purchaseCost / qty).toFixed(2)
}

function getBultoLabel(ps) {
  if (ps.bultoUnits != null) return `${ps.bultoUnits} uds`
  if (ps.bultoKg != null) return `${ps.bultoKg} kg`
  return ps.supplierUnitLabel ? `×${ps.supplierUnitQty ?? 1} ${ps.supplierUnitLabel}` : ''
}

function getCostLabel(product) {
  return product?.saleType === 'fraction' ? 'Costo por kg' : 'Costo unitario'
}

export function SuppliersSection({
  productSuppliers, suppliers, assignedSupplierIds, activeSupplier,
  product, handleUseSupplierCost, handleRemoveSupplier, handleAddSupplier,
}) {
  return (
    <div className='detail-page__section'>
      <div className='detail-page__section-header'>
        <h3>Proveedores</h3>
      </div>

      <div className='detail-page__suppliers'>
        {productSuppliers.length === 0 ? (
          <p className='placeholder text-muted'>Sin proveedores asignados</p>
        ) : (
          suppliers.filter((s) => assignedSupplierIds.includes(s._id))
            .map((s) => {
              const ps = productSuppliers.find((ps) => ps.supplierId === s._id)
              const isActive = ps?.supplierId === activeSupplier
              const derivedCost = ps ? getDerivedCost(ps) : 0
              const diff = isActive || product.purchaseCost == null
                ? null
                : derivedCost - product.purchaseCost
              const diffClass = diff == null ? '' : diff < 0 ? 'detail-page__diff--positive' : 'detail-page__diff--negative'
              const costLabel = getCostLabel(product)
              return (
                <div key={s._id}
                  className={`detail-page__supplier-row${isActive ? ' detail-page__supplier-row--active' : ''}`}
                  onClick={() => isActive ? null : handleUseSupplierCost(ps)}
                  role='button' tabIndex={0}>
                  <span className='detail-page__supplier-name'>
                    {s.name}{isActive && ' ✓'}
                  </span>
                  <span className='detail-page__supplier-bulto'>
                    Bulto: ${ps?.purchaseCost?.toLocaleString() ?? '—'} ({getBultoLabel(ps)})
                  </span>
                  <span className={`detail-page__supplier-cost ${diffClass}`}>
                    {costLabel}: ${derivedCost.toLocaleString()}
                    {diff != null && ` (${diff > 0 ? '+' : ''}${diff.toLocaleString()})`}
                  </span>
                  <Button size='xs' variant='danger'
onClick={(e) => { e.stopPropagation(); handleRemoveSupplier(ps._id) }}>
    ✕
</Button>
                </div>
              )
            })
        )}
        {suppliers.filter((s) => !assignedSupplierIds.includes(s._id)).length > 0 && (
          <div className='detail-page__supplier-add'>
            <select className='field-input field-input--sm'
              onChange={(e) => {
                const sid = e.target.value
                e.target.value = ''
                if (sid) handleAddSupplier(sid, 0)
              }}>
              <option value=''>Agregar proveedor...</option>
              {suppliers.filter((s) => !assignedSupplierIds.includes(s._id))
                .map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}