import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

const API_KEY = process.env.API_KEY
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN
const isProduction = process.env.NODE_ENV === 'production'

function checkAuth(req, res, next) {
  if (!isProduction) return next()

  const key = req.headers['x-api-key']
  const origin = req.headers.origin

  if (API_KEY && key === API_KEY) return next()
  if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) return next()

  return res.status(403).json({ error: 'Acceso no autorizado' })
}

router.use(checkAuth)

router.get('/export', async (req, res, next) => {
  try {
    const db = mongoose.connection.db
    if (!db) return res.status(503).json({ error: 'Database not connected' })

    const collections = await db.listCollections().toArray()
    const data = {}

    for (const { name } of collections) {
      if (name.startsWith('system.')) continue
      data[name] = await db.collection(name).find().toArray()
    }

    const payload = {
      _meta: {
        exportedAt: new Date().toISOString(),
        version: process.env.npm_package_version || '0.2.0',
        collections: Object.keys(data),
      },
      data,
    }

    const filename = `rikos-backup-${new Date().toISOString().slice(0, 10)}.json`
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.json(payload)
  } catch (e) { next(e) }
})

router.post('/restore', async (req, res, next) => {
  try {
    const db = mongoose.connection.db
    if (!db) return res.status(503).json({ error: 'Database not connected' })

    const body = req.body
    const collections = body._meta ? body.data : body
    const names = Object.keys(collections)

    for (const name of names) {
      const docs = collections[name]
      if (!Array.isArray(docs)) continue
      await db.collection(name).deleteMany({})
      if (docs.length > 0) {
        await db.collection(name).insertMany(docs)
      }
    }

    res.json({ message: `Restauradas ${names.length} colecciones` })
  } catch (e) { next(e) }
})

export default router