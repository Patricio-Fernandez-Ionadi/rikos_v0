import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../app/catalog-context.jsx'
import { useStockManager } from '../modules/stock/stock-manager.js'
import { StockFilterBar } from '../modules/stock/stock-filter-bar.jsx'
import { StockRow } from '../modules/stock/stock-row.jsx'
import { ProductSearch } from '../components/product-search.jsx'
import { DataTable } from '../components/data-table.jsx'

const StockContent = ({ filteredProducts, navigate }) => {
	const productIds = useMemo(
		() =>
			filteredProducts.length
				? new Set(filteredProducts.map((p) => p._id))
				: null,
		[filteredProducts],
	)

	const {
		filter,
		setFilter,
		customType,
		setCustomType,
		customValue,
		setCustomValue,
		filterDesc,
		items,
	} = useStockManager(productIds)

	return (
		<>
			<StockFilterBar
				filter={filter}
				onChange={setFilter}
				customType={customType}
				onCustomTypeChange={setCustomType}
				customValue={customValue}
				onCustomValueChange={setCustomValue}
			/>

			<DataTable
				variant='stock-page'
				columns={[
					{
						key: 'product',
						label: 'Producto',
						className: 'stock-cell--product',
					},
					{ key: 'stock', label: 'Stock', className: 'stock-cell--stock' },
					{ key: 'grams', label: 'Gramos', className: 'stock-cell--grams' },
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
		</>
	)
}

export const StockPage = () => {
	const navigate = useNavigate()
	const {
		products,
		presentations,
		categories,
		allTags,
		suppliers,
		productSuppliers,
	} = useCatalog()

	return (
		<div className='stock-page'>
			<h2 className='stock-page__title'>Stock</h2>

			<ProductSearch
				products={products}
				presentations={presentations}
				categories={categories}
				allTags={allTags}
				suppliers={suppliers}
				productSuppliers={productSuppliers}
				compact
				showTags={false}
				placeholder='Buscar producto, marca o presentación…'
			>
				{({ filteredProducts }) => (
					<StockContent
						filteredProducts={filteredProducts}
						navigate={navigate}
					/>
				)}
			</ProductSearch>
		</div>
	)
}
