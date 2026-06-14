import { useNavigate } from 'react-router-dom'
import { useStockManager } from '../modules/stock/stock-manager.js'
import { StockFilterBar } from '../modules/stock/stock-filter-bar.jsx'
import { StockRow } from '../modules/stock/stock-row.jsx'
import { SearchInput } from '../components/search-input.jsx'
import { DataTable } from '../components/data-table.jsx'

export const StockPage = () => {
  const navigate = useNavigate()
  const {
    filter, setFilter,
    customType, setCustomType, customValue, setCustomValue,
    searchTerm, setSearchTerm,
    filterDesc, items,
  } = useStockManager()

  return (
    <div className='stock-page'>
      <h2 className='stock-page__title'>Stock</h2>

      <StockFilterBar
        filter={filter} onChange={setFilter}
        customType={customType} onCustomTypeChange={setCustomType}
        customValue={customValue} onCustomValueChange={setCustomValue}
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
            pres={pres} product={product}
            onNavigate={() => navigate(`/products/${product._id}`)}
          />
        )}
      />
    </div>
  )
}
