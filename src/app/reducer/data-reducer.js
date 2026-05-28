export const INITIAL_DATA_STATE = {
	categories: [],
	products: [],
	presentations: [],
	suppliers: [],
	productSuppliers: [],
	loading: true,
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
				productSuppliers: action.productSuppliers ?? [],
				loading: false,
			}
		case 'SET_LOADING':
			return { ...state, loading: action.loading }
		case 'SET_CATEGORIES':
			return { ...state, categories: action.categories }
		case 'SET_PRODUCTS':
			return { ...state, products: action.products }
		case 'SET_PRESENTATIONS':
			return { ...state, presentations: action.presentations }
		case 'SET_SUPPLIERS':
			return { ...state, suppliers: action.suppliers }
		case 'SET_PRODUCT_SUPPLIERS':
			return { ...state, productSuppliers: action.productSuppliers }
		default:
			return state
	}
}
