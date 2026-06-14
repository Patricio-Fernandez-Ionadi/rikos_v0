import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { ALERTS } from './alerts-config.js'

export function useAlertsManager() {
  const { type } = useParams()
  const { categories, products, presentations } = useCatalog()

  const alert = ALERTS[type]

  const rows = useMemo(
    () => (alert ? alert.filter(products, presentations) : []),
    [alert, products, presentations],
  )

  return { alert, rows, categories }
}
