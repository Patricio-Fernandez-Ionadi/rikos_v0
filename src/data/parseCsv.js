import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Parses an Argentine-format number string (e.g. "$5.500,50") into a float.
 * Handles leading dollar signs, thousand separators (dots), and comma decimals.
 */
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

/**
 * Splits a CSV line into columns, respecting double-quote escaping.
 */
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

/**
 * Reads a CSV file (relative to this file's directory) and returns
 * an object with headers and an array of row objects keyed by header.
 */
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

/**
 * Extracts typed fields from a raw CSV row for the Rikos product schema.
 * Column naming matches the original "productos-exel.csv" file.
 */
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
