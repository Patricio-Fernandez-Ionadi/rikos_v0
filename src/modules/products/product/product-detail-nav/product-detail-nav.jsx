import { useRef, useEffect } from 'react'
import { Button } from '../../../../components/button.jsx'

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

export function ProductDetailNav({
  navInfo,
  onNavigate,
  search,
  onSearchChange,
  searchResults,
  onSelectResult,
  onBack,
}) {
  const dropdownRef = useRef(null)

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

  return (
    <>
      <div className='detail-page__header'>
        <button className='back-btn' onClick={onBack}>
          <span className='material-icons'>arrow_back</span> Volver
        </button>
        <div className='detail-page__search-wrap' ref={dropdownRef}>
          <input
            className='field-input detail-page__search-input'
            type='text'
            placeholder='Buscar producto…'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
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
        {navInfo && (
          <div className='detail-page__nav'>
            <div className='detail-page__nav-pagination'>
              <Button
                size='sm'
                disabled={!navInfo.prevId}
                onClick={() => onNavigate(navInfo.prevId)}
              >
                <span className='material-icons'>chevron_left</span>
              </Button>
              {getPageRange(navInfo.index, navInfo.total, 3).map((i) => {
                const idx = i
                return (
                  <Button
                    key={i}
                    size='sm'
                    variant={i === navInfo.index ? 'primary' : 'default'}
                    onClick={() => onNavigate(idx)}
                  >
                    {i + 1}
                  </Button>
                )
              })}
              <Button
                size='sm'
                disabled={!navInfo.nextId}
                onClick={() => onNavigate(navInfo.nextId)}
              >
                <span className='material-icons'>chevron_right</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}