import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { Modal } from '../../components/Modal.jsx'
import { Button } from '../../components/button.jsx'
import { FormActions } from '../../components/form-actions.jsx'
import { DataTable } from '../../components/data-table.jsx'

export const SuppliersPage = () => {
	const navigate = useNavigate()
	const { suppliers, createSupplier, updateSupplier, deleteSupplier } =
		useProductManager()

	const [showForm, setShowForm] = useState(false)
	const [editing, setEditing] = useState(null)
	const [form, setForm] = useState({
		name: '',
		contactName: '',
		phone: '',
		email: '',
		notes: '',
	})

	const openCreate = () => {
		setEditing(null)
		setForm({ name: '', contactName: '', phone: '', email: '', notes: '' })
		setShowForm(true)
	}

	const openEdit = (s) => {
		setEditing(s)
		setForm({
			name: s.name,
			contactName: s.contactName ?? '',
			phone: s.phone ?? '',
			email: s.email ?? '',
			notes: s.notes ?? '',
		})
		setShowForm(true)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!form.name.trim()) return
		try {
			if (editing) {
				await updateSupplier(editing._id, {
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
			setShowForm(false)
		} catch {
			/* error logged by manager */
		}
	}

	return (
		<div className='stock-page'>
			<div className='stock-page__title-row'>
				<h2 className='stock-page__title'>Proveedores</h2>
				<Button block onClick={openCreate}>+ Nuevo proveedor</Button>
			</div>

			<DataTable
				variant='stock-page'
				columns={[
					{ key: 'name', label: 'Nombre' },
					{ key: 'contact', label: 'Contacto' },
					{ key: 'phone', label: 'Teléfono' },
					{ key: 'email', label: 'Email' },
					{ key: 'notes', label: 'Notas' },
					{ key: 'actions', label: 'Acciones' },
				]}
				rows={suppliers}
				emptyMessage='No hay proveedores registrados'
				renderRow={(s) => (
					<tr key={s._id}>
						<td className='text-white'>{s.name}</td>
						<td>{s.contactName ?? '—'}</td>
						<td>{s.phone ?? '—'}</td>
						<td>{s.email ?? '—'}</td>
						<td>{s.notes ?? ''}</td>
						<td style={{ display: 'flex', gap: 4 }}>
							<Button size='xs' onClick={() => navigate(`/suppliers/${s._id}`)}>Productos</Button>
							<Button size='xs' onClick={() => openEdit(s)}>Editar</Button>
							<Button size='xs' variant='danger' onClick={() => deleteSupplier(s._id)}>Eliminar</Button>
						</td>
					</tr>
				)}
			/>

			<Modal
				open={showForm}
				onClose={() => setShowForm(false)}
				title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
			>
				<form className='product-form' onSubmit={handleSubmit}>
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

					<FormActions
						onCancel={() => setShowForm(false)}
						submitLabel={editing ? 'Guardar cambios' : 'Crear proveedor'}
					/>
				</form>
			</Modal>
		</div>
	)
}
