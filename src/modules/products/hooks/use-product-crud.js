import { useCallback } from 'react'
import * as productService from '../services/product-services.js'
import * as presService from '../product/services/presentation-services.js'
import * as supplierService from '../../suppliers/services/supplier-services.js'

export function useProductCrud({ selectedProduct, editingProduct, setProducts, setPresentations, dispatch }) {
  const createProductFn = useCallback(async (data) => {
    const { supplierId, ...productData } = data
    try {
      const created = await productService.createProduct(productData)
      setProducts((prev) => [...prev, created])
      if (supplierId) {
        await supplierService.createProductSupplier({
          productId: created._id, supplierId, purchaseCost: productData.purchaseCost,
        })
      }
      dispatch({ type: 'CLOSE_PRODUCT_FORM' })
      return created
    } catch (e) {
      console.error(e)
    }
  }, [setProducts, dispatch])

  const editProductFn = useCallback(async (data) => {
    const { supplierId, ...productData } = data
    const id = editingProduct?._id
    if (!id) return
    try {
      const updated = await productService.updateProduct(id, productData)
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      if (supplierId) {
        await supplierService.createProductSupplier({
          productId: id, supplierId, purchaseCost: productData.purchaseCost,
        })
      }
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_EDIT_PRODUCT' })
  }, [editingProduct, setProducts, dispatch])

  const deleteProductFn = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setPresentations((prev) => prev.filter((p) => p.productId !== id))
      dispatch({ type: 'SELECT_PRODUCT', id: null })
    } catch (e) {
      console.error(e)
    }
  }, [setProducts, setPresentations, dispatch])

  const createPresFn = useCallback(async (data) => {
    if (!selectedProduct) return
    try {
      const payload = { productId: selectedProduct._id, ...data }
      const created = await presService.createPresentation(payload)
      setPresentations((prev) => [...prev, created])
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_PRES_FORM' })
  }, [selectedProduct, setPresentations, dispatch])

  const editPresFn = useCallback(async (data) => {
    const id = data._id
    if (!id) return
    try {
      const updated = await presService.updatePresentation(id, data)
      setPresentations((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
    } catch (e) {
      console.error(e)
    }
    dispatch({ type: 'CLOSE_EDIT_PRES' })
  }, [setPresentations, dispatch])

  const deletePresFn = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar esta presentación?')) return
    try {
      await presService.deletePresentation(id)
      setPresentations((prev) => prev.filter((p) => p._id !== id))
    } catch (e) {
      console.error(e)
    }
  }, [setPresentations])

  return { createProductFn, editProductFn, deleteProductFn, createPresFn, editPresFn, deletePresFn }
}
