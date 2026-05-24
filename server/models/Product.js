import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  purchaseCost: { type: Number, default: null },
})

productSchema.index({ categoryId: 1 })

export default mongoose.model('Product', productSchema)
