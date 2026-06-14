import { useState, useMemo, useEffect } from 'react'
import { Modal } from '../../../components/modal.jsx'
import { Button } from '../../../components/button.jsx'

export function QuickOrderModal({
	open,
	onClose,
	product,
	productSuppliers,
	suppliers,
	onConfirm,
}) {
	const supplierOptions = useMemo(
		() =>
			productSuppliers
				.filter((ps) => ps.productId === product._id)
				.map((ps) => ({
					ps,
					supplier: suppliers.find((s) => s._id === ps.supplierId),
				}))
				.filter(({ supplier }) => supplier),
		[productSuppliers, product._id, suppliers],
	)

	const [selectedIdx, setSelectedIdx] = useState(0)
	const [quantity, setQuantity] = useState(1)
	const [cost, setCost] = useState('')

	const current = supplierOptions[selectedIdx]

	useEffect(() => {
		if (current) setCost(String(current.ps.purchaseCost ?? ''))
	}, [current])

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!current) return
		onConfirm({
			product,
			supplierId: current.ps.supplierId,
			supplierName: current.supplier.name,
			quantity: Number(quantity),
			unitCost: Number(cost),
			unitLabel: current.ps.supplierUnitLabel ?? 'Unidad',
		})
	}

	if (!open) return null

	return (
		<Modal open={open} onClose={onClose} title={`Pedir: ${product.name}`}>
			<form onSubmit={handleSubmit} className='quick-order-form'>
				{supplierOptions.length === 0 && (
					<p className='placeholder text-muted'>
						El producto no tiene proveedores asignados.
					</p>
				)}

				{supplierOptions.length > 1 && (
					<label className='field'>
						<span className='field-label'>Proveedor</span>
						<select
							className='field-input'
							value={selectedIdx}
							onChange={(e) => setSelectedIdx(Number(e.target.value))}
						>
							{supplierOptions.map(({ supplier }, i) => (
								<option key={supplier._id} value={i}>
									{supplier.name}
								</option>
							))}
						</select>
					</label>
				)}

				{current && (
					<>
						<div className='field'>
							<span className='field-label'>Presentación del proveedor</span>
							<div className='field-hint'>
								{current.ps.supplierUnitLabel ?? 'Unidad'}
								{current.ps.supplierUnitQty > 1 && (
									<span className='text-muted'>
										{' '}
										({current.ps.supplierUnitQty} uds. por empaque)
									</span>
								)}
							</div>
						</div>

						<label className='field'>
							<span className='field-label'>
								Cantidad ({current.ps.supplierUnitLabel ?? 'unidad'})
							</span>
							<input
								className='field-input'
								type='number'
								min={1}
								value={quantity}
								onChange={(e) =>
									setQuantity(Math.max(1, Number(e.target.value)))
								}
							/>
						</label>

						<label className='field'>
							<span className='field-label'>
								Costo por {current.ps.supplierUnitLabel ?? 'unidad'}
							</span>
							<input
								className='field-input'
								type='number'
								step='any'
								min={0}
								value={cost}
								onChange={(e) => setCost(e.target.value)}
							/>
						</label>

						<div className='field'>
							<span className='field-label'>Total</span>
							<div className='field-value'>
								${(Number(quantity) * Number(cost)).toLocaleString()}
							</div>
						</div>
					</>
				)}

				<div className='form-actions'>
					<Button type='button' variant='default' onClick={onClose}>
						Cancelar
					</Button>
					<Button type='submit' variant='primary' disabled={!current}>
						Agregar al pedido
					</Button>
				</div>
			</form>
		</Modal>
	)
}
