import { useState, useMemo, useCallback } from 'react'
import { filterProducts } from '../data/filter-products.js'

export function ProductSearch({
  products,
  presentations,
  categories,
  allTags,
  compact = false,
  placeholder = 'Buscar producto...',
  autoFocus = false,
  showSearch = true,
  showCategories = true,
  showTags = true,
  categoryMode = 'multi',
  filterState: externalState,
  onFilterStateChange,
  children,
}) {
  const [internalSearch, setInternalSearch] = useState('')
  const [internalCategories, setInternalCategories] = useState([])
  const [internalTags, setInternalTags] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(!compact)

  const isControlled = externalState !== undefined

  const searchTerm = useMemo(
    () => isControlled ? (externalState.searchTerm ?? '') : internalSearch,
    [isControlled, externalState?.searchTerm, internalSearch]
  )

  const selectedCategoryIds = useMemo(
    () => isControlled ? (externalState.selectedCategoryIds ?? []) : internalCategories,
    [isControlled, externalState?.selectedCategoryIds, internalCategories]
  )

  const selectedTags = useMemo(
    () => isControlled ? (externalState.selectedTags ?? []) : internalTags,
    [isControlled, externalState?.selectedTags, internalTags]
  )

  const update = useCallback((changes) => {
    if (isControlled) {
      onFilterStateChange?.({ ...externalState, ...changes })
    } else {
      if ('searchTerm' in changes) setInternalSearch(changes.searchTerm)
      if ('selectedCategoryIds' in changes) setInternalCategories(changes.selectedCategoryIds)
      if ('selectedTags' in changes) setInternalTags(changes.selectedTags)
    }
  }, [isControlled, externalState, onFilterStateChange])

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return filterProducts(products, presentations ?? [], {
      searchTerm,
      categoryIds: selectedCategoryIds,
      tags: selectedTags,
    })
  }, [products, presentations, searchTerm, selectedCategoryIds, selectedTags])

  const handleSearch = useCallback((e) => update({ searchTerm: e.target.value }), [update])
  const clearSearch = useCallback(() => update({ searchTerm: '' }), [update])

  const toggleCategory = useCallback((id) => {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((x) => x !== id)
      : [...selectedCategoryIds, id]
    update({ selectedCategoryIds: next })
  }, [selectedCategoryIds, update])

  const setSingleCategory = useCallback((id) => {
    update({ selectedCategoryIds: id ? [id] : [] })
  }, [update])

  const toggleTag = useCallback((tag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    update({ selectedTags: next })
  }, [selectedTags, update])

  const clearAll = useCallback(() => {
    update({ searchTerm: '', selectedCategoryIds: [], selectedTags: [] })
  }, [update])

  const hasFilters = searchTerm || selectedCategoryIds.length > 0 || selectedTags.length > 0
  const showFilterPanel = !compact || filtersOpen
  const hasCategories = categories?.length > 0
  const hasTags = allTags?.length > 0
  const showAnyFilter = (showCategories && hasCategories) || (showTags && hasTags)

  const filterState = { searchTerm, selectedCategoryIds, selectedTags }

  const handlers = {
    setSearch: (v) => update({ searchTerm: v }),
    clearSearch,
    toggleCategory,
    setSingleCategory,
    toggleTag,
    clearAll,
  }

  const searchUI = (
    <>
      {showSearch && (
        <div className="product-search__bar">
          <span className="product-search__icon material-icons">search</span>
          <input
            type="text"
            className="product-search__input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearch}
            autoFocus={autoFocus}
          />
          {searchTerm && (
            <button className="product-search__clear" onClick={clearSearch} type="button">
              <span className="material-icons">close</span>
            </button>
          )}
          {compact && showAnyFilter && (
            <button
              className={
                'product-search__toggle material-icons'
                + (filtersOpen ? ' product-search__toggle--active' : '')
              }
              onClick={() => setFiltersOpen((prev) => !prev)}
              type="button"
              aria-label={filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              tune
            </button>
          )}
        </div>
      )}

      {hasFilters && compact && !showFilterPanel && (
        <div className="product-search__chips">
          {selectedCategoryIds.map((id) => {
            const cat = categories?.find((c) => c._id === id)
            if (!cat) return null
            return (
              <span key={id} className="product-search__chip">
                {cat.name}
                <button
                  className="product-search__chip-remove"
                  onClick={() => toggleCategory(id)}
                  type="button"
                >
                  <span className="material-icons">close</span>
                </button>
              </span>
            )
          })}
          {selectedTags.map((tag) => (
            <span key={tag} className="product-search__chip">
              {tag}
              <button
                className="product-search__chip-remove"
                onClick={() => toggleTag(tag)}
                type="button"
              >
                <span className="material-icons">close</span>
              </button>
            </span>
          ))}
        </div>
      )}

      {showFilterPanel && showAnyFilter && (
        <div className="product-search__filters">
          {showCategories && hasCategories && categoryMode === 'multi' && (
            <div className="product-search__filter-group">
              <span className="product-search__filter-label">Categorías:</span>
              <div className="product-search__options">
                <button
                  className={
                    'product-search__option'
                    + (selectedCategoryIds.length === 0 ? ' product-search__option--active' : '')
                  }
                  onClick={() => update({ selectedCategoryIds: [] })}
                  type="button"
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className={
                      'product-search__option'
                      + (selectedCategoryIds.includes(cat._id) ? ' product-search__option--active' : '')
                    }
                    onClick={() => toggleCategory(cat._id)}
                    type="button"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showCategories && categoryMode === 'single' && (
            <div className="product-search__filter-group">
              <span className="product-search__filter-label">Categoría:</span>
              <select
                className="product-search__select"
                value={selectedCategoryIds[0] || ''}
                onChange={(e) => setSingleCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {showTags && hasTags && (
            <div className="product-search__filter-group">
              <span className="product-search__filter-label">Tags:</span>
              <div className="product-search__options">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={
                      'product-search__option'
                      + (selectedTags.includes(tag) ? ' product-search__option--active' : '')
                    }
                    onClick={() => toggleTag(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hasFilters && (
        <div className="product-search__actions">
          <button className="product-search__clear-all" onClick={clearAll} type="button">
            <span className="material-icons">close</span>
            Limpiar filtros
          </button>
        </div>
      )}
    </>
  )

  return (
    <div
      className={
        'product-search'
        + (compact ? ' product-search--compact' : '')
        + (hasFilters ? ' product-search--has-filters' : '')
      }
    >
      {searchUI}

      {typeof children === 'function' && children({ filteredProducts, filterState, handlers })}
    </div>
  )
}
