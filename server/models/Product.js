import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  purchaseCost: { type: Number, default: null },
  margin: { type: Number, default: null },
  saleType: { type: String, enum: ['unit', 'fraction'], default: 'unit' },
  stockGrams: { type: Number, default: null },
  marca: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

productSchema.index({ categoryId: 1 })

export default mongoose.model('Product', productSchema)
