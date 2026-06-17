import { useMenuManager } from '../modules/menu/menu-manager.js'
import { MenuControls } from '../modules/menu/components/menu-controls.jsx'
import { MenuPreview } from '../modules/menu/components/menu-preview.jsx'

export const MenuPage = () => {
  const {
    title, setTitle, showPrices, setShowPrices,
    searchTerm, setSearchTerm, searchResults,
    selectedIds, menuData, categories,
    togglePres, addCategory, removeCategory, addAllResults, clearAll,
  } = useMenuManager()

  return (
    <div className='menu-page'>
      <MenuControls
        title={title} setTitle={setTitle}
        showPrices={showPrices} setShowPrices={setShowPrices}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        searchResults={searchResults}
        selectedIds={selectedIds}
        categories={categories}
        togglePres={togglePres}
        addCategory={addCategory}
        removeCategory={removeCategory}
        addAllResults={addAllResults}
        clearAll={clearAll}
      />
      <MenuPreview title={title} menuData={menuData} showPrices={showPrices} />
    </div>
  )
}
