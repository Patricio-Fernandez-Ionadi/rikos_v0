import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SEED_PATH = resolve(__dirname, '../src/data/dev/seed.json')

const data = JSON.parse(readFileSync(SEED_PATH, 'utf-8'))

// ── Category classification ────────────────────────────────
const FRACTION_CATS = new Set(['cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-10'])

const isFraction = (catId) => FRACTION_CATS.has(catId)

// ── Add suppliers ──────────────────────────────────────────
const SUPPLIERS = [
  { name: 'Distribuidora Salud S.A.', contactName: 'Carlos López', phone: '011-4567-8901', email: 'carlos@distrisalud.com', notes: 'Entrega los martes. Especialidad: frutos secos, snacks.' },
  { name: 'Alimentos Naturales Srl', contactName: 'María García', phone: '011-4567-8902', email: 'maria@alimentosnat.com', notes: 'Amplia variedad de harinas, legumbres y cereales.' },
  { name: 'Proveedora de Especias', contactName: 'José Ramírez', phone: '011-4567-8903', email: 'jose@especiasprovee.com', notes: 'Especias orgánicas e importadas. Pago 30 días.' },
  { name: 'Granos del Sur', contactName: 'Ana Martínez', phone: '011-4567-8904', email: 'ana@granossur.com', notes: 'Legumbres, cereales y semillas a granel.' },
  { name: 'Dulce Hogar S.A.', contactName: 'Pedro Fernández', phone: '011-4567-8905', email: 'pedro@dulcehogar.com', notes: 'Alfajores, galletas, mermeladas y dulces.' },
  { name: 'Hierbas y Tés La Paz', contactName: 'Lucía Romero', phone: '011-4567-8906', email: 'lucia@la paztes.com', notes: 'Tés, infusiones y hierbas medicinales.' },
]

const suppliers = SUPPLIERS.map((s, i) => ({ _id: `sup-${i + 1}`, ...s }))
data.suppliers = suppliers

// ── Enrich products: saleType + stockGrams/stock ──────────
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(...args) {
  return args[Math.floor(Math.random() * args.length)]
}

const prodCosts = {} // productId -> [cost1, cost2, ...]

for (const prod of data.products) {
  const fraction = isFraction(prod.categoryId)
  prod.saleType = fraction ? 'fraction' : 'unit'

  if (fraction) {
    prod.stockGrams = pick(2000, 3000, 5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000)
  } else {
    prod.stockGrams = null
  }

  // Generate 1-2 supplier costs per product
  const numCosts = pick(1, 1, 2)
  const costs = []
  for (let c = 0; c < numCosts; c++) {
    const variation = pick(0.9, 0.92, 0.95, 0.97, 1.0, 1.03, 1.05, 1.08, 1.1)
    const cost = prod.purchaseCost != null ? Math.round(prod.purchaseCost * variation) : null
    if (cost != null) costs.push(cost)
  }
  if (costs.length > 0) prodCosts[prod._id] = costs
}

// ── Assign product-supplier links ──────────────────────────
const CAT_SUPPLIER_MAP = {
  'cat-1': [1, 2],         // Aceites y Vinagres -> Salud + Naturales
  'cat-2': [3, 2],         // Condimentos -> Especias + Naturales
  'cat-3': [1, 4],         // Frutos Secos -> Salud + Granos
  'cat-4': [2, 4],         // Cereales -> Naturales + Granos
  'cat-5': [2, 4],         // Harinas -> Naturales + Granos
  'cat-6': [1, 5],         // Snacks -> Salud + Dulce Hogar
  'cat-7': [5, 1],         // Galletas -> Dulce Hogar + Salud
  'cat-8': [5],            // Barras -> Dulce Hogar
  'cat-9': [6, 3],         // Infusiones -> La Paz + Especias
  'cat-10': [2, 5],        // Cacao -> Naturales + Dulce Hogar
  'cat-11': [1, 2],        // Funcionales -> Salud + Naturales
  'cat-12': [1],           // Sin clasificar -> Salud
  'cat-uncategorized-1': [1], // Sin categoría -> Salud
}

let psId = 1
const productSuppliers = []
for (const prod of data.products) {
  const costs = prodCosts[prod._id]
  if (!costs || costs.length === 0) continue

  const supIds = CAT_SUPPLIER_MAP[prod.categoryId] || [1]
  const assignedSup = new Set()

  for (let i = 0; i < costs.length && i < supIds.length; i++) {
    const supIdx = supIds[i]
    if (assignedSup.has(supIdx)) continue
    assignedSup.add(supIdx)
    productSuppliers.push({
      _id: `ps-${psId++}`,
      productId: prod._id,
      supplierId: `sup-${supIdx}`,
      purchaseCost: costs[i],
    })
  }
}

data.productSuppliers = productSuppliers

// ── Distribute stock on presentations (for unit products) ──
// For fraction products, stock is already set on the product (stockGrams)
// For unit products, distribute stock across presentations
for (const pres of data.presentations) {
  const prod = data.products.find((p) => p._id === pres.productId)
  if (!prod) continue
  if (prod.saleType === 'unit') {
    pres.stock = pick(3, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50)
  } else {
    // For fraction products, presentation stock is 0 (stockGrams on product)
    pres.stock = 0
  }
}

// ── Write back ─────────────────────────────────────────────
writeFileSync(SEED_PATH, JSON.stringify(data, null, 2) + '\n')
console.log(`✅  Seed data updated:`)
console.log(`   ${suppliers.length} suppliers`)
console.log(`   ${productSuppliers.length} product-supplier links`)
console.log(`   ${data.products.filter((p) => p.saleType === 'fraction').length} fractionable products (with stockGrams)`)
console.log(`   ${data.products.filter((p) => p.saleType === 'unit').length} unit products (with stock on presentations)`)
