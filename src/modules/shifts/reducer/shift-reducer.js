export const INITIAL_SHIFT_STATE = {
	shift: null,
}

export function shiftReducer(state, action) {
	switch (action.type) {
		case 'SET_SHIFT':
			return { ...state, shift: action.shift }
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
					sales: state.shift.sales.filter(
						(s) => s._tempId !== action.tempId && s._id !== action.tempId,
					),
				},
			}
		case 'EDIT_SALE':
			return {
				...state,
				shift: {
					...state.shift,
					sales: state.shift.sales.map((s) =>
						s._tempId === action.tempId || s._id === action.tempId
							? { ...s, ...action.fields }
							: s,
					),
				},
			}
		case 'REMOVE_SALES_BY_TICKET':
			return {
				...state,
				shift: {
					...state.shift,
					sales: state.shift.sales.filter((s) => s.ticketId !== action.ticketId),
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
