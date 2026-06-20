import { useCallback } from 'react'
import * as presService from '../services/presentation-services.js'
import { useToast } from '../../../../components/Toast.jsx'

export function usePresentationActions({
  product,
  editingPres,
  setPresentations,
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
        showToast('Presentación actualizada')
      } catch (e) {
        console.error(e)
        showToast('Error al actualizar presentación', 'error')
      }
    },
    [editingPres, setPresentations, showToast],
  )

  const handleDeletePres = useCallback(
    async (presId) => {
      if (!window.confirm('¿Eliminar esta presentación?')) return
      try {
        await presService.deletePresentation(presId)
        setPresentations((prev) => prev.filter((p) => p._id !== presId))
        showToast('Presentación eliminada')
      } catch (e) {
        console.error(e)
        showToast('Error al eliminar presentación', 'error')
      }
    },
    [setPresentations, showToast],
  )

  return { handleCreatePres, handleEditPres, handleDeletePres, handleRenumberPres }
}