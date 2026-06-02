import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['falta-envasar', 'falta-stock', 'productos-sugeridos', 'faltan-etiquetas', 'otros'],
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  name: { type: String, default: '' },
  note: { type: String, default: '' },
}, { timestamps: true })

taskSchema.index({ type: 1 })

export default mongoose.model('Task', taskSchema)
