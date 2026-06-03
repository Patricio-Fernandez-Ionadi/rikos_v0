export const INITIAL_ORDER_STATE = {
  orders: [],
  loading: true,
}

export function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.orders, loading: false }
    case 'ADD_ORDER':
      return { ...state, orders: [action.order, ...state.orders] }
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map((o) =>
          o._id === action.order._id ? action.order : o,
        ),
      }
    case 'REMOVE_ORDER':
      return {
        ...state,
        orders: state.orders.filter((o) => o._id !== action.id),
      }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    default:
      return state
  }
}
