import { useCallback } from 'react'
import * as supplierService from '../../../suppliers/services/supplier-services.js'
import * as productService from '../../services/product-services.js'


export function useSupplierActions({
  product,
  setProductSuppliers,
  setProducts,
}) {
  const handleAddSupplier = useCallback(
    async (supplierId, purchaseCost) => {
      if (!product) return
      try {
        const ps = await supplierService.createProductSupplier({
          productId: product._id,
          supplierId,
          purchaseCost,
        })
        setProductSuppliers((prev) => [...prev, ps])
      } catch (e) {
        console.error(e)
      }
    },
    [product, setProductSuppliers],
  )

  const handleRemoveSupplier = useCallback(
    async (psId) => {
      try {
        await supplierService.deleteProductSupplier(psId)
        setProductSuppliers((prev) => prev.filter((ps) => ps._id !== psId))
      } catch (e) {
        console.error(e)
      }
    },
    [setProductSuppliers],
  )

  const handleUseSupplierCost = useCallback(
    async (cost) => {
      if (!product) return
      try {
        const updated = await productService.updateProduct(product._id, {
          categoryId: product.categoryId,
          name: product.name,
          purchaseCost: cost,
          saleType: product.saleType,
          stockGrams: product.stockGrams,
        })
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p)),
        )
      } catch (e) {
        console.error(e)
      }
    },
    [product, setProducts],
  )

  return { handleAddSupplier, handleRemoveSupplier, handleUseSupplierCost }
}
