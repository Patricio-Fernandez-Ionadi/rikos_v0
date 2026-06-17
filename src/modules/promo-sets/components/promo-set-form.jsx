import { useState } from 'react'
import { useCatalog } from '../../../app/catalog-context.jsx'

export const PromoSetForm = ({ initial, onSubmit, onCancel }) => {
  const { products, presentations } = useCatalog()
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(initial?.price ?? '')
  const [items, setItems] = useState(initial?.items ?? [])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPres = presentations.filter((p) => {
    const prod = products.find((pr) => pr._id === p.productId)
    const nameMatch = prod?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const labelMatch = p.label?.toLowerCase().includes(searchTerm.toLowerCase())
    const codeMatch = p.code != null && String(p.code).includes(searchTerm)
    return nameMatch || labelMatch || codeMatch
  })

  const handleAddItem = (pres) => {
    setItems((prev) => [...prev, { presentationId: pres._id, quantity: 1 }])
  }

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleQtyChange = (index, qty) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(1, parseInt(qty) || 1) } : item)),
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name: name.trim(), price: parseFloat(price), items })
  }

  return (
    <form className='promo-form' onSubmit={handleSubmit}>
      <label className='field-label'>Nombre de la promoción</label>
      <input className='field-input' type='text' value={name} onChange={(e) => setName(e.target.value)} autoFocus />

      <label className='field-label'>Precio promocional ($)</label>
      <input className='field-input' type='number' value={price} onChange={(e) => setPrice(e.target.value)} />

      <label className='field-label'>Buscar productos para agregar</label>
      <input className='field-input' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Nombre, código…' />

      <div className='promo-form__results'>
        {filteredPres.slice(0, 20).map((pres) => {
          const prod = products.find((p) => p._id === pres.productId)
          const alreadyAdded = items.some((i) => i.presentationId === pres._id)
          return (
            <div key={pres._id} className='promo-form__result-row'>
              <span>
                {pres.code != null && <span className='pres-code-sm'>{pres.code}</span>}
                {prod?.name} — {pres.label}
              </span>
              <span className='text-muted'>${pres.salePrice?.toLocaleString() ?? '—'}</span>
              <button type='button' className='btn btn--xs btn--primary' onClick={() => handleAddItem(pres)} disabled={alreadyAdded}>
                {alreadyAdded ? '✓' : '+'}
              </button>
            </div>
          )
        })}
        {filteredPres.length === 0 && <p className='placeholder'>Sin resultados</p>}
      </div>

      {items.length > 0 && (
        <div className='promo-form__items'>
          <label className='field-label'>Items incluidos</label>
          {items.map((item, i) => {
            const pres = presentations.find((p) => p._id === item.presentationId)
            const prod = products.find((p) => p._id === pres?.productId)
            return (
              <div key={i} className='promo-form__item-row'>
                <span>{prod?.name} — {pres?.label}</span>
                <input className='field-input field-input--sm' type='number' min='1'
                  value={item.quantity}
                  onChange={(e) => handleQtyChange(i, e.target.value)}
                  style={{ width: 60 }}
                />
                <button type='button' className='btn btn--xs btn--danger' onClick={() => handleRemoveItem(i)}>x</button>
              </div>
            )
          })}
        </div>
      )}

      <div className='form-actions'>
        <button type='button' className='btn' onClick={onCancel}>Cancelar</button>
        <button type='submit' className='btn btn--primary' disabled={!name || !price || items.length === 0}>
          {initial ? 'Guardar cambios' : 'Crear promoción'}
        </button>
      </div>
    </form>
  )
}
