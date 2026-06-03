import { useNavigate } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { Button } from '../../components/button.jsx'
import { DataTable } from '../../components/data-table.jsx'

export const SuppliersPage = () => {
	const navigate = useNavigate()
	const { suppliers, deleteSupplier } = useProductManager()

	return (
		<div className='stock-page'>
			<div className='stock-page__title-row'>
				<h2 className='stock-page__title'>Proveedores</h2>
				<Button block onClick={() => navigate('/suppliers/new')}>+ Nuevo proveedor</Button>
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
						<td>
							<div style={{ display: 'flex', gap: 4 }}>
								<Button size='xs' onClick={() => navigate(`/suppliers/${s._id}`)}>Productos</Button>
								<Button size='xs' onClick={() => navigate(`/suppliers/${s._id}/edit`)}>Editar</Button>
								<Button size='xs' variant='danger' onClick={() => deleteSupplier(s._id)}>Eliminar</Button>
							</div>
						</td>
					</tr>
				)}
			/>
		</div>
	)
}
