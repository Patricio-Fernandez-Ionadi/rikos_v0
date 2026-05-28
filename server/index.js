import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development'
dotenv.config({ path: path.resolve(__dirname, envFile) })

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import categoriesRouter from './routes/categories.js'
import productsRouter from './routes/products.js'
import presentationsRouter from './routes/presentations.js'
import shiftsRouter from './routes/shifts.js'
import notesRouter from './routes/notes.js'
import suppliersRouter from './routes/suppliers.js'
import productSuppliersRouter from './routes/product-suppliers.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/presentations', presentationsRouter)
app.use('/api/shifts', shiftsRouter)
app.use('/api/notes', notesRouter)
app.use('/api/suppliers', suppliersRouter)
app.use('/api/product-suppliers', productSuppliersRouter)

app.use((err, _req, res, _next) => {
	console.error(err)
	res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
	console.log(process.env.MONGODB_URI)
	const uri = process.env.MONGODB_URI
	if (!uri) {
		console.warn('MONGODB_URI not set — skipping DB connection')
		return
	}
	mongoose
		.connect(uri)
		.then(() => console.log('Connected to MongoDB'))
		.catch((err) => console.error('MongoDB connection error:', err.message))
})
