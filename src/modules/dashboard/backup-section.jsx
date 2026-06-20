import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { exportBackup, restoreBackup } from '../../data/api.js'
import { Modal } from '../../components/Modal.jsx'

function buildProductRows(data) {
  const products = data?.products ?? []
  const presentations = data?.presentations ?? []
  const categories = data?.categories ?? []
  const suppliers = data?.suppliers ?? []
  const productSuppliers = data?.productsuppliers ?? []

  const catMap = {}
  for (const c of categories) catMap[c._id] = c.name

  const psByProduct = {}
  for (const ps of productSuppliers) {
    if (!psByProduct[ps.productId]) psByProduct[ps.productId] = []
    psByProduct[ps.productId].push(ps)
  }

  const presByProduct = {}
  for (const p of presentations) {
    if (!presByProduct[p.productId]) presByProduct[p.productId] = []
    presByProduct[p.productId].push(p)
  }

  const supMap = {}
  for (const s of suppliers) supMap[s._id] = s.name

  const rows = []

  for (const product of products) {
    const presList = presByProduct[product._id]
    if (!presList || presList.length === 0) continue

    const pss = psByProduct[product._id] ?? []
    const activePs = pss.find((ps) => ps.purchaseCost === product.purchaseCost)
    const activeSupName = activePs ? supMap[activePs.supplierId] ?? '' : ''
    const activeCost = activePs?.purchaseCost ?? ''
    const activeUnitLabel = activePs?.supplierUnitLabel ?? ''

    for (const pres of presList) {
      rows.push({
        Producto: product.name,
        Categoría: catMap[product.categoryId] ?? '',
        Marca: product.marca ?? '',
        Presentación: pres.label ?? '',
        Código: pres.code ?? '',
        'Precio Venta': pres.salePrice ?? '',
        Stock: pres.stock ?? 0,
        'Proveedor Activo': activeSupName,
        'Costo Compra': activeCost,
        'Unidad Proveedor': activeUnitLabel,
      })
    }
  }

  return rows
}

export const BackupSection = () => {
  const [restoring, setRestoring] = useState(false)
  const [restoreData, setRestoreData] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const handleExport = async () => {
    setLoading(true)
    try {
      const raw = await exportBackup()
      const blob = new Blob([JSON.stringify(raw, null, 2)], { type: 'application/json' })
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

  const handleExportExcel = async () => {
    setLoading(true)
    try {
      const raw = await exportBackup()
      const data = raw._meta ? raw.data : raw
      const rows = buildProductRows(data)
      const ws = XLSX.utils.json_to_sheet(rows)

      const colWidths = [
        { wch: 30 }, { wch: 16 }, { wch: 14 },
        { wch: 18 }, { wch: 8 }, { wch: 12 },
        { wch: 8 }, { wch: 20 }, { wch: 12 }, { wch: 16 },
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
          <button className='btn' onClick={handleExportExcel} disabled={loading}>
            {loading ? 'Exportando…' : 'Excel Productos'}
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