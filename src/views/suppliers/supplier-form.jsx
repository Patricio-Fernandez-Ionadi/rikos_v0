import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { Button } from '../../components/button.jsx'
import { FormActions } from '../../components/form-actions.jsx'

export const SupplierFormPage = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/suppliers'
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { suppliers, createSupplier, updateSupplier } = useProductManager()

  const supplier = isEditing ? suppliers.find((s) => s._id === id) : null

  const [form, setForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    notes: '',
  })

  useEffect(() => {
    if (!supplier) return
    setForm({
      name: supplier.name,
      contactName: supplier.contactName ?? '',
      phone: supplier.phone ?? '',
      email: supplier.email ?? '',
      notes: supplier.notes ?? '',
    })
  }, [supplier])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (isEditing) {
      await updateSupplier(id, {
        name: form.name.trim(),
        contactName: form.contactName.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        notes: form.notes.trim(),
      })
    } else {
      await createSupplier({
        name: form.name.trim(),
        contactName: form.contactName.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        notes: form.notes.trim(),
      })
    }
    navigate(returnTo)
  }

  if (isEditing && !supplier) {
    return (
      <div className='stock-page'>
        <p className='placeholder'>Proveedor no encontrado</p>
      </div>
    )
  }

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <button className='back-btn' onClick={() => navigate(returnTo)}>
          <span className='material-icons'>arrow_back</span> Volver
        </button>
        <h2 className='stock-page__title'>
          {isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}
        </h2>
      </div>

      <form className='product-form' onSubmit={handleSubmit}>
        <div className='surface-card p-16 mb-16'>
          <label className='field-label'>Nombre *</label>
          <input
            className='field-input'
            type='text'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
            required
          />

          <label className='field-label'>Nombre de contacto</label>
          <input
            className='field-input'
            type='text'
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
          />

          <label className='field-label'>Teléfono</label>
          <input
            className='field-input'
            type='text'
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label className='field-label'>Email</label>
          <input
            className='field-input'
            type='email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className='field-label'>Notas</label>
          <textarea
            className='field-input'
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </div>

        <FormActions
          onCancel={() => navigate(returnTo)}
          submitLabel={isEditing ? 'Guardar cambios' : 'Crear proveedor'}
        />
      </form>
    </div>
  )
}
