import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: { type: String, default: null },
  phone: { type: String, default: null },
  email: { type: String, default: null },
  notes: { type: String, default: '' },
})

export default mongoose.model('Supplier', supplierSchema)
