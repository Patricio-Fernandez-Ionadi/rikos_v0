import { useCallback } from 'react'
import * as supplierService from '../../../suppliers/services/supplier-services.js'
import * as productService from '../../services/product-services.js'


export function useSupplierActions({
  product,
  setProductSuppliers,
  setProducts,
}) {
  const handleAddSupplier = useCallback(
    async (supplierId, purchaseCost, supplierUnitLabel, supplierUnitQty) => {
      if (!product) return
      try {
        const ps = await supplierService.createProductSupplier({
          productId: product._id,
          supplierId,
          purchaseCost,
          supplierUnitLabel: supplierUnitLabel ?? 'Unidad',
          supplierUnitQty: supplierUnitQty ?? 1,
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
    async (ps) => {
      if (!product || !ps) return
      const qty = ps.supplierUnitQty ?? 1
      const costPerUnit = +(ps.purchaseCost / qty).toFixed(2)
      try {
        const updated = await productService.updateProduct(product._id, {
          categoryId: product.categoryId,
          name: product.name,
          purchaseCost: costPerUnit,
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
