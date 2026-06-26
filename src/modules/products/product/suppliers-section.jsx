import { Button } from '../../../components/button.jsx'

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
              const diff = ps && !isActive && product.purchaseCost != null
                ? ps.purchaseCost - product.purchaseCost
                : null
              const diffClass = diff == null ? '' : diff < 0 ? 'detail-page__diff--positive' : 'detail-page__diff--negative'
              return (
                <div key={s._id}
                  className={`detail-page__supplier-row${isActive ? ' detail-page__supplier-row--active' : ''}`}
                  onClick={() => isActive ? null : handleUseSupplierCost(ps)}
                  role='button' tabIndex={0}>
                  <span className='detail-page__supplier-name'>
                    {s.name}{isActive && ' ✓'}
                  </span>
                  <span className={`detail-page__supplier-cost ${diffClass}`}>
                    ${ps?.purchaseCost?.toLocaleString() ?? '—'}
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
