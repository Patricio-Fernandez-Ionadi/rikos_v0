import { useState } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { SaleForm } from '../../components/sale-form.jsx'
import { Button } from '../../components/button.jsx'
import * as stockService from './services/stock-services.js'
import { applyStockDeduction } from '../../data/stock-utils.js'

export const StockRow = ({ pres, product, onNavigate }) => {
	const { presentations, products, setPresentations, setProducts } = useCatalog()
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
		const result = applyStockDeduction(presentations, products, sale)
		setPresentations(result.presentations)
		setProducts(result.products)
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
								<Button size='xs' onClick={handleUpdate}>OK</Button>
								<Button size='xs' onClick={() => setEditPresId(null)}>X</Button>
							</div>
						</div>
					) : (
						<div className='stock-page__edit'>
							<Button size='xs' onClick={() => {
								setEditPresId(pres._id)
								setEditStock(String(presStock))
								setEditGrams(String(totalGrams))
							}}>
								Ajustar
							</Button>
							{shift && shift.status === 'open' && (
								<Button size='sm' variant='primary' onClick={() =>
									setSalePresId(salePresId === pres._id ? null : pres._id)
								}>
									Vender
								</Button>
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
