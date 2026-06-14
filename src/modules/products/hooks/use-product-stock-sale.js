import { useCallback } from 'react'
import * as stockService from '../../stock/services/stock-services.js'

import { applyStockDeduction } from '../../../data/stock-utils.js'

export function useProductStockSale({ presentations, products, setPresentations, setProducts, addSale, stockValue, dispatch }) {
  const updateStockFn = useCallback(async (presId) => {
    const val = parseInt(stockValue, 10)
    if (isNaN(val) || val < 0) return
    try {
      const pres = presentations.find((p) => p._id === presId)
      if (!pres) return
      const product = products.find((p) => p._id === pres.productId)
      const isFraction = product?.saleType === 'fraction'

      const updated = await stockService.updateStock(presId, val)
      setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))

      if (isFraction && pres.grams) {
        const delta = val - (pres.stock ?? 0)
        if (delta !== 0) {
          const gramsDelta = delta * pres.grams
          const updatedProduct = await stockService.updateStockGrams(product._id, (product.stockGrams ?? 0) - gramsDelta)
          setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
        }
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CANCEL_STOCK_EDIT' })
  }, [stockValue, setPresentations, setProducts, presentations, products, dispatch])

  const updateStockGramsFn = useCallback(async (productId, stockGrams) => {
    try {
      const updated = await stockService.updateStockGrams(productId, stockGrams)
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
    } catch (e) {
      console.error(e)
    }
  }, [setProducts])

  const handleSaleFn = useCallback(async (sale) => {
    await addSale(sale)
    const result = applyStockDeduction(presentations, products, sale)
    setPresentations(result.presentations)
    setProducts(result.products)
    dispatch({ type: 'CANCEL_SALE' })
  }, [addSale, presentations, products, setProducts, setPresentations, dispatch])

  return { updateStockFn, updateStockGramsFn, handleSaleFn }
}
