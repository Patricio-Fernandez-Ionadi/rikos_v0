import mongoose from 'mongoose'

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  presentationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Presentation', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  collectedAmount: { type: Number, default: null },
  paymentMethod: { type: String, enum: ['cash', 'electronic'], default: 'cash' },
  ticketId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
})

const shiftSchema = new mongoose.Schema({
  openingTime: { type: Date, required: true },
  closingTime: { type: Date, default: null },
  openingCash: { type: Number, required: true },
  closingCash: { type: Number, default: null },
  expectedBalance: { type: Number, default: null },
  difference: { type: Number, default: null },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  notes: { type: String, default: '' },
  sales: [saleItemSchema],
})

export default mongoose.model('Shift', shiftSchema)
