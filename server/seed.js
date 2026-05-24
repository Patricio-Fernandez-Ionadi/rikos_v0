import 'dotenv/config'
import mongoose from 'mongoose'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Category from './models/Category.js'
import Product from './models/Product.js'
import Presentation from './models/Presentation.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const data = JSON.parse(readFileSync(resolve(__dirname, '../src/data/seed.json'), 'utf-8'))

  await Category.deleteMany({})
  await Product.deleteMany({})
  await Presentation.deleteMany({})

  const catMap = {}
  for (const c of data.categories) {
    const { _id, ...rest } = c
    const saved = await Category.create(rest)
    catMap[_id] = saved._id
  }
  console.log(`Seeded ${data.categories.length} categories`)

  const prodMap = {}
  for (const p of data.products) {
    const { _id, categoryId, ...rest } = p
    const saved = await Product.create({ ...rest, categoryId: catMap[categoryId] })
    prodMap[_id] = saved._id
  }
  console.log(`Seeded ${data.products.length} products`)

  for (const p of data.presentations) {
    const { _id, productId, ...rest } = p
    await Presentation.create({ ...rest, productId: prodMap[productId], stock: 0 })
  }
  console.log(`Seeded ${data.presentations.length} presentations`)

  await mongoose.disconnect()
  console.log('Done')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
