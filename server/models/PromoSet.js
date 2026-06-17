import mongoose from 'mongoose'

const promoItemSchema = new mongoose.Schema({
  presentationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Presentation', required: true },
  quantity: { type: Number, default: 1, min: 1 },
})

const promosetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
  items: [promoItemSchema],
})

promosetSchema.index({ active: 1 })

export default mongoose.model('PromoSet', promosetSchema)
