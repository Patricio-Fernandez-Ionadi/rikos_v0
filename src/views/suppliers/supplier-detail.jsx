import { useParams, useNavigate } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useSupplierDetailManager } from '../../modules/suppliers/supplier-detail-manager.js'
import { FormActions } from '../../components/form-actions.jsx'
import { EmptyState } from '../../components/empty-state.jsx'

export const SupplierDetailPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { products, categories } = useCatalog()
	const {
		supplier, productSuppliers, filteredAvailableProducts,
		showAddForm, setShowAddForm,
		addMode, setAddMode,
		searchTerm, setSearchTerm,
		selectedProductId, setSelectedProductId,
		newCatId, setNewCatId,
		newName, setNewName,
		purchaseCost, setPurchaseCost,
		editingPS, setEditingPS,
		editCost, setEditCost,
		handleAddProduct, handleUpdateCost, handleUnlink,
	} = useSupplierDetailManager(id)

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
				<button className='btn btn--block' onClick={() => navigate('/suppliers')}>
					<span className='material-icons'>arrow_back</span> Volver
				</button>
				<h2 className='stock-page__title'>{supplier.name}</h2>
			</div>

			<div style={{ color: '#e0e0e0', marginBottom: '16px' }}>
				{supplier.contactName && <p>Contacto: {supplier.contactName}</p>}
				{supplier.phone && <p>Teléfono: {supplier.phone}</p>}
				{supplier.email && <p>Email: {supplier.email}</p>}
				{supplier.notes && <p style={{ color: '#616161' }}>{supplier.notes}</p>}
			</div>

			<div className='detail-page__section-header' style={{ marginBottom: '12px' }}>
				<h3 style={{ color: '#f5f5f5', margin: 0 }}>
					Productos ({productSuppliers.length})
				</h3>
				<button
					className='btn'
					onClick={() => setShowAddForm(!showAddForm)}
				>
					{showAddForm ? 'Cancelar' : '+ Agregar producto'}
				</button>
			</div>

			{showAddForm && (
				<div style={{ border: '1px solid #333', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
					<div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
						<button className={`btn ${addMode === 'existing' ? 'btn--active' : ''}`}
							onClick={() => setAddMode('existing')}>Producto existente</button>
						<button className={`btn ${addMode === 'new' ? 'btn--active' : ''}`}
							onClick={() => setAddMode('new')}>Producto nuevo</button>
					</div>

					{addMode === 'existing' ? (
						<>
							<label className='field-label'>Buscar producto</label>
							<input
								className='field-input'
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='Escribí para filtrar…'
							/>
							<select
								className='field-input'
								value={selectedProductId}
								onChange={(e) => setSelectedProductId(e.target.value)}
								style={{ marginTop: '6px' }}
							>
								<option value=''>Seleccionar producto…</option>
								{filteredAvailableProducts.map((p) => (
									<option key={p._id} value={p._id}>
										{p.name}
										{p.marca ? ` — ${p.marca}` : ''}
									</option>
								))}
							</select>
						</>
					) : (
						<>
							<label className='field-label'>Categoría</label>
							<select
								className='field-input'
								value={newCatId}
								onChange={(e) => setNewCatId(e.target.value)}
							>
								{categories.map((c) => (
									<option key={c._id} value={c._id}>{c.name}</option>
								))}
							</select>
							<label className='field-label' style={{ marginTop: '6px' }}>
								Nombre del producto
							</label>
							<input
								className='field-input'
								type='text'
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
							/>
						</>
					)}

					<label className='field-label' style={{ marginTop: '6px' }}>
						Precio de costo ($)
					</label>
					<input
						className='field-input'
						type='number'
						value={purchaseCost}
						onChange={(e) => setPurchaseCost(e.target.value)}
					/>

					<FormActions
						hideCancel
						submitLabel='Asignar'
						onSubmit={handleAddProduct}
						submitDisabled={
							(addMode === 'existing' && !selectedProductId) ||
							(addMode === 'new' && (!newName.trim() || !newCatId)) ||
							!purchaseCost
						}
					/>
				</div>
			)}

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
								<th></th>
							</tr>
						</thead>
						<tbody>
							{productSuppliers.map((ps) => {
								const product = products?.find((p) => p._id === ps.productId)
								const category = product
									? categories.find((c) => c._id === product.categoryId)
									: null
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
										<td
											style={{ color: '#e0e0e0', cursor: 'pointer' }}
											onClick={() => {
												if (editingPS !== ps._id) {
													setEditingPS(ps._id)
													setEditCost(String(ps.purchaseCost ?? ''))
												}
											}}
										>
											{editingPS === ps._id ? (
												<input
													className='field-input field-input--sm'
													type='number'
													value={editCost}
													onChange={(e) => setEditCost(e.target.value)}
													onBlur={() => handleUpdateCost(ps._id)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') handleUpdateCost(ps._id)
														if (e.key === 'Escape') setEditingPS(null)
													}}
													autoFocus
													style={{ width: '100px' }}
												/>
											) : (
												<>${ps.purchaseCost?.toLocaleString() ?? '\u2014'}</>
											)}
										</td>
										<td>
											<button
												className='btn btn--xs btn--danger'
												onClick={() => handleUnlink(ps._id)}
											>
												X
											</button>
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
