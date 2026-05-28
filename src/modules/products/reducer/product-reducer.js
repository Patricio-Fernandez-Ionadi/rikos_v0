export const INITIAL_PRODUCT_STATE = {
	selectedCategoryIds: [],
	selectedProductId: null,
	searchTerm: '',
	showProductForm: false,
	editingProduct: null,
	showPresForm: false,
	editingPres: null,
	showPresentationsModal: false,
	salePresId: null,
	stockEdit: null,
	stockValue: '',
	showSupplierPanel: false,
	productSuppliers: [],
}

export function productReducer(state, action) {
	switch (action.type) {
		case 'SELECT_CATEGORIES':
			return { ...state, selectedCategoryIds: action.ids }
		case 'SELECT_PRODUCT':
			return { ...state, selectedProductId: action.id, showSupplierPanel: false, productSuppliers: [] }
		case 'SET_SEARCH':
			return { ...state, searchTerm: action.term }
		case 'OPEN_PRODUCT_FORM':
			return { ...state, showProductForm: true }
		case 'CLOSE_PRODUCT_FORM':
			return { ...state, showProductForm: false }
		case 'OPEN_EDIT_PRODUCT':
			return { ...state, editingProduct: action.product }
		case 'CLOSE_EDIT_PRODUCT':
			return { ...state, editingProduct: null }
		case 'OPEN_PRES_FORM':
			return { ...state, showPresForm: true, showPresentationsModal: false }
		case 'CLOSE_PRES_FORM':
			return { ...state, showPresForm: false }
		case 'OPEN_EDIT_PRES':
			return { ...state, editingPres: action.pres }
		case 'CLOSE_EDIT_PRES':
			return { ...state, editingPres: null }
		case 'OPEN_PRESENTATIONS_MODAL':
			return { ...state, showPresentationsModal: true }
		case 'CLOSE_PRESENTATIONS_MODAL':
			return { ...state, showPresentationsModal: false }
		case 'START_SALE':
			return { ...state, salePresId: action.presId }
		case 'CANCEL_SALE':
			return { ...state, salePresId: null }
		case 'START_STOCK_EDIT':
			return { ...state, stockEdit: action.presId, stockValue: String(action.currentStock ?? 0) }
		case 'CANCEL_STOCK_EDIT':
			return { ...state, stockEdit: null, stockValue: '' }
		case 'SET_STOCK_VALUE':
			return { ...state, stockValue: action.value }
		case 'TOGGLE_SUPPLIER_PANEL':
			return { ...state, showSupplierPanel: !state.showSupplierPanel }
		case 'SET_PRODUCT_SUPPLIERS':
			return { ...state, productSuppliers: action.suppliers }
		default:
			return state
	}
}
