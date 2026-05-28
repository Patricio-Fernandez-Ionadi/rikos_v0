import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../app/data-context.jsx'
import * as api from '../data/api.js'

export const SupplierDetailPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { suppliers, products, categories } = useData()
	const [productSuppliers, setProductSuppliers] = useState([])

	const supplier = suppliers.find((s) => s._id === id)

	useEffect(() => {
		if (id) {
			api.getProductSuppliersBySupplier(id).then(setProductSuppliers).catch(console.error)
		}
	}, [id])

	if (!supplier) {
		return (
			<div className='stock-page'>
				<p className='placeholder' style={{ textAlign: 'center', padding: '40px', color: '#616161' }}>
					Proveedor no encontrado
				</p>
			</div>
		)
	}

	return (
		<div className='stock-page'>
			<div className='stock-page__title-row'>
				<button className='sidebar__btn' onClick={() => navigate('/suppliers')}>
					← Volver
				</button>
				<h2 className='stock-page__title'>{supplier.name}</h2>
			</div>

			<div style={{ color: '#e0e0e0', marginBottom: '16px' }}>
				{supplier.contactName && <p>Contacto: {supplier.contactName}</p>}
				{supplier.phone && <p>Teléfono: {supplier.phone}</p>}
				{supplier.email && <p>Email: {supplier.email}</p>}
				{supplier.notes && <p style={{ color: '#616161' }}>{supplier.notes}</p>}
			</div>

			<h3 style={{ color: '#f5f5f5', marginBottom: '12px' }}>
				Productos ({productSuppliers.length})
			</h3>

			{productSuppliers.length === 0 ? (
				<p className='placeholder' style={{ textAlign: 'center', padding: '40px', color: '#616161' }}>
					Este proveedor no tiene productos asignados
				</p>
			) : (
				<div className='stock-page__table-wrap'>
					<table className='stock-page__table'>
						<thead>
							<tr>
								<th>Producto</th>
								<th>Categoría</th>
								<th>Precio de costo</th>
							</tr>
						</thead>
						<tbody>
							{productSuppliers.map((ps) => {
								const product = products.find((p) => p._id === ps.productId)
								const category = product ? categories.find((c) => c._id === product.categoryId) : null
								return (
									<tr key={ps._id}>
										<td style={{ color: '#f5f5f5' }}>
											<a
												href={`/products/${ps.productId}`}
												onClick={(e) => { e.preventDefault(); navigate(`/products/${ps.productId}`) }}
												style={{ color: '#64b5f6', textDecoration: 'none' }}
											>
												{product?.name ?? 'Producto eliminado'}
											</a>
										</td>
										<td>{category?.name ?? '—'}</td>
										<td style={{ color: '#e0e0e0' }}>
											${ps.purchaseCost?.toLocaleString() ?? '—'}
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
