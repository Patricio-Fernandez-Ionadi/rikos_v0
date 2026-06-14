export function SupplierSelector({ supplierId, suppliers, onChange }) {
  return (
    <div className='surface-card p-16 mb-16'>
      <label className='field-label'>Proveedor</label>
      <select className='field-input' value={supplierId} onChange={onChange} required>
        <option value=''>Seleccionar proveedor...</option>
        {suppliers.map((s) => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
        <option value='__new__'>+ Nuevo proveedor</option>
      </select>
    </div>
  )
}
