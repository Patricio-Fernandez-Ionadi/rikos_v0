import { useCallback } from 'react'
import * as presService from '../services/presentation-services.js'
import * as stockService from '../../../stock/services/stock-services.js'

export function usePresentationActions({
  product,
  editingPres,
  productPres,
  isFraction,
  setPresentations,
  setProducts,
}) {
  const handleCreatePres = useCallback(
    async (data) => {
      if (!product) return
      try {
        const created = await presService.createPresentation({
          productId: product._id,
          ...data,
        })
        setPresentations((prev) => [...prev, created])
      } catch (e) {
        console.error(e)
      }
    },
    [product, setPresentations],
  )

  const handleEditPres = useCallback(
    async (data) => {
      if (!editingPres) return
      try {
        const updated = await presService.updatePresentation(
          editingPres._id,
          data,
        )
        setPresentations((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p)),
        )

        if (isFraction && editingPres.grams) {
          const oldStock = editingPres.stock ?? 0
          const newStock = data.stock ?? 0
          const delta = newStock - oldStock
          if (delta !== 0) {
            const gramsDelta = delta * editingPres.grams
            const updatedProduct = await stockService.updateStockGrams(
              product._id,
              (product.stockGrams ?? 0) - gramsDelta,
            )
            setProducts((prev) =>
              prev.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p,
              ),
            )
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    [editingPres, isFraction, product, setPresentations, setProducts],
  )

  const handleDeletePres = useCallback(
    async (presId) => {
      if (!window.confirm('¿Eliminar esta presentación?')) return
      try {
        const pres = productPres?.find((p) => p._id === presId)
        await presService.deletePresentation(presId)
        setPresentations((prev) => prev.filter((p) => p._id !== presId))

        if (isFraction && pres?.grams && (pres.stock ?? 0) > 0) {
          const recoveredGrams = (pres.stock ?? 0) * pres.grams
          const updatedProduct = await stockService.updateStockGrams(
            product._id,
            (product.stockGrams ?? 0) + recoveredGrams,
          )
          setProducts((prev) =>
            prev.map((p) =>
              p._id === updatedProduct._id ? updatedProduct : p,
            ),
          )
        }
      } catch (e) {
        console.error(e)
      }
    },
    [isFraction, product, productPres, setPresentations, setProducts],
  )

  return { handleCreatePres, handleEditPres, handleDeletePres }
}
