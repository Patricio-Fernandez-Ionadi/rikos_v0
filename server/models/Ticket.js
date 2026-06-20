import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
	type: { type: String, enum: ['sugerencia', 'bug', 'otro'], default: 'sugerencia' },
	text: { type: String, required: true },
	status: { type: String, enum: ['active', 'resolved'], default: 'active' },
	resolvedAt: { type: Date, default: null },
}, { timestamps: true })

ticketSchema.index({ createdAt: -1 })

export default mongoose.model('Ticket', ticketSchema)
