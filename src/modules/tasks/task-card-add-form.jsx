import { SearchInput } from '../../components/search-input.jsx'
import { Link } from 'react-router-dom'

export function TaskCardAddForm({
  showAdd, setShowAdd,
  isNameType, isTextBased,
  searchTerm, setSearchTerm,
  filtered,
  suggestionName, setSuggestionName,
  otrosDesc, setOtrosDesc,
  otrosSearch, setOtrosSearch,
  otrosLinkedProduct, setOtrosLinkedProduct,
  otrosFiltered,
  handleToggleProduct,
  handleAddSuggestion,
  handleAddOtros,
  handleLinkOtrosProduct,
}) {
  return (
    <div className='tasks__card-add'>
      <button className='btn btn--xs' onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? 'Cancelar' : '+ Agregar'}
      </button>

      {showAdd && (
        <div className='tasks__card-add-form'>
          {isNameType ? (
            <div className='tasks__card-add-row'>
              <input className='field-input field-input--sm' type='text'
                placeholder='Nombre del producto sugerido…'
                value={suggestionName}
                onChange={(e) => setSuggestionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSuggestion()} autoFocus />
              <button className='btn btn--xs' disabled={!suggestionName.trim()}
                onClick={handleAddSuggestion}>OK</button>
            </div>
          ) : isTextBased ? (
            <div className='flex-col gap-6'>
              <div className='tasks__card-add-row'>
                <input className='field-input field-input--sm' type='text'
                  placeholder='¿Qué hay que hacer?'
                  value={otrosDesc}
                  onChange={(e) => setOtrosDesc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddOtros()} autoFocus />
                <button className='btn btn--xs' disabled={!otrosDesc.trim()}
                  onClick={handleAddOtros}>OK</button>
              </div>
              {!otrosLinkedProduct ? (
                <div className='flex-col gap-4'>
                  <SearchInput placeholder='Opcional: vincular producto…'
                    value={otrosSearch} onChange={(e) => setOtrosSearch(e.target.value)} />
                  {otrosSearch.trim() && (
                    <ul className='tasks__card-search-results'>
                      {otrosFiltered.slice(0, 8).map((p) => (
                        <li key={p._id}
                          className='tasks__card-search-item tasks__card-search-item--clickable'
                          onClick={() => handleLinkOtrosProduct(p)}>
                          <span className='tasks__card-link'>{p.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className='flex-items-center gap-6 text-sm'>
                  <span className='text-muted-light'>Producto:</span>
                  <Link to={`/products/${otrosLinkedProduct._id}`} className='text-primary'>
                    {otrosLinkedProduct.name}
                  </Link>
                  <button className='tasks__card-btn tasks__card-btn--remove btn--xs btn--icon'
                    onClick={() => setOtrosLinkedProduct(null)}>✕</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <SearchInput placeholder='Buscar producto…'
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {filtered.length > 0 && (
                <ul className='tasks__card-search-results'>
                  {filtered.slice(0, 10).map((p) => (
                    <li key={p._id}
                      className='tasks__card-search-item tasks__card-search-item--clickable'
                      onClick={() => handleToggleProduct(p._id)}>
                      <span className='tasks__card-link'>{p.name}</span>
                      <Link to={`/products/${p._id}`}
                        className='tasks__card-btn'
                        onClick={(e) => e.stopPropagation()}
                        title='Ver producto'>↗</Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
