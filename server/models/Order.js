import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  presentationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Presentation', default: null },
  presentationLabel: { type: String, default: null },
  presentationCode: { type: Number, default: null },
  quantity: { type: Number, required: true, min: 1 },
  unitCost: { type: Number, required: true },
  total: { type: Number, required: true },
  unitLabel: { type: String, default: '' },
})

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierName: { type: String, required: true },
  status: { type: String, enum: ['open', 'placed'], default: 'open' },
  items: [orderItemSchema],
  totalCost: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true })

orderSchema.index({ createdAt: -1 })
orderSchema.index({ status: 1 })

export default mongoose.model('Order', orderSchema)
