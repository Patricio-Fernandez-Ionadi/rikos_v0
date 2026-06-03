export const INITIAL_CATALOG_STATE = {
	categories: [],
	products: [],
	presentations: [],
	suppliers: [],
	productSuppliers: [],
	loading: true,
}

function resolveUpdater(value, current) {
	return typeof value === 'function' ? value(current) : value
}

export function catalogReducer(state, action) {
	switch (action.type) {
		case 'LOAD_API':
			return {
				...state,
				categories: action.categories,
				products: action.products,
				presentations: action.presentations,
				suppliers: action.suppliers ?? [],
				productSuppliers: action.productSuppliers ?? [],
				loading: false,
			}
		case 'SET_LOADING':
			return { ...state, loading: action.loading }
		case 'SET_CATEGORIES':
			return { ...state, categories: resolveUpdater(action.categories, state.categories) }
		case 'SET_PRODUCTS':
			return { ...state, products: resolveUpdater(action.products, state.products) }
		case 'SET_PRESENTATIONS':
			return { ...state, presentations: resolveUpdater(action.presentations, state.presentations) }
		case 'SET_SUPPLIERS':
			return { ...state, suppliers: resolveUpdater(action.suppliers, state.suppliers) }
		case 'SET_PRODUCT_SUPPLIERS':
			return { ...state, productSuppliers: resolveUpdater(action.productSuppliers, state.productSuppliers) }
		default:
			return state
	}
}
