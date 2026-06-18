import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useShift } from '../modules/shifts/shift-context.jsx'

const CART_KEY = 'rikos-sale-cart'

function hasCartItems() {
  try {
    const raw = sessionStorage.getItem(CART_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return Array.isArray(data?.cartItems) && data.cartItems.length > 0
  } catch {
    return false
  }
}

export const ShiftBar = () => {
  const { shift } = useShift()
  const location = useLocation()
  const [cartActive, setCartActive] = useState(hasCartItems)

  useEffect(() => {
    setCartActive(hasCartItems())
  }, [location])

  if (!shift) return null

  return (
    <div className='shift-bar'>
      <div className='shift-bar__active'>
        <span className='shift-bar__badge shift-bar__badge--open'>
          Turno abierto
        </span>

        {cartActive && (
          <Link to='/shifts/sale' className='shift-bar__btn shift-bar__btn--primary'>
            Carrito
          </Link>
        )}

        <Link to='/shifts' className='btn btn--primary'>
          Ir al turno
        </Link>
      </div>
    </div>
  )
}
