export const selectCategories = (dispatch) => (ids) => dispatch({ type: 'SELECT_CATEGORIES', ids })

export const selectProduct = (dispatch) => (id) => dispatch({ type: 'SELECT_PRODUCT', id })

export const searchProducts = (dispatch) => (term) => dispatch({ type: 'SET_SEARCH', term })

export const openProductForm = (dispatch) => () => dispatch({ type: 'OPEN_PRODUCT_FORM' })

export const closeProductForm = (dispatch) => () => dispatch({ type: 'CLOSE_PRODUCT_FORM' })

export const editProduct = (dispatch) => (product) => dispatch({ type: 'OPEN_EDIT_PRODUCT', product })

export const closeEditProduct = (dispatch) => () => dispatch({ type: 'CLOSE_EDIT_PRODUCT' })

export const openPresForm = (dispatch) => () => dispatch({ type: 'OPEN_PRES_FORM' })

export const closePresForm = (dispatch) => () => dispatch({ type: 'CLOSE_PRES_FORM' })

export const editPres = (dispatch) => (pres) => dispatch({ type: 'OPEN_EDIT_PRES', pres })

export const closeEditPres = (dispatch) => () => dispatch({ type: 'CLOSE_EDIT_PRES' })

export const startSale = (dispatch) => (presId) => dispatch({ type: 'START_SALE', presId })

export const cancelSale = (dispatch) => () => dispatch({ type: 'CANCEL_SALE' })

export const startStockEdit = (dispatch) => (presId, currentStock) =>
	dispatch({ type: 'START_STOCK_EDIT', presId, currentStock })

export const cancelStockEdit = (dispatch) => () => dispatch({ type: 'CANCEL_STOCK_EDIT' })

export const changeStockValue = (dispatch) => (value) => dispatch({ type: 'SET_STOCK_VALUE', value })

export const toggleSupplierPanel = (dispatch) => () => dispatch({ type: 'TOGGLE_SUPPLIER_PANEL' })

export const setProductSuppliers = (dispatch) => (suppliers) => dispatch({ type: 'SET_PRODUCT_SUPPLIERS', suppliers })
