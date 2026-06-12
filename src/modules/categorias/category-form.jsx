import { useState } from 'react'
import { Button } from '../../components/button.jsx'

export const CategoryForm = ({ initial, onSubmit, onCancel }) => {
	const [name, setName] = useState(initial?.name ?? '')

	const handleSubmit = (e) => {
		e.preventDefault()
		if (!name.trim()) return
		onSubmit(name.trim())
	}

	return (
		<form onSubmit={handleSubmit}>
			<div style={{ marginBottom: 16 }}>
				<label className='field-label'>Nombre</label>
				<input className='field-input' type='text' value={name}
					onChange={(e) => setName(e.target.value)} autoFocus />
			</div>
			<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
				<Button type='button' onClick={onCancel}>Cancelar</Button>
				<Button type='submit' variant='primary' disabled={!name.trim()}>
					{initial ? 'Guardar cambios' : 'Crear categoria'}
				</Button>
			</div>
		</form>
	)
}
