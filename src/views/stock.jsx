import { useState } from 'react'
import { useData } from '../app/data-context.jsx'
import { StockFilterBar } from '../modules/stock/stock-filter-bar.jsx'
import { StockRow } from '../modules/stock/stock-row.jsx'

/**
 * Stock overview page.
 * Lists all presentations with their current stock, grouped by product.
 */
export const StockPage = () => {
	const { categories, products, presentations } = useData()
	const [filter, setFilter] = useState('all')

	const filtered = presentations.filter((p) => {
		if (filter === 'stocked') return (p.stock ?? 0) > 0
		if (filter === 'low') return (p.stock ?? 0) > 0 && p.stock <= 5
		if (filter === 'empty') return !p.stock || p.stock <= 0
		return true
	})

	const getCategory = (id) => categories.find((c) => c._id === id)
	const getProduct = (id) => products.find((p) => p._id === id)

	const items = filtered
		.map((p) => ({ pres: p, product: getProduct(p.productId) }))
		.filter((x) => x.product)
		.sort((a, b) => (a.product.name ?? '').localeCompare(b.product.name ?? ''))

	return (
		<div className='stock-page'>
			<h2 className='stock-page__title'>Stock</h2>

			<StockFilterBar filter={filter} onChange={setFilter} />

			<div className='stock-page__table-wrap'>
				<table className='stock-page__table'>
					<thead>
						<tr>
							<th>Producto</th>
							<th>Categoría</th>
							<th>Presentación</th>
							<th>Stock</th>
							<th>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{items.map(({ pres, product }) => (
							<StockRow
								key={pres._id}
								pres={pres}
								product={product}
								categoryName={
									getCategory(product.categoryId)?.name ?? '—'
								}
							/>
						))}
					</tbody>
				</table>
			</div>

			{items.length === 0 && (
				<p
					className='placeholder'
					style={{
						textAlign: 'center',
						padding: '40px',
						color: '#616161',
					}}
				>
					No hay presentaciones que coincidan con el filtro
				</p>
			)}
		</div>
	)
}
