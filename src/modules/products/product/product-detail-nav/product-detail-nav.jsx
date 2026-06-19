import { useRef, useEffect, useState } from 'react'
import { Button } from '../../../../components/button.jsx'
import { BackButton } from '../../../../components/back-button.jsx'

function getPageRange(current, total, maxVisible) {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i)
  }
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(0, current - half)
  let end = Math.min(total - 1, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(0, end - maxVisible + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function truncate(name, max = 10) {
  if (!name) return ''
  return name.length > max ? name.slice(0, max) + '…' : name
}

export function ProductDetailNav({
  navInfo,
  onNavigate,
  search,
  onSearchChange,
  searchResults,
  onSelectResult,
  onBack,
  productList,
  products,
}) {
  const dropdownRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!search.trim()) return
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onSearchChange('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [search, onSearchChange])

  const findProductName = (id) => {
    const p = products?.find((x) => x._id === id)
    return p?.name ?? ''
  }

  return (
    <div className='detail-page__header'>
      <div className='detail-page__header-row'>
        <BackButton onClick={onBack} />

        <div className='detail-page__search-wrap' ref={dropdownRef}>
          <div className='detail-page__search-bar'>
            <span className='detail-page__search-icon material-icons'>search</span>
            <input
              className='detail-page__search-input'
              type='text'
              placeholder='Buscar producto…'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {search && (
              <button
                className='detail-page__search-clear'
                onClick={() => onSearchChange('')}
                type='button'
                aria-label='Limpiar búsqueda'
              >
                <span className='material-icons'>close</span>
              </button>
            )}
          </div>
          {search.trim() && searchResults.length > 0 && (
            <div className='detail-page__search-dropdown'>
              {searchResults.map((p) => (
                <button
                  key={p._id}
                  className='detail-page__search-item'
                  onClick={() => onSelectResult(p._id)}
                  type='button'
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {navInfo && productList?.length > 0 && (
        <div className='detail-page__nav'>
          <div className='detail-page__nav-pagination'>
            <Button
              size='sm'
              disabled={!navInfo.prevId}
              onClick={() => onNavigate(navInfo.prevId)}
              title={navInfo.prevId ? findProductName(navInfo.prevId) : ''}
            >
              <span className='material-icons'>chevron_left</span>
            </Button>

            {getPageRange(navInfo.index, navInfo.total, isMobile ? 3 : 5).map((i) => {
              const id = productList[i]
              const name = findProductName(id)
              return (
                <Button
                  key={i}
                  size='sm'
                  variant={i === navInfo.index ? 'primary' : 'default'}
                  onClick={() => onNavigate(id)}
                  title={name}
                >
                  {truncate(name, isMobile ? 8 : 12)}
                </Button>
              )
            })}

            <Button
              size='sm'
              disabled={!navInfo.nextId}
              onClick={() => onNavigate(navInfo.nextId)}
              title={navInfo.nextId ? findProductName(navInfo.nextId) : ''}
            >
              <span className='material-icons'>chevron_right</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}