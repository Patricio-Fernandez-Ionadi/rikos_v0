import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { exportBackup, restoreBackup } from '../../data/api.js'
import { Modal } from '../../components/Modal.jsx'

const SCOPES = [
  { key: 'completo', label: 'Completo' },
  { key: 'productos', label: 'Productos' },
  { key: 'transacciones', label: 'Transacciones' },
  { key: 'notas-tareas', label: 'Notas y Tareas' },
]

function buildProductRows(data) {
  const products = data?.products ?? []
  const presentations = data?.presentations ?? []

  const presByProduct = {}
  for (const p of presentations) {
    if (!presByProduct[p.productId]) presByProduct[p.productId] = []
    presByProduct[p.productId].push(p)
  }

  const rows = []
  for (const product of products) {
    const presList = presByProduct[product._id]
    if (!presList || presList.length === 0) continue
    for (const pres of presList) {
      rows.push({
        Producto: product.name,
        'Precio de Compra': product.purchaseCost ?? '',
        Margen: product.margin ?? '',
        Presentación: pres.label ?? '',
        'Precio de Venta': pres.salePrice ?? '',
      })
    }
  }
  return rows
}

export const BackupSection = () => {
  const [restoring, setRestoring] = useState(false)
  const [restoreData, setRestoreData] = useState(null)
  const [exportLoading, setExportLoading] = useState(null)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const fileRef = useRef(null)

  const handleExport = async (scope) => {
    setExportLoading(scope)
    try {
      const raw = await exportBackup(scope)
      const blob = new Blob([JSON.stringify(raw, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rikos-${scope}-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Error al exportar: ' + e.message)
    } finally {
      setExportLoading(null)
    }
  }

  const handleExportExcel = async () => {
    setExportLoading('excel')
    try {
      const raw = await exportBackup('completo')
      const data = raw._meta ? raw.data : raw
      const rows = buildProductRows(data)
      const ws = XLSX.utils.json_to_sheet(rows)

      const colWidths = [
        { wch: 30 }, { wch: 14 }, { wch: 10 },
        { wch: 18 }, { wch: 12 },
      ]
      ws['!cols'] = colWidths

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Productos')
      const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rikos-productos-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Error al exportar Excel: ' + e.message)
    } finally {
      setExportLoading(null)
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
    setRestoreLoading(true)
    try {
      await restoreBackup(restoreData)
      alert('Base de datos restaurada correctamente')
      setRestoring(false)
      setRestoreData(null)
    } catch (e) {
      alert('Error al restaurar: ' + e.message)
    } finally {
      setRestoreLoading(false)
    }
  }

  const isLoading = exportLoading !== null

  return (
    <>
      <div className='dashboard__card dashboard__card--backup'>
        <h3 className='dashboard__card-title'>Backup</h3>

        <div className='backup__group'>
          <span className='backup__group-label'>Exportar</span>
          <div className='backup__actions'>
            {SCOPES.map((s) => (
              <button
                key={s.key}
                className='btn'
                onClick={() => handleExport(s.key)}
                disabled={isLoading}
              >
                {exportLoading === s.key ? 'Exportando…' : s.label}
              </button>
            ))}
            <button
              className='btn'
              onClick={handleExportExcel}
              disabled={isLoading}
            >
              {exportLoading === 'excel' ? 'Exportando…' : 'Excel Productos'}
            </button>
          </div>
        </div>

        <div className='backup__group'>
          <span className='backup__group-label'>Importar</span>
          <div className='backup__actions'>
            <button className='btn btn--danger' onClick={() => fileRef.current?.click()} disabled={isLoading}>
              Restaurar Backup
            </button>
            <input ref={fileRef} type='file' accept='.json' style={{ display: 'none' }} onChange={handleFileSelect} />
          </div>
        </div>
      </div>

      <Modal open={restoring} onClose={() => { setRestoring(false); setRestoreData(null) }}>
        <div style={{ maxWidth: 480 }}>
          <h3>Restaurar Backup</h3>
          <p style={{ margin: '12px 0', color: '#ffa726' }}>
            Esta acción reemplazará los datos según el alcance del archivo.
            Escribí <strong>CONFIRMAR</strong> para continuar.
          </p>
          <ConfirmRestore onConfirm={handleRestore} onCancel={() => { setRestoring(false); setRestoreData(null) }} loading={restoreLoading} />
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