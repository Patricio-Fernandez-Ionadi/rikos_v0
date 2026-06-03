import 'dotenv/config'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Category from './models/Category.js'
import Product from './models/Product.js'
import Presentation from './models/Presentation.js'
import Supplier from './models/Supplier.js'
import ProductSupplier from './models/ProductSupplier.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const data = JSON.parse(readFileSync(resolve(__dirname, '../src/data/dev/seed.json'), 'utf-8'))

  await Category.deleteMany({})
  await Product.deleteMany({})
  await Presentation.deleteMany({})
  await Supplier.deleteMany({})
  await ProductSupplier.deleteMany({})

  const catMap = {}
  for (const c of data.categories) {
    const { _id, ...rest } = c
    const saved = await Category.create(rest)
    catMap[_id] = saved._id
  }
  console.log(`Seeded ${data.categories.length} categories`)

  const prodMap = {}
  for (const p of data.products) {
    const { _id, categoryId, saleType, stockGrams, ...rest } = p
    const saved = await Product.create({
      ...rest,
      margin: p.margin ?? null,
      saleType: saleType ?? 'unit',
      stockGrams: stockGrams ?? null,
      categoryId: catMap[categoryId],
    })
    prodMap[_id] = saved._id
  }
  console.log(`Seeded ${data.products.length} products`)

  for (const p of data.presentations) {
    const { _id, productId, margin, ...rest } = p
    await Presentation.create({ ...rest, productId: prodMap[productId], stock: 0 })
  }
  console.log(`Seeded ${data.presentations.length} presentations`)

  if (data.suppliers) {
    const supMap = {}
    for (const s of data.suppliers) {
      const { _id, ...rest } = s
      const saved = await Supplier.create(rest)
      supMap[_id] = saved._id
    }
    console.log(`Seeded ${data.suppliers.length} suppliers`)

    if (data.productSuppliers) {
      for (const ps of data.productSuppliers) {
        const { _id, productId, supplierId, ...rest } = ps
        await ProductSupplier.create({
          ...rest,
          productId: prodMap[productId],
          supplierId: supMap[supplierId],
        })
      }
      console.log(`Seeded ${data.productSuppliers.length} product-supplier links`)
    }
  }

  await mongoose.disconnect()
  console.log('Done')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
