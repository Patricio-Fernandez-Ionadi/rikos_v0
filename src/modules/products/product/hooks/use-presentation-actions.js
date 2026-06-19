import { useCallback } from 'react'
import * as presService from '../services/presentation-services.js'
import * as stockService from '../../../stock/services/stock-services.js'
import { useToast } from '../../../../components/Toast.jsx'

export function usePresentationActions({
  product,
  editingPres,
  productPres,
  isFraction,
  setPresentations,
  setProducts,
}) {
  const showToast = useToast()

  const handleRenumberPres = useCallback(async () => {
    if (!window.confirm('¿Renumerar todas las presentaciones secuencialmente?')) return
    try {
      const result = await presService.renumberPresentations()
      const all = await presService.getAllPresentations()
      setPresentations(all)
      showToast(`Presentaciones reordenadas (${result.count} actualizadas)`)
    } catch (e) {
      console.error(e)
      showToast('Error al renumerar presentaciones', 'error')
    }
  }, [setPresentations, showToast])

  const handleCreatePres = useCallback(
    async (data) => {
      if (!product) return
      try {
        const created = await presService.createPresentation({
          productId: product._id,
          ...data,
        })
        setPresentations((prev) => [...prev, created])
        showToast('Presentación creada')
      } catch (e) {
        console.error(e)
        showToast('Error al crear presentación', 'error')
      }
    },
    [product, setPresentations, showToast],
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
        showToast('Presentación actualizada')
      } catch (e) {
        console.error(e)
        showToast('Error al actualizar presentación', 'error')
      }
    },
    [editingPres, isFraction, product, setPresentations, setProducts, showToast],
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
        showToast('Presentación eliminada')
      } catch (e) {
        console.error(e)
        showToast('Error al eliminar presentación', 'error')
      }
    },
    [isFraction, product, productPres, setPresentations, setProducts, showToast],
  )

  return { handleCreatePres, handleEditPres, handleDeletePres, handleRenumberPres }
}
