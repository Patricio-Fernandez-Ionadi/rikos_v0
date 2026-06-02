import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../app/data-context.jsx'
import * as api from '../../data/api.js'

export const SupplierDetailPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { suppliers, products, categories, setProducts } = useData()
	const [productSuppliers, setProductSuppliers] = useState([])

	const supplier = suppliers.find((s) => s._id === id)

	useEffect(() => {
		if (id) {
			api
				.getProductSuppliersBySupplier(id)
				.then(setProductSuppliers)
				.catch(console.error)
		}
	}, [id])

	// ── Add product form state ───────────────────────────
	const [showAddForm, setShowAddForm] = useState(false)
	const [addMode, setAddMode] = useState('existing')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedProductId, setSelectedProductId] = useState('')
	const [newCatId, setNewCatId] = useState(categories[0]?._id ?? '')
	const [newName, setNewName] = useState('')
	const [purchaseCost, setPurchaseCost] = useState('')

	const handleAddProduct = useCallback(async () => {
		if (!purchaseCost) return
		const cost = parseFloat(purchaseCost)
		if (isNaN(cost) || cost < 0) return
		let productId = selectedProductId

		if (addMode === 'new') {
			if (!newName.trim() || !newCatId) return
			const created = await api.createProduct({
				categoryId: newCatId,
				name: newName.trim(),
				purchaseCost: cost,
			})
			setProducts((prev) => [...prev, created])
			productId = created._id
		}

		if (!productId) return
		try {
			const ps = await api.createProductSupplier({
				productId,
				supplierId: id,
				purchaseCost: cost,
			})
			setProductSuppliers((prev) => [...prev, ps])
		} catch (e) {
			alert(e.message || 'Error al asignar producto')
		}

		setShowAddForm(false)
		setSelectedProductId('')
		setNewName('')
		setPurchaseCost('')
		setSearchTerm('')
	}, [
		id,
		addMode,
		selectedProductId,
		newName,
		newCatId,
		purchaseCost,
		setProducts,
	])

	const [editingPS, setEditingPS] = useState(null)
	const [editCost, setEditCost] = useState('')

	const handleUpdateCost = useCallback(
		async (psId) => {
			const cost = parseFloat(editCost)
			if (isNaN(cost) || cost < 0) return
			try {
				const updated = await api.updateProductSupplier(psId, {
					purchaseCost: cost,
				})
				setProductSuppliers((prev) =>
					prev.map((ps) => (ps._id === updated._id ? updated : ps)),
				)
			} catch (e) {
				console.error(e)
			}
			setEditingPS(null)
			setEditCost('')
		},
		[editCost],
	)

	const handleUnlink = useCallback(async (psId) => {
		if (!window.confirm('¿Desvincular este producto del proveedor?')) return
		try {
			await api.deleteProductSupplier(psId)
			setProductSuppliers((prev) => prev.filter((ps) => ps._id !== psId))
		} catch (e) {
			console.error(e)
		}
	}, [])

	// ── Derived ──────────────────────────────────────────
	const assignedProductIds = new Set(productSuppliers.map((ps) => ps.productId))
	const filteredProducts = products
		.filter((p) => !assignedProductIds.has(p._id))
		.filter(
			(p) =>
				!searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => a.name.localeCompare(b.name))

	if (!supplier) {
		return (
			<div className='stock-page'>
				<p
					className='placeholder'
					style={{ textAlign: 'center', padding: '40px', color: '#616161' }}
				>
					Proveedor no encontrado
				</p>
			</div>
		)
	}

	return (
		<div className='stock-page'>
			<div className='stock-page__title-row'>
				<button className='sidebar__btn' onClick={() => navigate('/suppliers')}>
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

			<div
				className='detail-page__section-header'
				style={{ marginBottom: '12px' }}
			>
				<h3 style={{ color: '#f5f5f5', margin: 0 }}>
					Productos ({productSuppliers.length})
				</h3>
				<button
					className='sidebar__btn'
					onClick={() => setShowAddForm(!showAddForm)}
					style={{ width: 'auto', padding: '6px 12px', margin: 0 }}
				>
					{showAddForm ? 'Cancelar' : '+ Agregar producto'}
				</button>
			</div>

			{showAddForm && (
				<div
					style={{
						border: '1px solid #333',
						borderRadius: '6px',
						padding: '12px',
						marginBottom: '16px',
					}}
				>
					<div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
						<button
							className={`sidebar__btn ${addMode === 'existing' ? 'sidebar__btn--active' : ''}`}
							style={{ width: 'auto', padding: '4px 10px' }}
							onClick={() => setAddMode('existing')}
						>
							Producto existente
						</button>
						<button
							className={`sidebar__btn ${addMode === 'new' ? 'sidebar__btn--active' : ''}`}
							style={{ width: 'auto', padding: '4px 10px' }}
							onClick={() => setAddMode('new')}
						>
							Producto nuevo
						</button>
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
								{filteredProducts.map((p) => (
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
									<option key={c._id} value={c._id}>
										{c.name}
									</option>
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

					<div className='modal-actions' style={{ marginTop: '10px' }}>
						<button
							className='shift-bar__btn shift-bar__btn--primary'
							disabled={
								(addMode === 'existing' && !selectedProductId) ||
								(addMode === 'new' && (!newName.trim() || !newCatId)) ||
								!purchaseCost
							}
							onClick={handleAddProduct}
						>
							Asignar
						</button>
					</div>
				</div>
			)}

			{productSuppliers.length === 0 ? (
				<p
					className='placeholder'
					style={{ textAlign: 'center', padding: '40px', color: '#616161' }}
				>
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
								const product = products.find((p) => p._id === ps.productId)
								const category = product
									? categories.find((c) => c._id === product.categoryId)
									: null
								return (
									<tr key={ps._id}>
										<td style={{ color: '#f5f5f5' }}>
											<a
												href={`/products/${ps.productId}`}
												onClick={(e) => {
													e.preventDefault()
													navigate(`/products/${ps.productId}`)
												}}
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
												className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
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
