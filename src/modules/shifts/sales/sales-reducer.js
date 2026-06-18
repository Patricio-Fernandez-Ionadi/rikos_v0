/** @type {SalesState} */
export const initialState = {
	expandedIds: new Set(),
	editingId: null,
	editQty: null,
}

/**
 * @param {SalesState} state
 * @param {{ type: string, payload?: any }} action
 * @returns {SalesState}
 */
export function salesReducer(state, action) {
	switch (action.type) {
		case 'TOGGLE_EXPAND': {
			const next = new Set(state.expandedIds)
			if (next.has(action.payload)) {
				next.delete(action.payload)
			} else {
				next.add(action.payload)
			}
			return { ...state, expandedIds: next }
		}

		case 'START_EDIT':
			return { ...state, editingId: action.payload.id, editQty: action.payload.qty }

		case 'CANCEL_EDIT':
			return { ...state, editingId: null, editQty: null }

		case 'SET_EDIT_QTY':
			return { ...state, editQty: Math.max(1, action.payload) }

		default:
			return state
	}
}
