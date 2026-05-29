import { useState } from 'react'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { SaleForm } from '../../components/sale-form.jsx'
import * as stockService from './services/stock-services.js'

export const StockRow = ({ pres, product, categoryName }) => {
	const { setPresentations, setProducts } = useData()
	const { shift, addSale } = useShift()

	const isFraction = product?.saleType === 'fraction'

	const [stockEdit, setStockEdit] = useState(null)
	const [stockValue, setStockValue] = useState('')
	const [salePresId, setSalePresId] = useState(null)

	const handleStockUpdate = async (presId) => {
		const val = parseInt(stockValue)
		if (isNaN(val) || val < 0) return
		try {
			const updated = await stockService.updateStock(presId, val)
			setPresentations((prev) =>
				prev.map((p) => (p._id === updated._id ? updated : p)),
			)
			if (isFraction && pres.grams) {
				const oldStock = pres.stock ?? 0
				const delta = val - oldStock
				if (delta !== 0) {
					const gramsDelta = delta * pres.grams
					const updatedProduct = await stockService.updateStockGrams(product._id, (product.stockGrams ?? 0) + gramsDelta)
					setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
				}
			}
		} catch (e) {
			console.error(e)
		}
		setStockEdit(null)
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
				<td className='stock-cell--product' style={{ color: '#f5f5f5' }}>{product.name}{product.marca ? <span className='stock-page__marca'> — {product.marca}</span> : ''}</td>
				<td className='stock-cell--category'>{categoryName}</td>
				<td className='stock-cell--pres'>{pres.label ?? '—'} {isFraction && pres.grams ? `(${pres.grams}g)` : ''}</td>
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
					<div className='stock-page__edit'>
						{stockEdit === pres._id ? (
							<>
								<input
									className='field-input field-input--xs'
									type='number'
									value={stockValue}
									onChange={(e) => setStockValue(e.target.value)}
								/>
								<button
									className='sidebar__btn sidebar__btn--xs'
									onClick={() => handleStockUpdate(pres._id)}
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
										setStockEdit(pres._id)
										setStockValue(String(presStock))
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
