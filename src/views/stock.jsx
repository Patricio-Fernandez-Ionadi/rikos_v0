import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../app/catalog-context.jsx'
import { StockFilterBar } from '../modules/stock/stock-filter-bar.jsx'
import { StockRow } from '../modules/stock/stock-row.jsx'
import { SearchInput } from '../components/search-input.jsx'
import { DataTable } from '../components/data-table.jsx'
import { EmptyState } from '../components/empty-state.jsx'

const FILTER_LABELS = {
	all: 'Todos',
	stocked: 'Con stock',
	low: 'Stock bajo (≤5)',
	empty: 'Sin stock',
}

export const StockPage = () => {
	const navigate = useNavigate()
	const { products, presentations } = useCatalog()
	const [filter, setFilter] = useState('all')
	const [customType, setCustomType] = useState('lt')
	const [customValue, setCustomValue] = useState(5)
	const [searchTerm, setSearchTerm] = useState('')

	const getProduct = (id) => products.find((p) => p._id === id)

	const filterDesc = useMemo(() => {
		if (filter === 'custom') {
			return `Stock ${customType === 'lt' ? '≤' : '≥'} ${customValue}`
		}
		return FILTER_LABELS[filter] || filter
	}, [filter, customType, customValue])

	const filtered = presentations.filter((p) => {
		const prod = getProduct(p.productId)
		if (!prod) return false
		const presStock = p.stock ?? 0
		const isFraction = prod.saleType === 'fraction'
		const totalGrams = prod.stockGrams ?? 0
		if (filter === 'all') return true
		if (filter === 'stocked') return presStock > 0 || (isFraction && totalGrams > 0)
		if (filter === 'low') return presStock > 0 && presStock <= 5
		if (filter === 'empty') return presStock <= 0 && (!isFraction || totalGrams <= 0)
		if (filter === 'custom') {
			const target = customType === 'lt' ? presStock : totalGrams
			if (customType === 'lt') return presStock > 0 && target <= customValue
			if (customType === 'gt') return target >= customValue
		}
		return true
	})

	const searched = searchTerm.trim()
		? filtered.filter((p) => {
			const prod = getProduct(p.productId)
			if (!prod) return false
			const q = searchTerm.toLowerCase()
			return prod.name.toLowerCase().includes(q) ||
				(prod.marca && prod.marca.toLowerCase().includes(q)) ||
				(p.label && p.label.toLowerCase().includes(q))
		})
		: filtered

	const items = searched
		.map((p) => ({ pres: p, product: getProduct(p.productId) }))
		.filter((x) => x.product)
		.sort((a, b) => (a.product.name ?? '').localeCompare(b.product.name ?? ''))

	return (
		<div className='stock-page'>
			<h2 className='stock-page__title'>Stock</h2>

			<StockFilterBar
				filter={filter}
				onChange={setFilter}
				customType={customType}
				onCustomTypeChange={setCustomType}
				customValue={customValue}
				onCustomValueChange={setCustomValue}
			/>

			<SearchInput
				placeholder='Buscar producto, marca o presentación…'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ marginBottom: 12 }}
			/>

			<DataTable
				variant='stock-page'
				columns={[
					{ key: 'product', label: 'Producto', className: 'stock-cell--product' },
					{ key: 'stock', label: 'Stock (unidades)', className: 'stock-cell--stock' },
					{ key: 'grams', label: 'Gramos totales', className: 'stock-cell--grams' },
					{ key: 'actions', label: 'Acciones', className: 'stock-cell--actions' },
				]}
				rows={items}
				emptyMessage={`No hay presentaciones con el filtro: ${filterDesc}`}
				renderRow={({ pres, product }) => (
					<StockRow
						pres={pres}
						product={product}
						onNavigate={() => navigate(`/products/${product._id}`)}
					/>
				)}
			/>
		</div>
	)
}
