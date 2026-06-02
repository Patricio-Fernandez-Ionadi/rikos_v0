import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { Modal } from '../../components/Modal.jsx'

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
				<button className='sidebar__btn' onClick={openCreate}>
					+ Nuevo proveedor
				</button>
			</div>

			{suppliers.length === 0 ? (
				<p
					className='placeholder'
					style={{ textAlign: 'center', padding: '40px', color: '#616161' }}
				>
					No hay proveedores registrados
				</p>
			) : (
				<div className='stock-page__table-wrap'>
					<table className='stock-page__table'>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Contacto</th>
								<th>Teléfono</th>
								<th>Email</th>
								<th>Notas</th>
								<th>Acciones</th>
							</tr>
						</thead>
						<tbody>
							{suppliers.map((s) => (
								<tr key={s._id}>
									<td style={{ color: '#f5f5f5' }}>{s.name}</td>
									<td>{s.contactName ?? '—'}</td>
									<td>{s.phone ?? '—'}</td>
									<td>{s.email ?? '—'}</td>
									<td>{s.notes ?? ''}</td>
									<td>
										<button
											className='sidebar__btn sidebar__btn--xs'
											onClick={() => navigate(`/suppliers/${s._id}`)}
										>
											Productos
										</button>
										<button
											className='sidebar__btn sidebar__btn--xs'
											onClick={() => openEdit(s)}
										>
											Editar
										</button>
										<button
											className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
											onClick={() => deleteSupplier(s._id)}
										>
											Eliminar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

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

					<div className='modal-actions'>
						<button
							type='button'
							className='shift-bar__btn'
							onClick={() => setShowForm(false)}
						>
							Cancelar
						</button>
						<button
							type='submit'
							className='shift-bar__btn shift-bar__btn--primary'
						>
							{editing ? 'Guardar cambios' : 'Crear proveedor'}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	)
}
