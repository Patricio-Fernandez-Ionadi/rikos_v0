import { TaskCardItem } from './task-card-item.jsx'
import { TaskCardAddForm } from './task-card-add-form.jsx'
import { Modal } from '../../components/Modal.jsx'

export const TaskCard = ({
  group,
  showAdd, setShowAdd,
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
  markTaskStatus,
  modalOpen, setModalOpen, modalTab, setModalTab,
  pendingItems, viewedItems,
}) => {
  const modalTabItems = modalTab === 'pending' ? pendingItems : viewedItems

  return (
    <div className='tasks__card'>
      <div className='tasks__card-header' onClick={() => setModalOpen(true)} style={{ cursor: 'pointer' }}>
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
            markTaskStatus={markTaskStatus}
          />
        ))}
      </ul>

      {pendingItems.length > 3 && (
        <div className='tasks__card-more'>
          <button className='tasks__card-more-btn' onClick={() => setModalOpen(true)}>
            ▼ Ver {hiddenCount} más...
          </button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ minWidth: 360, maxWidth: 560 }}>
          <h3 className='tasks__modal-title'>{group.title}</h3>
          <p className='tasks__modal-desc'>{group.desc}</p>

          <div className='tasks__modal-tabs'>
            <button
              className={`tasks__modal-tab${modalTab === 'pending' ? ' tasks__modal-tab--active' : ''}`}
              onClick={() => setModalTab('pending')}
              type='button'
            >
              Pendientes
              <span className='tasks__modal-tab-count'>{pendingItems.length}</span>
            </button>
            <button
              className={`tasks__modal-tab${modalTab === 'viewed' ? ' tasks__modal-tab--active' : ''}`}
              onClick={() => setModalTab('viewed')}
              type='button'
            >
              Visto
              <span className='tasks__modal-tab-count'>{viewedItems.length}</span>
            </button>
          </div>

          <ul className='tasks__card-list'>
            {modalTabItems.length === 0 && (
              <li className='tasks__card-item tasks__card-item--empty'>
                No hay elementos {modalTab === 'pending' ? 'pendientes' : 'vistos'}
              </li>
            )}
            {modalTabItems.map((item, i) => (
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
                markTaskStatus={markTaskStatus}
              />
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  )
}
