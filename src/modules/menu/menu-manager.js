import { useState, useMemo } from 'react'
import { useCatalog } from '../../app/catalog-context.jsx'

export function useMenuManager() {
  const { categories, products, presentations } = useCatalog()

  const [title, setTitle] = useState('Menú')
  const [showPrices, setShowPrices] = useState(true)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const allItems = useMemo(() => {
    return products.flatMap((prod) => {
      const preses = presentations
        .filter((p) => p.productId === prod._id && p.salePrice != null)
        .sort((a, b) => (a.grams ?? 0) - (b.grams ?? 0))
      return preses.map((pres) => ({
        _id: pres._id,
        productId: prod._id,
        categoryId: prod.categoryId,
        productName: prod.name,
        marca: prod.marca,
        label: pres.label,
        price: pres.salePrice ?? 0,
        code: pres.code,
      }))
    })
  }, [products, presentations])

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase()
    return allItems.filter((item) => {
      if (item.productName.toLowerCase().includes(term)) return true
      if (item.marca?.toLowerCase().includes(term)) return true
      if (item.label?.toLowerCase().includes(term)) return true
      if (item.code != null && String(item.code).includes(term)) return true
      return false
    }).slice(0, 30)
  }, [allItems, searchTerm])

  const menuData = useMemo(() => {
    const byCat = {}
    for (const item of allItems) {
      if (!selectedIds.has(item._id)) continue
      const cat = categories.find((c) => c._id === item.categoryId)
      const catName = cat?.name ?? 'Sin categoría'
      if (!byCat[catName]) byCat[catName] = []
      byCat[catName].push(item)
    }
    return Object.entries(byCat).map(([categoryName, items]) => ({ categoryName, items }))
  }, [allItems, selectedIds, categories])

  const togglePres = (presId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(presId)) next.delete(presId)
      else next.add(presId)
      return next
    })
  }

  const addCategory = (catId) => {
    const catPresIds = allItems.filter((i) => i.categoryId === catId).map((i) => i._id)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const id of catPresIds) next.add(id)
      return next
    })
  }

  const removeCategory = (catId) => {
    const catPresIds = allItems.filter((i) => i.categoryId === catId).map((i) => i._id)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const id of catPresIds) next.delete(id)
      return next
    })
  }

  const addAllResults = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const item of searchResults) next.add(item._id)
      return next
    })
  }

  const clearAll = () => setSelectedIds(new Set())

  return {
    title, setTitle, showPrices, setShowPrices,
    searchTerm, setSearchTerm, searchResults,
    selectedIds, menuData, categories,
    togglePres, addCategory, removeCategory, addAllResults, clearAll,
  }
}
