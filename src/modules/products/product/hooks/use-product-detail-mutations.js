import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as productService from '../../services/product-services.js'
import * as stockService from '../../../stock/services/stock-services.js'
import * as supplierService from '../../../suppliers/services/supplier-services.js'
import { applyStockDeduction } from '../../../../data/stock-utils.js'
import { useToast } from '../../../../components/Toast.jsx'

export function useProductDetailMutations({
  product,
  productSuppliers,
  activeSupplier,
  stockGramsValue,
  setProducts,
  setPresentations,
  setProductSuppliers,
  setEditProductOpen,
  setStockGramsEdit,
  setSalePresId,
  addSale,
  presentations,
  products: allProducts,
}) {
  const navigate = useNavigate()
  const showToast = useToast()

  const handleEditProduct = useCallback(
    async (data) => {
      if (!product) return
      const { supplierId, ...productData } = data
      try {
        const updated = await productService.updateProduct(product._id, productData)
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p)),
        )

        if (productData.purchaseCost != null && productData.purchaseCost !== product.purchaseCost) {
          const activePs = productSuppliers.find(
            (ps) => ps.supplierId === activeSupplier,
          )
          if (activePs) {
            const updatedPs = await supplierService.updateProductSupplier(
              activePs._id,
              { purchaseCost: productData.purchaseCost },
            )
            setProductSuppliers((prev) =>
              prev.map((ps) => (ps._id === updatedPs._id ? updatedPs : ps)),
            )
          }
        }

        if (supplierId) {
          await supplierService.createProductSupplier({
            productId: product._id,
            supplierId,
            purchaseCost: productData.purchaseCost,
          })
        }
        showToast('Producto editado')
      } catch (e) {
        console.error(e)
        showToast('Error al editar producto', 'error')
      }
      setEditProductOpen(false)
    },
    [product, productSuppliers, activeSupplier, setProducts, setProductSuppliers, setEditProductOpen, showToast],
  )

  const handleDeleteProduct = useCallback(async () => {
    if (!product) return
    if (!window.confirm('¿Eliminar este producto y todas sus presentaciones?')) return
    try {
      await productService.deleteProduct(product._id)
      setProducts((prev) => prev.filter((p) => p._id !== product._id))
      setPresentations((prev) => prev.filter((p) => p.productId !== product._id))
      navigate('/products')
      showToast('Producto eliminado')
    } catch (e) {
      console.error(e)
      showToast('Error al eliminar producto', 'error')
    }
  }, [product, setProducts, setPresentations, navigate, showToast])

  const handleStockGramsSave = useCallback(async () => {
    if (!product) return
    const val = parseInt(stockGramsValue)
    if (isNaN(val) || val < 0) return
    try {
      const updated = await stockService.updateStockGrams(product._id, val)
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p)),
      )
      showToast('Stock actualizado')
    } catch (e) {
      console.error(e)
      showToast('Error al actualizar stock', 'error')
    }
    setStockGramsEdit(false)
  }, [product, stockGramsValue, setProducts, setStockGramsEdit, showToast])

  const handleSale = useCallback(
    async (sale) => {
      await addSale(sale)
      const result = applyStockDeduction(presentations, allProducts, sale)
      setPresentations(result.presentations)
      setProducts(result.products)
      setSalePresId(null)
    },
    [addSale, presentations, allProducts, setProducts, setPresentations, setSalePresId],
  )

  return { handleEditProduct, handleDeleteProduct, handleStockGramsSave, handleSale }
}
