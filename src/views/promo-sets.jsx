import { useState } from 'react'
import { usePromoSetsManager } from '../modules/promo-sets/promo-sets-manager.js'
import { PromoSetList } from '../modules/promo-sets/components/promo-set-list.jsx'
import { PromoSetForm } from '../modules/promo-sets/components/promo-set-form.jsx'
import { Modal } from '../components/modal.jsx'
import { ConfirmDialog } from '../components/confirm-dialog.jsx'

export const PromoSetsPage = () => {
  const { promoSets, loading, create, update, remove, toggleActive } = usePromoSetsManager()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleCreate = async (data) => {
    await create(data)
    setFormOpen(false)
  }

  const handleEdit = (set) => {
    setEditing(set)
    setFormOpen(true)
  }

  const handleUpdate = async (data) => {
    await update(editing._id, data)
    setFormOpen(false)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await remove(deleteId)
    setDeleteId(null)
  }

  return (
    <div className='promo-sets-page'>
      <div className='flex-row gap-12 mb-16'>
        <h2 className='dashboard__title' style={{ flex: 1, margin: 0 }}>Promociones</h2>
        <button className='btn btn--primary' onClick={() => { setEditing(null); setFormOpen(true) }}>
          Nueva promoción
        </button>
      </div>

      {loading ? (
        <p className='placeholder'>Cargando…</p>
      ) : (
        <PromoSetList
          promoSets={promoSets}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteId(id)}
          onToggleActive={toggleActive}
        />
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }}>
        <div style={{ maxWidth: 520 }}>
          <h3>{editing ? 'Editar promoción' : 'Nueva promoción'}</h3>
          <PromoSetForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setFormOpen(false); setEditing(null) }}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteId != null}
        title='Eliminar promoción'
        message='¿Estás seguro? Esta acción no se puede deshacer.'
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
