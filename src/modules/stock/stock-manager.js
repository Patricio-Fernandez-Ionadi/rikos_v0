import { useState, useMemo, useCallback } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'

export const FILTER_LABELS = {
  all: 'Todos',
  stocked: 'Con stock',
  low: 'Stock bajo (≤5)',
  empty: 'Sin stock',
}

export function useStockManager(productIds) {
  const { products, presentations } = useCatalog()
  const [filter, setFilter] = useState('all')
  const [customType, setCustomType] = useState('lt')
  const [customValue, setCustomValue] = useState(5)

  const getProduct = useCallback(
    (id) => products.find((p) => p._id === id),
    [products]
  )

  const filterDesc = useMemo(() => {
    if (filter === 'custom') return `Stock ${customType === 'lt' ? '≤' : '≥'} ${customValue}`
    return FILTER_LABELS[filter] || filter
  }, [filter, customType, customValue])

  const items = useMemo(() => {
    let result = presentations

    if (productIds) {
      result = result.filter((p) => productIds.has(p.productId))
    }

    result = result.filter((p) => {
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

    return result
      .map((p) => ({ pres: p, product: getProduct(p.productId) }))
      .filter((x) => x.product)
      .sort((a, b) => (a.product.name ?? '').localeCompare(b.product.name ?? ''))
  }, [productIds, presentations, filter, customType, customValue, getProduct])

  return {
    filter, setFilter,
    customType, setCustomType, customValue, setCustomValue,
    filterDesc, items,
  }
}
