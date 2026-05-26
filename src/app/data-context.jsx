import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import * as api from '../data/api.js'
import seed from '../data/seed.json' with { type: 'json' }
import { dataReducer, INITIAL_DATA_STATE } from './reducer/data-reducer.js'

const STORAGE_KEY = 'rikos_data'
const DataContext = createContext(null)

function loadLocal() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const data = JSON.parse(raw)
		if (data.categories && data.products && data.presentations) return data
		return null
	} catch {
		return null
	}
}

function saveLocal(categories, products, presentations, dirty) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ categories, products, presentations, dirty }))
	} catch { /* quota exceeded */ }
}

export function DataProvider({ children }) {
	const [state, dispatch] = useReducer(dataReducer, INITIAL_DATA_STATE)
	const loaded = useRef(false)

	// Wrapped setters that also mark dirty when changed offline
	const setCategories = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_CATEGORIES', categories: fn(state.categories), markDirty: loaded.current && !state.online })
	}, [state.categories, state.online])

	const setProducts = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_PRODUCTS', products: fn(state.products), markDirty: loaded.current && !state.online })
	}, [state.products, state.online])

	const setPresentations = useCallback((value) => {
		const fn = typeof value === 'function' ? value : () => value
		dispatch({ type: 'SET_PRESENTATIONS', presentations: fn(state.presentations), markDirty: loaded.current && !state.online })
	}, [state.presentations, state.online])

	// Persist to localStorage on every state change after initial load
	useEffect(() => {
		if (loaded.current) {
			saveLocal(state.categories, state.products, state.presentations, state.dirty)
		}
	}, [state.categories, state.products, state.presentations, state.dirty])

	const loadFromApi = useCallback(async () => {
		const [cats, prods, pres] = await Promise.all([
			api.getCategories(),
			api.getProducts(),
			api.getPresentations(),
		])
		dispatch({ type: 'LOAD_API', categories: cats, products: prods, presentations: pres })
	}, [])

	const loadFromLocal = useCallback(() => {
		const saved = loadLocal()
		if (saved) {
			dispatch({ type: 'LOAD_LOCAL', ...saved })
		} else {
			dispatch({ type: 'LOAD_LOCAL', categories: seed.categories, products: seed.products, presentations: seed.presentations })
		}
	}, [])

	useEffect(() => {
		;(async () => {
			try {
				await loadFromApi()
			} catch {
				loadFromLocal()
			}
			loaded.current = true
			dispatch({ type: 'SET_LOADING', loading: false })
		})()
	}, [loadFromApi, loadFromLocal])

	const refresh = useCallback(async () => {
		try {
			const [cats, prods, pres] = await Promise.all([
				api.getCategories(),
				api.getProducts(),
				api.getPresentations(),
			])
			dispatch({ type: 'LOAD_API', categories: cats, products: prods, presentations: pres })
		} catch { /* stay with stale data */ }
	}, [])

	const syncData = useCallback(async () => {
		if (!state.online) return false

		try {
			const [, serverProds, serverPres] = await Promise.all([
				api.getCategories(),
				api.getProducts(),
				api.getPresentations(),
			])

			const prodByKey = new Map()
			serverProds.forEach((p) => prodByKey.set(`${p.categoryId}::${p.name}`, p))

			const idMap = new Map()
			for (const p of state.products) {
				const key = `${p.categoryId}::${p.name}`
				const existing = prodByKey.get(key)
				if (existing) {
					await api.updateProduct(existing._id, { name: p.name, purchaseCost: p.purchaseCost, categoryId: p.categoryId })
					idMap.set(p._id, existing._id)
				} else {
					const created = await api.createProduct({ name: p.name, purchaseCost: p.purchaseCost, categoryId: p.categoryId })
					idMap.set(p._id, created._id)
				}
			}

			for (const p of state.presentations) {
				const serverProductId = idMap.get(p.productId) || p.productId
				const key = `${serverProductId}::${p.label}`
				const existing = serverPres.find((sp) => `${sp.productId}::${sp.label}` === key)
				if (existing) {
					await api.updatePresentation(existing._id, { label: p.label, grams: p.grams, margin: p.margin, salePrice: p.salePrice })
					await api.updateStock(existing._id, p.stock ?? 0)
				} else {
					await api.createPresentation({
						productId: serverProductId, label: p.label, grams: p.grams,
						margin: p.margin, salePrice: p.salePrice, stock: p.stock ?? 0,
					})
				}
			}

			await refresh()
			dispatch({ type: 'SET_DIRTY', dirty: false })
			return true
		} catch (e) {
			console.error('Data sync failed:', e)
			return false
		}
	}, [state.products, state.presentations, state.online, refresh])

	return (
		<DataContext.Provider value={{
			...state,
			refresh, syncData, setCategories, setProducts, setPresentations,
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
