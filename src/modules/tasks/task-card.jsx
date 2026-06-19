import { TaskCardItem } from './task-card-item.jsx'
import { TaskCardAddForm } from './task-card-add-form.jsx'

export const TaskCard = ({
  group,
  showAdd, setShowAdd,
  expanded, setExpanded,
  editingNoteId, noteValue, setNoteValue,
  searchTerm, setSearchTerm,
  suggestionName, setSuggestionName,
  otrosDesc, setOtrosDesc,
  otrosSearch, setOtrosSearch,
  otrosLinkedProduct, setOtrosLinkedProduct,
  filtered, otrosFiltered, total, visibleItems, hiddenCount,
  isNameType, isTextBased,
  handleToggleProduct,
  handleAddSuggestion,
  handleAddOtros,
  handleNoteClick,
  handleNoteSave,
  handleNoteKeyDown,
  handleLinkOtrosProduct,
  getProduct,
  getProductPresentations,
  handleTogglePres,
  removeTask,
}) => {
  return (
    <div className='tasks__card'>
      <div className='tasks__card-header'>
        <span className={`tasks__card-icon material-icons tasks__card-icon--${group.key}`}>{group.icon}</span>
        <div>
          <h3 className='tasks__card-title'>{group.title}</h3>
          <p className='tasks__card-desc'>{group.desc}</p>
        </div>
        <span className='tasks__card-count'>{total}</span>
      </div>

      <TaskCardAddForm
        showAdd={showAdd} setShowAdd={setShowAdd}
        isNameType={isNameType} isTextBased={isTextBased}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        filtered={filtered}
        suggestionName={suggestionName} setSuggestionName={setSuggestionName}
        otrosDesc={otrosDesc} setOtrosDesc={setOtrosDesc}
        otrosSearch={otrosSearch} setOtrosSearch={setOtrosSearch}
        otrosLinkedProduct={otrosLinkedProduct} setOtrosLinkedProduct={setOtrosLinkedProduct}
        otrosFiltered={otrosFiltered}
        handleToggleProduct={handleToggleProduct}
        handleAddSuggestion={handleAddSuggestion}
        handleAddOtros={handleAddOtros}
        handleLinkOtrosProduct={handleLinkOtrosProduct}
      />

      <ul className='tasks__card-list'>
        {total === 0 && (
          <li className='tasks__card-item tasks__card-item--empty'>
            No hay elementos en esta tarea
          </li>
        )}
        {visibleItems.map((item, i) => (
          <TaskCardItem
            key={item._id ?? i}
            task={item}
            isNameType={isNameType} isTextBased={isTextBased}
            groupKey={group.key}
            getProduct={getProduct}
            getProductPresentations={getProductPresentations}
            editingNoteId={editingNoteId} noteValue={noteValue}
            setNoteValue={setNoteValue}
            handleNoteSave={handleNoteSave}
            handleNoteKeyDown={handleNoteKeyDown}
            handleNoteClick={handleNoteClick}
            handleTogglePres={handleTogglePres}
            removeTask={removeTask}
          />
        ))}
      </ul>

      {total > 3 && (
        <div className='tasks__card-more'>
          <button className='tasks__card-more-btn' onClick={() => setExpanded(!expanded)}>
            {expanded
              ? '▲ Mostrar menos'
              : `▼ Ver ${hiddenCount} más...`}
          </button>
        </div>
      )}
    </div>
  )
}
