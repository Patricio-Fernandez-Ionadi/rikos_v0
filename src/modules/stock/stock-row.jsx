import { useState } from 'react'
import { useData } from '../../app/data-context.jsx'
import { useShift } from '../../modules/shift/shift-context.jsx'
import { SaleForm } from '../../components/SaleForm.jsx'
import * as stockService from './services/stock-services.js'

export const StockRow = ({ pres, product, categoryName }) => {
	const { online, setPresentations } = useData()
	const { shift, addSale } = useShift()

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
					prev.map((p) =>
						p._id === presId ? { ...p, stock: val } : p,
					),
				)
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
					? { ...p, stock: p.stock - sale.quantity }
					: p,
			),
		)
		setSalePresId(null)
	}

	return (
		<>
			<tr key={pres._id}>
				<td style={{ color: '#f5f5f5' }}>{product.name}</td>
				<td>{categoryName}</td>
				<td>{pres.label ?? '—'}</td>
				<td>
					<span
						className={`stock-page__qty ${(pres.stock ?? 0) <= 5 ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}
					>
						{pres.stock ?? 0}
					</span>
				</td>
				<td>
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
										setStockValue(String(pres.stock ?? 0))
									}}
								>
									Ajustar
								</button>
								{shift && shift.status === 'open' && (
									<button
										className='shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm'
										onClick={() =>
											setSalePresId(
												salePresId === pres._id
													? null
													: pres._id,
											)
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
							onSubmit={handleSale}
							onCancel={() => setSalePresId(null)}
						/>
					)}
				</td>
			</tr>
		</>
	)
}
