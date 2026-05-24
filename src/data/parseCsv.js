import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function parseNumber(raw) {
  if (raw == null) return null
  const str = String(raw).trim()
  if (str === '' || str === '-' || str === '$-') return null
  const cleaned = str
    .replace(/^\$/, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const n = parseFloat(cleaned)
  return isNaN(n) ? null : n
}

export function parseCsvLine(line) {
  const cols = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      cols.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  cols.push(current.trim())
  return cols
}

export function readCsv(filePath) {
  const fullPath = resolve(__dirname, filePath)
  const content = readFileSync(fullPath, 'utf-8')
  const lines = content.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length === 0) return { headers: [], rows: [] }

  const headers = parseCsvLine(lines[0])
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row
  })

  return { headers, rows }
}

export function parseRow(raw) {
  return {
    catId: raw['Cat ID'] ? parseInt(raw['Cat ID'], 10) : null,
    categoria: raw['Categoria'] || null,
    producto: raw['Producto'] || '',
    costoUn: parseNumber(raw['Costo Un.']),
    gr: parseNumber(raw['Gr']),
    margen: parseNumber(raw['Margen (%)']),
    venta: parseNumber(raw['venta']),
  }
}
