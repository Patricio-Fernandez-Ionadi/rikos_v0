import { useState } from 'react'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { SaleForm } from '../../components/sale-form.jsx'
import * as stockService from './services/stock-services.js'

export const StockRow = ({ pres, product, onNavigate }) => {
	const { setPresentations, setProducts } = useData()
	const { shift, addSale } = useShift()

	const isFraction = product?.saleType === 'fraction'

	const [editPresId, setEditPresId] = useState(null)
	const [editStock, setEditStock] = useState('')
	const [editGrams, setEditGrams] = useState('')
	const [salePresId, setSalePresId] = useState(null)

	const handleUpdate = async () => {
		const stockVal = parseInt(editStock)
		if (isNaN(stockVal) || stockVal < 0) return

		try {
			const updated = await stockService.updateStock(pres._id, stockVal)
			setPresentations((prev) =>
				prev.map((p) => (p._id === updated._id ? updated : p)),
			)

			if (isFraction) {
				if (pres.grams) {
					const oldStock = pres.stock ?? 0
					const delta = stockVal - oldStock
					if (delta !== 0) {
						const gramsDelta = delta * pres.grams
						const updatedProduct = await stockService.updateStockGrams(product._id, (product.stockGrams ?? 0) + gramsDelta)
						setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
					}
				}

				const gramsVal = parseInt(editGrams)
				if (!isNaN(gramsVal) && gramsVal >= 0 && gramsVal !== (product.stockGrams ?? 0)) {
					const updatedProduct = await stockService.updateStockGrams(product._id, gramsVal)
					setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
				}
			}
		} catch (e) {
			console.error(e)
		}
		setEditPresId(null)
	}

	const handleSale = async (sale) => {
		await addSale(sale)
		setPresentations((prev) =>
			prev.map((p) =>
				p._id === sale.presentationId
					? { ...p, stock: Math.max(0, (p.stock ?? 0) - sale.quantity) }
					: p,
			),
		)
		if (isFraction) {
			const deduction = sale.quantity * (pres.grams ?? 0)
			setProducts((prev) =>
				prev.map((p) =>
					p._id === product._id
						? { ...p, stockGrams: Math.max(0, (p.stockGrams ?? 0) - deduction) }
						: p,
				),
			)
		}
		setSalePresId(null)
	}

	const presStock = pres.stock ?? 0
	const totalGrams = product.stockGrams ?? 0
	const stockLow = presStock <= (isFraction ? 5 : 5)
	const gramsLow = isFraction && totalGrams <= 100

	return (
		<>
			<tr key={pres._id}>
				<td className='stock-cell--product'>
				<button className='stock-cell__link' onClick={onNavigate}>
					{product.name}
					{pres.label ? <span className='stock-page__marca'> — {pres.label}</span> : ''}
					{pres.grams ? <span className='stock-page__marca'> ({pres.grams}g)</span> : ''}
				</button>
			</td>
				<td className='stock-cell--stock'>
					<span
						className={`stock-page__qty ${stockLow ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}
					>
						{presStock} u
					</span>
				</td>
				<td className='stock-cell--grams'>
					{isFraction && (
						<span className={`stock-page__qty ${gramsLow ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}>
							{totalGrams}g
						</span>
					)}
				</td>
				<td className='stock-cell--actions'>
					{editPresId === pres._id ? (
						<div className='stock-page__edit-panel'>
							<div className='stock-page__edit-field'>
								<span className='stock-page__edit-label'>Unidades</span>
								<input
									className='field-input field-input--xs'
									type='number'
									value={editStock}
									onChange={(e) => setEditStock(e.target.value)}
								/>
							</div>
							{isFraction && (
								<div className='stock-page__edit-field'>
									<span className='stock-page__edit-label'>Gramos</span>
									<input
										className='field-input field-input--xs'
										type='number'
										value={editGrams}
										onChange={(e) => setEditGrams(e.target.value)}
									/>
								</div>
							)}
							<div className='stock-page__edit-actions'>
								<button className='sidebar__btn sidebar__btn--xs' onClick={handleUpdate}>OK</button>
								<button className='sidebar__btn sidebar__btn--xs' onClick={() => setEditPresId(null)}>X</button>
							</div>
						</div>
					) : (
						<div className='stock-page__edit'>
							<button
								className='sidebar__btn sidebar__btn--xs'
								onClick={() => {
									setEditPresId(pres._id)
									setEditStock(String(presStock))
									setEditGrams(String(totalGrams))
								}}
							>
								Ajustar
							</button>
							{shift && shift.status === 'open' && (
								<button
									className='shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm'
									onClick={() =>
										setSalePresId(salePresId === pres._id ? null : pres._id)
									}
								>
									Vender
								</button>
							)}
						</div>
					)}
					{salePresId === pres._id && (
						<SaleForm
							presentation={pres}
							product={product}
							onSubmit={handleSale}
							onCancel={() => setSalePresId(null)}
						/>
					)}
				</td>
			</tr>
		</>
	)
}
