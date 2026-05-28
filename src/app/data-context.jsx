import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import * as api from '../data/api.js'
import { dataReducer, INITIAL_DATA_STATE } from './reducer/data-reducer.js'

const DataContext = createContext(null)

export function DataProvider({ children }) {
	const [state, dispatch] = useReducer(dataReducer, INITIAL_DATA_STATE)

	const setCategories = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_CATEGORIES', categories: fn(state.categories) })
	}, [state.categories])

	const setProducts = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_PRODUCTS', products: fn(state.products) })
	}, [state.products])

	const setPresentations = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_PRESENTATIONS', presentations: fn(state.presentations) })
	}, [state.presentations])

	const setSuppliers = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_SUPPLIERS', suppliers: fn(state.suppliers) })
	}, [state.suppliers])

	const setProductSuppliers = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_PRODUCT_SUPPLIERS', productSuppliers: fn(state.productSuppliers) })
	}, [state.productSuppliers])

	useEffect(() => {
		;(async () => {
			try {
				const [cats, prods, pres, sups] = await Promise.all([
					api.getCategories(),
					api.getProducts(),
					api.getPresentations(),
					api.getSuppliers().catch(() => []),
				])
				dispatch({ type: 'LOAD_API', categories: cats, products: prods, presentations: pres, suppliers: sups })
			} catch (e) {
				console.error('Failed to load data:', e)
				dispatch({ type: 'SET_LOADING', loading: false })
			}
		})()
	}, [])

	const refresh = useCallback(async () => {
		try {
			const [cats, prods, pres, sups] = await Promise.all([
				api.getCategories(),
				api.getProducts(),
				api.getPresentations(),
				api.getSuppliers().catch(() => state.suppliers),
			])
			dispatch({ type: 'LOAD_API', categories: cats, products: prods, presentations: pres, suppliers: sups })
		} catch { /* stay with stale data */ }
	}, [state.suppliers])

	return (
		<DataContext.Provider value={{
			...state,
			refresh, setCategories, setProducts, setPresentations, setSuppliers, setProductSuppliers,
		}}>
			{children}
		</DataContext.Provider>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
	const ctx = useContext(DataContext)
	if (!ctx) throw new Error('useData must be used within DataProvider')
	return ctx
}
