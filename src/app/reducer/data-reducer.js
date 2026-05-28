export const INITIAL_DATA_STATE = {
	categories: [],
	products: [],
	presentations: [],
	suppliers: [],
	loading: true,
	online: false,
	dirty: false,
}

export function dataReducer(state, action) {
	switch (action.type) {
		case 'LOAD_API':
			return {
				...state,
				categories: action.categories,
				products: action.products,
				presentations: action.presentations,
				suppliers: action.suppliers ?? [],
				online: true,
			}
		case 'LOAD_LOCAL':
			return {
				...state,
				categories: action.categories,
				products: action.products,
				presentations: action.presentations,
				suppliers: action.suppliers ?? [],
				online: false,
				dirty: action.dirty || false,
			}
		case 'SET_LOADING':
			return { ...state, loading: action.loading }
		case 'SET_ONLINE':
			return { ...state, online: action.online }
		case 'SET_DIRTY':
			return { ...state, dirty: action.dirty }
		case 'SET_CATEGORIES':
			return { ...state, categories: action.categories, dirty: action.markDirty || state.dirty }
		case 'SET_PRODUCTS':
			return { ...state, products: action.products, dirty: action.markDirty || state.dirty }
		case 'SET_PRESENTATIONS':
			return { ...state, presentations: action.presentations, dirty: action.markDirty || state.dirty }
		case 'SET_SUPPLIERS':
			return { ...state, suppliers: action.suppliers, dirty: action.markDirty || state.dirty }
		default:
			return state
	}
}
