import { useNavigate } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { Button } from '../../components/button.jsx'
import { DataTable } from '../../components/data-table.jsx'
import { DottedMenu } from '../../components/dotted-menu.jsx'

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
					{ key: 'contact', label: 'Contacto', className: 'stock-cell--desktop' },
					{ key: 'phone', label: 'Teléfono', className: 'stock-cell--desktop' },
					{ key: 'email', label: 'Email', className: 'stock-cell--desktop' },
					{ key: 'notes', label: 'Notas', className: 'stock-cell--desktop' },
					{ key: 'actions', label: 'Acciones' },
				]}
				rows={suppliers}
				emptyMessage='No hay proveedores registrados'
				renderRow={(s) => (
					<tr key={s._id}>
						<td>
							<button className='stock-cell__link text-truncate' onClick={() => navigate(`/suppliers/${s._id}`)}>
								{s.name}
							</button>
						</td>
						<td className='stock-cell--desktop'>{s.contactName ?? '—'}</td>
						<td className='stock-cell--desktop'>{s.phone ?? '—'}</td>
						<td className='stock-cell--desktop'>{s.email ?? '—'}</td>
						<td className='stock-cell--desktop'>{s.notes ?? ''}</td>
						<td>
							<DottedMenu items={[
								{ label: 'Ver productos', onClick: () => navigate(`/suppliers/${s._id}`) },
								{ label: 'Editar', onClick: () => navigate(`/suppliers/${s._id}/edit`) },
								{ label: 'Eliminar', onClick: () => deleteSupplier(s._id), danger: true },
							]} />
						</td>
					</tr>
				)}
			/>
		</div>
	)
}
