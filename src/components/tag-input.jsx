import { useState } from 'react'
import { Modal } from './Modal.jsx'

export const TagInput = ({ tags = [], allTags = [], onAdd, onRemove, onCreate }) => {
  const [createOpen, setCreateOpen] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleCreate = () => {
    const trimmed = newTag.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setNewTag('')
    setCreateOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCreate()
    }
  }

  return (
    <div className='tag-input'>
      <div className='tag-input__chips'>
        {tags.map((tag) => (
          <span key={tag} className='badge badge--primary tag-input__chip'>
            {tag}
            <button
              type='button'
              className='tag-input__chip-remove'
              onClick={() => onRemove(tag)}
              aria-label={`Quitar etiqueta ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className='tag-input__existing'>
          {allTags.map((tag) => {
            const isSelected = tags.includes(tag)
            return (
              <button
                key={tag}
                type='button'
                className={`tag-input__existing-btn${isSelected ? ' tag-input__existing-btn--active' : ''}`}
                onClick={() => isSelected ? onRemove(tag) : onAdd(tag)}
              >
                {tag}
              </button>
            )
          })}
          <button
            type='button'
            className='tag-input__new-btn'
            onClick={() => setCreateOpen(true)}
            title='Crear nueva etiqueta'
          >
            +
          </button>
        </div>
      )}

      {allTags.length === 0 && (
        <button
          type='button'
          className='btn btn--sm btn--link'
          onClick={() => setCreateOpen(true)}
        >
          + Agregar etiqueta
        </button>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title='Nueva etiqueta'>
        <div className='tag-input__create-modal'>
          <input
            className='field-input'
            type='text'
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Nombre de la etiqueta…'
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              type='button'
              className='btn btn--primary'
              onClick={handleCreate}
              disabled={!newTag.trim()}
            >
              Crear
            </button>
            <button
              type='button'
              className='btn'
              onClick={() => setCreateOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
