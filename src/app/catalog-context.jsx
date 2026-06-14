import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import * as catalogService from './services/catalog-services.js'
import { catalogReducer, INITIAL_CATALOG_STATE } from './reducer/catalog-reducer.js'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
	const [state, dispatch] = useReducer(catalogReducer, INITIAL_CATALOG_STATE)

	const setCategories = useCallback((value) => {
		dispatch({ type: 'SET_CATEGORIES', categories: value })
	}, [])

	const setProducts = useCallback((value) => {
		dispatch({ type: 'SET_PRODUCTS', products: value })
	}, [])

	const setPresentations = useCallback((value) => {
		dispatch({ type: 'SET_PRESENTATIONS', presentations: value })
	}, [])

	const setSuppliers = useCallback((value) => {
		dispatch({ type: 'SET_SUPPLIERS', suppliers: value })
	}, [])

	const setProductSuppliers = useCallback((value) => {
		dispatch({ type: 'SET_PRODUCT_SUPPLIERS', productSuppliers: value })
	}, [])

	useEffect(() => {
		;(async () => {
			try {
				const [cats, prods, pres, sups, pss] = await Promise.all([
					catalogService.getCategories(),
					catalogService.getProducts(),
					catalogService.getPresentations(),
					catalogService.getSuppliers().catch(() => []),
					catalogService.getProductSuppliers().catch(() => []),
				])
				dispatch({ type: 'LOAD_API', categories: cats, products: prods, presentations: pres, suppliers: sups, productSuppliers: pss })
			} catch (e) {
				console.error('Failed to load data:', e)
				dispatch({ type: 'SET_LOADING', loading: false })
			}
		})()
	}, [])

	const refresh = useCallback(async () => {
		try {
			const [cats, prods, pres, sups, pss] = await Promise.all([
				catalogService.getCategories(),
				catalogService.getProducts(),
				catalogService.getPresentations(),
				catalogService.getSuppliers().catch(() => state.suppliers),
				catalogService.getProductSuppliers().catch(() => state.productSuppliers),
			])
			dispatch({ type: 'LOAD_API', categories: cats, products: prods, presentations: pres, suppliers: sups, productSuppliers: pss })
		} catch { /* stay with stale data */ }
	}, [state.suppliers, state.productSuppliers])

	return (
		<CatalogContext.Provider value={{
			...state,
			refresh, setCategories, setProducts, setPresentations, setSuppliers, setProductSuppliers,
		}}>
			{children}
		</CatalogContext.Provider>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog() {
	const ctx = useContext(CatalogContext)
	if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
	return ctx
}
