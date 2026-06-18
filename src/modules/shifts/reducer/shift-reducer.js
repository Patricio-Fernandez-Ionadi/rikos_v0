export const INITIAL_SHIFT_STATE = {
	shift: null,
	synced: false,
}

export function shiftReducer(state, action) {
	switch (action.type) {
		case 'SET_SHIFT':
			return { ...state, shift: action.shift }
		case 'SET_SYNCED':
			return { ...state, synced: action.synced }
		case 'ADD_SALE':
			return {
				...state,
				shift: {
					...state.shift,
					sales: [...(state.shift?.sales ?? []), action.sale],
				},
			}
		case 'BATCH_ADD_SALES':
			return {
				...state,
				shift: {
					...state.shift,
					sales: [...(state.shift?.sales ?? []), ...action.sales],
				},
			}
		case 'REMOVE_SALE':
			return {
				...state,
				shift: {
					...state.shift,
					sales: state.shift.sales.filter((s) => s._tempId !== action.tempId),
				},
			}
		case 'EDIT_SALE':
			return {
				...state,
				synced: false,
				shift: {
					...state.shift,
					sales: state.shift.sales.map((s) =>
						s._tempId === action.tempId ? { ...s, ...action.fields } : s,
					),
				},
			}
		case 'ADD_ADJUSTMENT':
			return {
				...state,
				shift: {
					...state.shift,
					adjustments: [...(state.shift?.adjustments ?? []), action.adjustment],
				},
			}
		case 'UPDATE_DB_ID':
			return {
				...state,
				shift: { ...state.shift, _dbId: action.dbId },
			}
		case 'CLOSE':
			return INITIAL_SHIFT_STATE
		case 'CLEAR':
			return INITIAL_SHIFT_STATE
		default:
			return state
	}
}
