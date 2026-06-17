import mongoose from 'mongoose'

const presentationSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  label: { type: String, default: null },
  grams: { type: Number, default: null },
  salePrice: { type: Number, default: null },
  stock: { type: Number, default: 0 },
  code: { type: Number, default: null },
})

presentationSchema.index({ productId: 1 })
presentationSchema.index({ code: 1 }, { unique: true, sparse: true })

export default mongoose.model('Presentation', presentationSchema)
