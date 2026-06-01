import mongoose from 'mongoose'

const presentationSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  label: { type: String, default: null },
  grams: { type: Number, default: null },
  salePrice: { type: Number, default: null },
  stock: { type: Number, default: 0 },
})

presentationSchema.index({ productId: 1 })

export default mongoose.model('Presentation', presentationSchema)
