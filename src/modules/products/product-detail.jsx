import { DottedMenu } from '../../components/dotted-menu.jsx'

export const ProductDetail = ({
	onSetEdit,
	product,
	onDelete,
	showModal,
	showForm,
	stockGramsEdit,
	stockGramsValue,
	onStockGramsChange,
	onStockGramsSave,
	onStockGramsCancel,
	onToggleSuppliers,
	showSupplierPanel,
	productSuppliers,
	suppliers,
	onAddSupplier,
	onRemoveSupplier,
	onUseSupplierCost,
}) => {
	const isFraction = product.saleType === 'fraction'

	const menuItems = [
		{ label: 'Editar producto', onClick: () => onSetEdit(product) },
		{ label: 'Ver presentaciones', onClick: () => showModal(true) },
		{ label: '+ Presentación', onClick: () => showForm(true) },
		{ label: 'Proveedores', onClick: () => onToggleSuppliers() },
		{
			label: 'Eliminar producto',
			onClick: () => onDelete(product._id),
			danger: true,
		},
	]

	const assignedSupplierIds = productSuppliers.map((ps) => ps.supplierId)

	return (
		<>
			<div className='detail__header'>
				<h3 className='detail__title'>{product.name}</h3>
				<DottedMenu items={menuItems} />
			</div>
			<p className='detail__cost'>
				<strong>Tipo:</strong> {isFraction ? 'Fraccionable' : 'Unidad'}
			</p>
			<p className='detail__cost'>
				<strong>Costo de compra:</strong> $
				{product.purchaseCost?.toLocaleString() ?? 'Sin datos'}
			</p>

			{isFraction && (
				<p className='detail__cost'>
					<strong>Stock en gramos:</strong>{' '}
					{stockGramsEdit ? (
						<span className='stock-edit-inline'>
							<input
								className='field-input field-input--xs'
								type='number'
								value={stockGramsValue}
								onChange={(e) => onStockGramsChange(e.target.value)}
							/>
							<button
								className='sidebar__btn sidebar__btn--xs'
								onClick={onStockGramsSave}
							>
								OK
							</button>
							<button
								className='sidebar__btn sidebar__btn--xs'
								onClick={onStockGramsCancel}
							>
								X
							</button>
						</span>
					) : (
						<>
							{product.stockGrams ?? 0}g
							<button
								className='sidebar__btn sidebar__btn--xs'
								onClick={onStockGramsCancel}
							>
								Ajustar
							</button>
						</>
					)}
				</p>
			)}

			{showSupplierPanel && (
				<div className='detail__suppliers'>
					<h4>Proveedores</h4>
					{suppliers
						.filter((s) => assignedSupplierIds.includes(s._id))
						.map((s) => {
							const ps = productSuppliers.find((ps) => ps.supplierId === s._id)
							return (
								<div key={s._id} className='supplier-row'>
									<span className='supplier-row__name'>{s.name}</span>
									<span className='supplier-row__cost'>${ps?.purchaseCost?.toLocaleString() ?? '—'}</span>
									<button
										className='sidebar__btn sidebar__btn--xs'
										onClick={() => onUseSupplierCost(ps?.purchaseCost)}
										title='Usar este costo'
									>
										Usar costo
									</button>
									<button
										className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
										onClick={() => onRemoveSupplier(ps._id)}
									>
										X
									</button>
								</div>
							)
						})}
					{suppliers.filter((s) => !assignedSupplierIds.includes(s._id)).length > 0 && (
						<div className='supplier-add'>
							<select
								className='field-input field-input--sm'
								id='supplier-select'
								onChange={(e) => {
									const sid = e.target.value
									e.target.value = ''
									if (sid) onAddSupplier(sid, 0)
								}}
							>
								<option value=''>Agregar proveedor...</option>
								{suppliers
									.filter((s) => !assignedSupplierIds.includes(s._id))
									.map((s) => (
										<option key={s._id} value={s._id}>{s.name}</option>
									))
								}
							</select>
						</div>
					)}
				</div>
			)}
		</>
	)
}
