import { useState } from 'react'
import { useData } from '../context/DataContext.jsx'
import * as api from '../data/api.js'
import { useShift } from '../context/ShiftContext.jsx'
import { SaleForm } from '../components/SaleForm.jsx'

/**
 * Stock overview page.
 * Lists all presentations with their current stock, grouped by product.
 * Supports inline stock adjustment and sale recording during an active shift.
 */
export const StockPage = () => {
  const { categories, products, presentations, online, setPresentations } = useData()
  const { shift, addSale } = useShift()
  const [stockEdit, setStockEdit] = useState(null)
  const [stockValue, setStockValue] = useState('')
  const [salePresId, setSalePresId] = useState(null)
  const [filter, setFilter] = useState('all')

  const filtered = presentations.filter((p) => {
    if (filter === 'stocked') return (p.stock ?? 0) > 0
    if (filter === 'low') return (p.stock ?? 0) > 0 && p.stock <= 5
    if (filter === 'empty') return !p.stock || p.stock <= 0
    return true
  })

  const handleStockUpdate = async (presId) => {
    const val = parseInt(stockValue)
    if (isNaN(val) || val < 0) return
    try {
      if (online) {
        const updated = await api.updateStock(presId, val)
        setPresentations((prev) => prev.map((p) => p._id === updated._id ? updated : p))
      } else {
        setPresentations((prev) => prev.map((p) => p._id === presId ? { ...p, stock: val } : p))
      }
    } catch (e) { console.error(e) }
    setStockEdit(null)
  }

  const handleSale = async (sale) => {
    await addSale(sale)
    setPresentations((prev) => prev.map((p) =>
      p._id === sale.presentationId ? { ...p, stock: p.stock - sale.quantity } : p,
    ))
    setSalePresId(null)
  }

  const getProduct = (id) => products.find((p) => p._id === id)
  const getCategory = (id) => categories.find((c) => c._id === id)

  const items = filtered
    .map((p) => ({ pres: p, product: getProduct(p.productId) }))
    .filter((x) => x.product)
    .sort((a, b) => (a.product.name ?? '').localeCompare(b.product.name ?? ''))

  return (
    <div className="stock-page">
      <h2 className="stock-page__title">Stock</h2>

      <div className="stock-page__toolbar">
        <span style={{ color: '#8e8e8e', fontSize: '0.85em' }}>Filtrar:</span>
        {['all', 'stocked', 'low', 'empty'].map((f) => (
          <button
            key={f}
            className={'sidebar__btn' + (filter === f ? ' sidebar__btn--active' : '')}
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8em' }}
            onClick={() => setFilter(f)}
          >
            {{ all: 'Todos', stocked: 'Con stock', low: 'Stock bajo', empty: 'Sin stock' }[f]}
          </button>
        ))}
      </div>

      <table className="stock-page__table">
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
            <tr key={pres._id}>
              <td style={{ color: '#f5f5f5' }}>{product.name}</td>
              <td>{getCategory(product.categoryId)?.name ?? '—'}</td>
              <td>{pres.label ?? '—'}</td>
              <td>
                <span className={`stock-page__qty ${(pres.stock ?? 0) <= 5 ? 'stock-page__qty--low' : 'stock-page__qty--ok'}`}>
                  {pres.stock ?? 0}
                </span>
              </td>
              <td>
                <div className="stock-page__edit">
                  {stockEdit === pres._id ? (
                    <>
                      <input
                        className="field-input field-input--xs"
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                      />
                      <button className="sidebar__btn sidebar__btn--xs" onClick={() => handleStockUpdate(pres._id)}>OK</button>
                      <button className="sidebar__btn sidebar__btn--xs" onClick={() => setStockEdit(null)}>X</button>
                    </>
                  ) : (
                    <>
                      <button className="sidebar__btn sidebar__btn--xs" onClick={() => { setStockEdit(pres._id); setStockValue(String(pres.stock ?? 0)) }}>
                        Ajustar
                      </button>
                      {shift && shift.status === 'open' && (
                        <button
                          className="shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm"
                          onClick={() => setSalePresId(salePresId === pres._id ? null : pres._id)}
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
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <p className="placeholder" style={{ textAlign: 'center', padding: '40px', color: '#616161' }}>
          No hay presentaciones que coincidan con el filtro
        </p>
      )}
    </div>
  )
}
