import { useState } from 'react'
import { Button } from '../../../components/button.jsx'
import { FormActions } from '../../../components/form-actions.jsx'

export function NewProductInline({ categories, onSave }) {
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCatId, setNewCatId] = useState(categories[0]?._id ?? '')
  const [newCost, setNewCost] = useState('')

  const handleSave = () => {
    if (!newName.trim() || !newCatId || !newCost) return
    onSave(newName, newCatId, newCost)
    setShowNewForm(false)
    setNewName('')
    setNewCost('')
  }

  return (
    <div className='surface-card p-16 mb-16'>
      <div className='flex-row' style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: showNewForm ? 12 : 0 }}>
        <h4 className='text-white m-0'>Nuevo producto</h4>
        {!showNewForm && (
          <Button size='sm' onClick={() => setShowNewForm(true)}>+ Crear producto</Button>
        )}
      </div>

      {showNewForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className='flex-row' style={{ gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label className='field-label'>Categoría</label>
              <select className='field-input' value={newCatId} onChange={(e) => setNewCatId(e.target.value)}>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label className='field-label'>Nombre</label>
              <input className='field-input' type='text' value={newName}
                onChange={(e) => setNewName(e.target.value)} placeholder='Nombre del producto' />
            </div>
            <div style={{ flex: 1 }}>
              <label className='field-label'>Costo ($)</label>
              <input className='field-input' type='number' min='0' step='0.01'
                value={newCost} onChange={(e) => setNewCost(e.target.value)} />
            </div>
          </div>
          <FormActions
            cancelLabel='Cancelar'
            submitLabel='Crear y agregar al pedido'
            onCancel={() => setShowNewForm(false)}
            onSubmit={handleSave}
            submitDisabled={!newName.trim() || !newCatId || !newCost}
            submitVariant='primary'
          />
        </div>
      )}
    </div>
  )
}
