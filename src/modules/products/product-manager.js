import { useReducer, useMemo, useCallback } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { useShift } from '../../context/ShiftContext.jsx'
import * as api from '../../data/api.js'

/** @import { useProductManager } from './product-manager' */

const INITIAL = {
  selectedCategoryIds: [],
  selectedProductId: null,
  searchTerm: '',
  showProductForm: false,
  editingProduct: null,
  showPresForm: false,
  editingPres: null,
  showPresentationsModal: false,
  salePresId: null,
  stockEdit: null,
  stockValue: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_CATEGORIES':
      return { ...state, selectedCategoryIds: action.ids }
    case 'SELECT_PRODUCT':
      return { ...state, selectedProductId: action.id }
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.term }
    case 'OPEN_PRODUCT_FORM':
      return { ...state, showProductForm: true }
    case 'CLOSE_PRODUCT_FORM':
      return { ...state, showProductForm: false }
    case 'OPEN_EDIT_PRODUCT':
      return { ...state, editingProduct: action.product }
    case 'CLOSE_EDIT_PRODUCT':
      return { ...state, editingProduct: null }
    case 'OPEN_PRES_FORM':
      return { ...state, showPresForm: true, showPresentationsModal: false }
    case 'CLOSE_PRES_FORM':
      return { ...state, showPresForm: false }
    case 'OPEN_EDIT_PRES':
      return { ...state, editingPres: action.pres }
    case 'CLOSE_EDIT_PRES':
      return { ...state, editingPres: null }
    case 'OPEN_PRESENTATIONS_MODAL':
      return { ...state, showPresentationsModal: true }
    case 'CLOSE_PRESENTATIONS_MODAL':
      return { ...state, showPresentationsModal: false }
    case 'START_SALE':
      return { ...state, salePresId: action.presId }
    case 'CANCEL_SALE':
      return { ...state, salePresId: null }
    case 'START_STOCK_EDIT':
      return { ...state, stockEdit: action.presId, stockValue: String(action.currentStock ?? 0) }
    case 'CANCEL_STOCK_EDIT':
      return { ...state, stockEdit: null, stockValue: '' }
    case 'SET_STOCK_VALUE':
      return { ...state, stockValue: action.value }
    default:
      return state
  }
}

/**
 * Encapsulates all state and CRUD logic for the products page.
 * Uses useReducer for UI state management and async handlers for API calls.
 */
export function useProductManager() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { categories, products, presentations, online, setProducts, setPresentations } = useData()
  const { shift, addSale } = useShift()

  // ── Derived data ────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let result = products
    if (state.selectedCategoryIds.length > 0) {
      result = result.filter((p) => state.selectedCategoryIds.includes(p.categoryId))
    }
    if (state.searchTerm.trim()) {
      const term = state.searchTerm.trim().toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(term))
    }
    return result
  }, [products, state.selectedCategoryIds, state.searchTerm])

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === state.selectedProductId) ?? null,
    [products, state.selectedProductId],
  )

  const productPresentations = useMemo(
    () => presentations.filter((p) => p.productId === selectedProduct?._id),
    [presentations, selectedProduct],
  )

  // ── UI actions ──────────────────────────────────────────

  const handleSelectCategories = useCallback((ids) => {
    dispatch({ type: 'SELECT_CATEGORIES', ids })
  }, [])

  const handleSelectProduct = useCallback((id) => {
    dispatch({ type: 'SELECT_PRODUCT', id })
  }, [])

  const handleSearch = useCallback((term) => {
    dispatch({ type: 'SET_SEARCH', term })
  }, [])

  const openProductForm = useCallback(() => dispatch({ type: 'OPEN_PRODUCT_FORM' }), [])
  const closeProductForm = useCallback(() => dispatch({ type: 'CLOSE_PRODUCT_FORM' }), [])
  const openEditProduct = useCallback((product) => dispatch({ type: 'OPEN_EDIT_PRODUCT', product }), [])
  const closeEditProduct = useCallback(() => dispatch({ type: 'CLOSE_EDIT_PRODUCT' }), [])

  const openPresForm = useCallback(() => dispatch({ type: 'OPEN_PRES_FORM' }), [])
  const closePresForm = useCallback(() => dispatch({ type: 'CLOSE_PRES_FORM' }), [])
  const openEditPres = useCallback((pres) => dispatch({ type: 'OPEN_EDIT_PRES', pres }), [])
  const closeEditPres = useCallback(() => dispatch({ type: 'CLOSE_EDIT_PRES' }), [])

  const openPresentationsModal = useCallback(
    () => dispatch({ type: 'OPEN_PRESENTATIONS_MODAL' }),
    [],
  )
  const closePresentationsModal = useCallback(
    () => dispatch({ type: 'CLOSE_PRESENTATIONS_MODAL' }),
    [],
  )

  const startSale = useCallback(
    (presId) => dispatch({ type: 'START_SALE', presId }),
    [],
  )
  const cancelSale = useCallback(() => dispatch({ type: 'CANCEL_SALE' }), [])

  const startStockEdit = useCallback(
    (presId, currentStock) => dispatch({ type: 'START_STOCK_EDIT', presId, currentStock }),
    [],
  )
  const cancelStockEdit = useCallback(() => dispatch({ type: 'CANCEL_STOCK_EDIT' }), [])

  const changeStockValue = useCallback(
    (value) => dispatch({ type: 'SET_STOCK_VALUE', value }),
    [],
  )

  // ── Product CRUD ────────────────────────────────────────

  const createProduct = useCallback(async (data) => {
    try {
      if (online) {
        const created = await api.createProduct(data)
        setProducts((prev) => [...prev, created])
      } else {
        const { createProduct: makeProd } = await import('../../data/entities.js')
        setProducts((prev) => [...prev, makeProd(data)])
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_PRODUCT_FORM' })
  }, [online, setProducts])

  const editProduct = useCallback(async (data) => {
    const id = state.editingProduct?._id
    if (!id) return
    try {
      if (online) {
        const updated = await api.updateProduct(id, data)
        setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      } else {
        setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_EDIT_PRODUCT' })
  }, [online, state.editingProduct, setProducts])

  const deleteProduct = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
    try {
      if (online) await api.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setPresentations((prev) => prev.filter((p) => p.productId !== id))
      if (state.selectedProductId === id) dispatch({ type: 'SELECT_PRODUCT', id: null })
    } catch (e) {
      console.error(e)
    }
  }, [online, state.selectedProductId, setProducts, setPresentations])

  // ── Presentation CRUD ───────────────────────────────────

  const createPres = useCallback(async (data) => {
    if (!selectedProduct) return
    try {
      const payload = { productId: selectedProduct._id, ...data }
      if (online) {
        const created = await api.createPresentation(payload)
        setPresentations((prev) => [...prev, created])
      } else {
        const { createPresentation: makePres } = await import('../../data/entities.js')
        setPresentations((prev) => [...prev, makePres(payload)])
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_PRES_FORM' })
  }, [online, selectedProduct, setPresentations])

  const editPres = useCallback(async (data) => {
    const id = state.editingPres?._id
    if (!id) return
    try {
      if (online) {
        const updated = await api.updatePresentation(id, data)
        setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      } else {
        setPresentations((prev) => prev.map((p) => (p._id === id ? { ...p, ...data } : p)))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_EDIT_PRES' })
  }, [online, state.editingPres, setPresentations])

  const deletePres = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar esta presentación?')) return
    try {
      if (online) await api.deletePresentation(id)
      setPresentations((prev) => prev.filter((p) => p._id !== id))
    } catch (e) {
      console.error(e)
    }
  }, [online, setPresentations])

  // ── Stock & Sale ────────────────────────────────────────

  const updateStock = useCallback(async (presId) => {
    const val = parseInt(state.stockValue, 10)
    if (isNaN(val) || val < 0) return
    try {
      if (online) {
        const updated = await api.updateStock(presId, val)
        setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      } else {
        setPresentations((prev) => prev.map((p) => (p._id === presId ? { ...p, stock: val } : p)))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CANCEL_STOCK_EDIT' })
  }, [online, state.stockValue, setPresentations])

  const handleSale = useCallback(async (sale) => {
    await addSale(sale)
    setPresentations((prev) =>
      prev.map((p) =>
        p._id === sale.presentationId
          ? { ...p, stock: p.stock - sale.quantity }
          : p,
      ),
    )
    dispatch({ type: 'CANCEL_SALE' })
  }, [addSale, setPresentations])

  return {
    categories, products, presentations, online,
    filteredProducts, selectedProduct, productPresentations,
    shift,
    ...state,
    handleSelectCategories,
    handleSelectProduct,
    handleSearch,
    openProductForm, closeProductForm,
    openEditProduct, closeEditProduct,
    openPresForm, closePresForm,
    openEditPres, closeEditPres,
    openPresentationsModal, closePresentationsModal,
    startSale, cancelSale,
    startStockEdit, cancelStockEdit, changeStockValue,
    createProduct, editProduct, deleteProduct,
    createPres, editPres, deletePres,
    updateStock, handleSale,
  }
}
