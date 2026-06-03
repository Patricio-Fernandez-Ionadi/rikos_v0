import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitCost: { type: Number, required: true },
  total: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierName: { type: String, required: true },
  items: [orderItemSchema],
  totalCost: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true })

orderSchema.index({ createdAt: -1 })

export default mongoose.model('Order', orderSchema)
