import { useCatalog } from '../../app/catalog-context.jsx'
import { InlineEdit } from '../../components/inline-edit.jsx'
import * as stockService from './services/stock-services.js'

export const StockRow = ({ pres, product, onNavigate }) => {
	const { setPresentations, setProducts } = useCatalog()

	const isFraction = product?.saleType === 'fraction'
	const presStock = pres.stock ?? 0
	const totalGrams = product.stockGrams ?? 0
	const stockLow = presStock <= 5
	const gramsLow = isFraction && totalGrams <= 100

	const handleStockChange = async (newStock) => {
		try {
			const updated = await stockService.updateStock(pres._id, newStock)
			setPresentations((prev) =>
				prev.map((p) => (p._id === updated._id ? updated : p)),
			)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGramsChange = async (newGrams) => {
		try {
			const updatedProduct = await stockService.updateStockGrams(product._id, newGrams)
			setProducts((prev) =>
				prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
			)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<tr key={pres._id}>
			<td className='stock-cell--product'>
				<button className='stock-cell__link' onClick={onNavigate}>
					<span className='stock-cell__product-name'>{product.name}</span>
					{pres.label || pres.grams ? (
						<span className='stock-cell__pres-info'>
							{pres.label ? pres.label : ''}
							{pres.label && pres.grams ? ' · ' : ''}
							{pres.grams ? `${pres.grams}g` : ''}
						</span>
					) : null}
				</button>
			</td>
			<td className='stock-cell--stock'>
				<span className={`stock-page__qty ${stockLow ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}>
					<InlineEdit
						value={presStock}
						onSave={handleStockChange}
						suffix='u'
						simple
					/>
				</span>
			</td>
			<td className='stock-cell--grams'>
				{isFraction ? (
					<span className={`stock-page__qty ${gramsLow ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}>
						<InlineEdit
							value={totalGrams}
							onSave={handleGramsChange}
							suffix='g'
							simple
						/>
					</span>
				) : (
					<span className='stock-page__qty stock-page__qty--ok'>—</span>
				)}
			</td>
		</tr>
	)
}