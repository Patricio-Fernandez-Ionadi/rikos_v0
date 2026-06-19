import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
	type: { type: String, enum: ['sugerencia', 'bug', 'otro'], default: 'sugerencia' },
	text: { type: String, required: true },
	status: { type: String, enum: ['active', 'resolved', 'suppressed'], default: 'active' },
}, { timestamps: true })

noteSchema.index({ createdAt: -1 })

export default mongoose.model('Note', noteSchema)
