import { useState } from 'react'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { SaleForm } from '../../components/sale-form.jsx'
import * as stockService from './services/stock-services.js'

export const StockRow = ({ pres, product, categoryName }) => {
	const { online, setPresentations, setProducts } = useData()
	const { shift, addSale } = useShift()

	const isFraction = product?.saleType === 'fraction'

	const [stockEdit, setStockEdit] = useState(null)
	const [stockValue, setStockValue] = useState('')
	const [salePresId, setSalePresId] = useState(null)

	const handleStockUpdate = async (presId) => {
		const val = parseInt(stockValue)
		if (isNaN(val) || val < 0) return
		try {
			const updated = await stockService.updateStock(presId, val, { online })
			if (updated) {
				setPresentations((prev) =>
					prev.map((p) => (p._id === updated._id ? updated : p)),
				)
			} else {
				setPresentations((prev) =>
					prev.map((p) => (p._id === presId ? { ...p, stock: val } : p)),
				)
			}
		} catch (e) {
			console.error(e)
		}
		setStockEdit(null)
	}

	const handleStockGramsUpdate = async (productId) => {
		const val = parseInt(stockValue)
		if (isNaN(val) || val < 0) return
		try {
			const updated = await stockService.updateStockGrams(productId, val, { online })
			if (updated) {
				setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
			} else {
				setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, stockGrams: val } : p)))
			}
		} catch (e) {
			console.error(e)
		}
		setStockEdit(null)
	}

	const handleSale = async (sale) => {
		await addSale(sale)
		if (isFraction) {
			const deduction = sale.quantity * (pres.grams ?? 0)
			setProducts((prev) =>
				prev.map((p) =>
					p._id === product._id
						? { ...p, stockGrams: Math.max(0, (p.stockGrams ?? 0) - deduction) }
						: p,
				),
			)
		} else {
			setPresentations((prev) =>
				prev.map((p) =>
					p._id === sale.presentationId
						? { ...p, stock: Math.max(0, (p.stock ?? 0) - sale.quantity) }
						: p,
				),
			)
		}
		setSalePresId(null)
	}

	const stockDisplay = isFraction ? (product.stockGrams ?? 0) : (pres.stock ?? 0)
	const stockLabel = isFraction ? `${stockDisplay}g` : stockDisplay
	const stockLow = !isFraction && (pres.stock ?? 0) <= 5
	const stockLowFraction = isFraction && (product.stockGrams ?? 0) <= 100

	return (
		<>
			<tr key={pres._id}>
				<td style={{ color: '#f5f5f5' }}>{product.name}</td>
				<td>{categoryName}</td>
				<td>{pres.label ?? '—'} {isFraction && pres.grams ? `(${pres.grams}g)` : ''}</td>
				<td>
					<span
						className={`stock-page__qty ${stockLow || stockLowFraction ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}
					>
						{stockLabel}
					</span>
				</td>
				<td>
					<div className='stock-page__edit'>
						{stockEdit === (isFraction ? product._id : pres._id) ? (
							<>
								<input
									className='field-input field-input--xs'
									type='number'
									value={stockValue}
									onChange={(e) => setStockValue(e.target.value)}
								/>
								<button
									className='sidebar__btn sidebar__btn--xs'
									onClick={() => isFraction
										? handleStockGramsUpdate(product._id)
										: handleStockUpdate(pres._id)
									}
								>
									OK
								</button>
								<button
									className='sidebar__btn sidebar__btn--xs'
									onClick={() => setStockEdit(null)}
								>
									X
								</button>
							</>
						) : (
							<>
								<button
									className='sidebar__btn sidebar__btn--xs'
									onClick={() => {
										setStockEdit(isFraction ? product._id : pres._id)
										setStockValue(String(stockDisplay))
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
							</>
						)}
					</div>
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
