import { useState } from 'react'
import { FormActions } from '../../../components/form-actions.jsx'

export function NewSupplierInline({ show, onSave }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name, contact, phone, email)
    setName('')
    setContact('')
    setPhone('')
    setEmail('')
  }

  if (!show) return null

  return (
    <div className='surface-card p-16 mb-16'>
      <h4 className='text-white mb-8'>Nuevo proveedor</h4>
      <label className='field-label'>Nombre *</label>
      <input className='field-input' type='text' value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
      <label className='field-label'>Nombre de contacto</label>
      <input className='field-input' type='text' value={contact} onChange={(e) => setContact(e.target.value)} />
      <label className='field-label'>Teléfono</label>
      <input className='field-input' type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />
      <label className='field-label'>Email</label>
      <input className='field-input' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <div style={{ marginTop: 12 }}>
        <FormActions hideCancel submitLabel='Crear proveedor' onSubmit={handleSave} submitDisabled={!name.trim()} />
      </div>
    </div>
  )
}
