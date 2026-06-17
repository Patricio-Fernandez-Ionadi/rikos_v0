export const MenuControls = ({
  title, setTitle, showPrices, setShowPrices,
  searchTerm, setSearchTerm, searchResults,
  selectedIds, categories,
  togglePres, addCategory, removeCategory, addAllResults, clearAll,
}) => {
  const selectedCount = selectedIds.size

  return (
    <div className='menu-controls'>
      <label className='field-label'>Título del menú</label>
      <input className='field-input' type='text' value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className='field-label'>Buscar productos</label>
      <input className='field-input' type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Nombre, marca, código…' />
      {searchResults.length > 0 && (
        <div className='menu-controls__results'>
          {searchResults.map((item) => {
            const active = selectedIds.has(item._id)
            return (
              <div key={item._id} className={`menu-controls__result${active ? ' menu-controls__result--active' : ''}`} onClick={() => togglePres(item._id)}>
                <span className='menu-controls__result-name'>
                  {item.code != null && <span className='pres-code-sm'>{item.code}</span>}
                  {item.productName}
                  {item.label && <span className='menu-controls__result-label'> — {item.label}</span>}
                </span>
                <span className='menu-controls__result-check'>{active ? '✓' : '+'}</span>
              </div>
            )
          })}
          <button className='btn btn--xs' onClick={addAllResults}>Agregar todos</button>
        </div>
      )}

      <div className='menu-controls__cat-header'>
        <label className='field-label' style={{ margin: 0 }}>Categorías</label>
      </div>
      <div className='menu-controls__cats'>
        {categories.map((cat) => {
          return (
            <div key={cat._id} className='menu-controls__cat-row'>
              <span className='menu-controls__cat-name'>{cat.name}</span>
              <div className='menu-controls__cat-actions'>
                <button className='btn btn--xs' onClick={() => addCategory(cat._id)}
                  title='Agregar todos los productos de esta categoría'>
                  + todo
                </button>
                <button className='btn btn--xs' onClick={() => removeCategory(cat._id)}
                  title='Quitar todos los productos de esta categoría'>
                  - todo
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <label className='checkbox-row'>
        <input type='checkbox' checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
        Mostrar precios
      </label>

      <div className='menu-controls__actions'>
        <span className='menu-controls__count'>{selectedCount} item{selectedCount !== 1 ? 's' : ''}</span>
        {selectedCount > 0 && (
          <button className='btn btn--xs btn--danger' onClick={clearAll}>Limpiar</button>
        )}
      </div>

      <button className='btn btn--primary' onClick={() => window.print()} disabled={selectedCount === 0}>
        {selectedCount === 0 ? 'Sin items' : 'Imprimir / PDF'}
      </button>
    </div>
  )
}
