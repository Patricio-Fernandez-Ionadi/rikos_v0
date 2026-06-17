import { useState, useRef } from 'react'
import { exportBackup, restoreBackup } from '../../data/api.js'
import { Modal } from '../../components/modal.jsx'

export const BackupSection = () => {
  const [restoring, setRestoring] = useState(false)
  const [restoreData, setRestoreData] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const handleExport = async () => {
    setLoading(true)
    try {
      const data = await exportBackup()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rikos-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Error al exportar backup: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        setRestoreData(data)
        setRestoring(true)
      } catch {
        alert('Archivo JSON inválido')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleRestore = async () => {
    if (!restoreData) return
    setLoading(true)
    try {
      await restoreBackup(restoreData)
      alert('Base de datos restaurada correctamente')
      setRestoring(false)
      setRestoreData(null)
    } catch (e) {
      alert('Error al restaurar: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='dashboard__card dashboard__card--backup'>
        <h3 className='dashboard__card-title'>Backup</h3>
        <p className='dashboard__card-desc'>Exportar o restaurar la base de datos</p>
        <div className='dashboard__backup-actions'>
          <button className='btn btn--primary' onClick={handleExport} disabled={loading}>
            {loading ? 'Exportando…' : 'Descargar Backup'}
          </button>
          <button className='btn btn--danger' onClick={() => fileRef.current?.click()} disabled={loading}>
            Restaurar Backup
          </button>
          <input ref={fileRef} type='file' accept='.json' style={{ display: 'none' }} onChange={handleFileSelect} />
        </div>
      </div>

      <Modal open={restoring} onClose={() => { setRestoring(false); setRestoreData(null) }}>
        <div style={{ maxWidth: 480 }}>
          <h3>Restaurar Backup</h3>
          <p style={{ margin: '12px 0', color: '#ffa726' }}>
            Esta acción reemplazará TODOS los datos actuales.
            Escribí <strong>CONFIRMAR</strong> para continuar.
          </p>
          <ConfirmRestore onConfirm={handleRestore} onCancel={() => { setRestoring(false); setRestoreData(null) }} loading={loading} />
        </div>
      </Modal>
    </>
  )
}

function ConfirmRestore({ onConfirm, onCancel, loading }) {
  const [input, setInput] = useState('')
  const confirmed = input === 'CONFIRMAR'

  return (
    <div className='form-actions'>
      <input
        className='field-input'
        placeholder='Escribí CONFIRMAR'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className='btn' onClick={onCancel} disabled={loading}>Cancelar</button>
        <button className='btn btn--danger' onClick={onConfirm} disabled={!confirmed || loading}>
          {loading ? 'Restaurando…' : 'Restaurar'}
        </button>
      </div>
    </div>
  )
}
