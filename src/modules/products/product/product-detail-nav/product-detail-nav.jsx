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
  filterOpen,
  onToggleFilter,
  onNavigate,
  localSearch,
  onSearchChange,
  products,
  filteredIds,
  categories,
  localCategories,
  onToggleCategory,
  tags,
  localTags,
  onToggleTag,
  onBack,
}) {
  return (
    <>
      <div className='detail-page__header'>
        <button className='back-btn' onClick={onBack}>
          <span className='material-icons'>arrow_back</span> Volver
        </button>
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
                const p = products.find((p) => p._id === filteredIds[i])
                const label = p ? p.name.slice(0, 5) : '...'
                return (
                  <Button
                    key={i}
                    size='sm'
                    variant={i === navInfo.index ? 'primary' : 'default'}
                    onClick={() => onNavigate(filteredIds[i])}
                    title={p?.name ?? ''}
                  >
                    {label}
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
            <Button
              size='sm'
              variant={filterOpen ? 'primary' : ''}
              active={filterOpen}
              onClick={onToggleFilter}
              title='Filtrar'
            >
              <span className='material-icons'>search</span>
              Filtrar
            </Button>
          </div>
        )}
      </div>

      {filterOpen && (
        <div className='detail-page__filter-bar'>
          <input
            className='field-input'
            type='text'
            placeholder='Buscar producto, marca o presentación…'
            value={localSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
            autoFocus
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {categories.map((cat) => {
              const active = localCategories.includes(cat._id)
              return (
                <Button
                  key={cat._id}
                  size='xs'
                  active={active}
                  onClick={() => onToggleCategory(cat._id)}
                >
                  {cat.name}
                </Button>
              )
            })}
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {tags.map((tag) => {
                const active = localTags.includes(tag)
                return (
                  <Button key={tag} size='xs' active={active} onClick={() => onToggleTag(tag)}>
                    {tag}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
