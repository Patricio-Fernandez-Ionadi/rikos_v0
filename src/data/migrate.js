import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readCsv, parseRow } from './parseCsv.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

let _idCounter = 1
function nextId(prefix) {
  return `${prefix}-${_idCounter++}`
}

const PRESENTATION_PATTERNS = [
  { regex: /\s+x(\d+)\s*$/i, fmt: (m) => `x${m[1]}` },
  { regex: /\s+(\d+)g\s*$/i, fmt: (m) => `${m[1]}g` },
  { regex: /\s+(\d+)\s*gr\s*$/i, fmt: (m) => `${m[1]}g` },
  { regex: /\s+(\d+)cc\s*$/i, fmt: (m) => `${m[1]}cc` },
  { regex: /\s+(\d+)ml\s*$/i, fmt: (m) => `${m[1]}ml` },
]

function detectPresentationLabel(productName, grams) {
  for (const { regex, fmt } of PRESENTATION_PATTERNS) {
    const match = productName.match(regex)
    if (match) {
      return { baseName: productName.slice(0, match.index).trim(), label: fmt(match) }
    }
  }
  if (grams != null && grams > 0) {
    return { baseName: productName.trim(), label: `${grams}g` }
  }
  return { baseName: productName.trim(), label: 'Unidad' }
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\b(de|la|los|las|del|el|en|y|e)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findOrCreateProduct(productMap, category, baseName, costoUn) {
  const norm = normalizeName(baseName)

  for (const entry of productMap.values()) {
    if (entry.categoryId !== category._id) continue

    const entryNorm = normalizeName(entry.name)
    if (entryNorm === norm) return entry

    if (costoUn != null && entry.purchaseCost === costoUn) {
      if (entryNorm.includes(norm) || norm.includes(entryNorm)) {
        return entry
      }
    }
  }

  const product = {
    _id: nextId('prod'),
    categoryId: category._id,
    name: baseName,
    purchaseCost: null,
  }
  productMap.set(product._id, product)
  return product
}

function presentationKey(p) {
  return `${p.productId}::${p.grams ?? ''}::${p.margin ?? ''}::${p.salePrice ?? ''}`
}

export function migrate(rows) {
  const categoryMap = new Map()
  const productMap = new Map()
  const presentations = []
  const seenPres = new Set()
  let dupCount = 0

  let catIdCounter = 1

  function getCategory(rawCatId, name) {
    const key = name || `Sin categoría`
    if (categoryMap.has(key)) return categoryMap.get(key)

    const id = rawCatId
      ? `cat-${rawCatId}`
      : `cat-uncategorized-${catIdCounter++}`
    const cat = { _id: id, name: key || 'Sin categoría' }
    categoryMap.set(key, cat)
    return cat
  }

  for (const raw of rows) {
    const { catId, categoria, producto, costoUn, gr, margen, venta } = parseRow(raw)
    if (!producto) continue

    const category = getCategory(catId, categoria)
    const { baseName, label } = detectPresentationLabel(producto, gr)

    const product = findOrCreateProduct(productMap, category, baseName, costoUn)
    if (costoUn != null) {
      if (product.purchaseCost == null) {
        product.purchaseCost = costoUn
      }
    }

    const pres = {
      _id: nextId('pres'),
      productId: product._id,
      label,
      grams: gr,
      margin: margen,
      salePrice: venta,
    }

    const pkey = presentationKey(pres)
    if (seenPres.has(pkey)) {
      dupCount++
      continue
    }
    seenPres.add(pkey)
    presentations.push(pres)
  }

  if (dupCount > 0) {
    console.log(`Presentaciones duplicadas omitidas: ${dupCount}`)
  }

  return {
    categories: [...categoryMap.values()],
    products: [...productMap.values()],
    presentations,
  }
}

export function runMigration() {
  const { rows } = readCsv('productos-exel.csv')
  console.log(`Filas leídas: ${rows.length}`)

  const data = migrate(rows)

  console.log(`Categorías: ${data.categories.length}`)
  console.log(`Productos:  ${data.products.length}`)
  console.log(`Presentaciones: ${data.presentations.length}`)

  const outPath = resolve(__dirname, 'seed.json')
  writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`\nSeed generado: ${outPath}`)

  const merged = data.products.filter((p) => {
    const preses = data.presentations.filter((pr) => pr.productId === p._id)
    return preses.length > 1
  })
  if (merged.length > 0) {
    console.log(`\nProductos con múltiples presentaciones:`)
    for (const p of merged) {
      const preses = data.presentations.filter((pr) => pr.productId === p._id)
      console.log(`  ${p.name} (${preses.length} pres)`)
      for (const pr of preses) {
        console.log(`    → ${pr.label} | ${pr.grams != null ? pr.grams + 'g' : 'entero'} | margen ${pr.margin ?? '-'}% | venta $${pr.salePrice ?? '-'}`)
      }
    }
  }

  const sinCosto = data.products.filter((p) => p.purchaseCost == null)
  if (sinCosto.length > 0) {
    console.log(`\nProductos sin costo (${sinCosto.length}):`)
    for (const p of sinCosto) {
      const preses = data.presentations.filter((pr) => pr.productId === p._id)
      for (const pr of preses) {
        console.log(`  ${p.name} → ${pr.label} | margen ${pr.margin ?? '-'}% | venta $${pr.salePrice ?? '-'}`)
      }
    }
  }

  return data
}

runMigration()
