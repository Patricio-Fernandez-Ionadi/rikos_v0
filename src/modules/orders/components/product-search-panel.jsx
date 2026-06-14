import { Button } from '../../../components/button.jsx'

export function ProductSearchPanel({ searchQuery, onSearchChange, filteredProducts, selectedProductId, onSelectedProductChange, onAdd }) {
  return (
    <div className='surface-card p-16 mb-16'>
      <h4 className='text-white mb-8'>Buscar productos</h4>
      <div className='flex-row' style={{ gap: 8, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className='field-label'>Filtrar por nombre</label>
          <input className='field-input' type='text' value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)} placeholder='Escribí para filtrar…' />
        </div>
        <div style={{ flex: 2 }}>
          <label className='field-label'>Producto</label>
          <select className='field-input' value={selectedProductId}
            onChange={(e) => onSelectedProductChange(e.target.value)}>
            <option value=''>Seleccionar producto…</option>
            {filteredProducts.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}{p.marca ? ` — ${p.marca}` : ''}
              </option>
            ))}
          </select>
        </div>
        <Button size='sm' onClick={onAdd} disabled={!selectedProductId}>Agregar</Button>
      </div>
    </div>
  )
}
