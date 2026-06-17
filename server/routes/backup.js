import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

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

    const filename = `rikos-backup-${new Date().toISOString().slice(0, 10)}.json`
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.json(data)
  } catch (e) { next(e) }
})

router.post('/restore', async (req, res, next) => {
  try {
    const db = mongoose.connection.db
    if (!db) return res.status(503).json({ error: 'Database not connected' })

    const data = req.body
    const names = Object.keys(data)

    for (const name of names) {
      await db.collection(name).deleteMany({})
      if (data[name].length > 0) {
        await db.collection(name).insertMany(data[name])
      }
    }

    res.json({ message: `Restauradas ${names.length} colecciones` })
  } catch (e) { next(e) }
})

export default router
