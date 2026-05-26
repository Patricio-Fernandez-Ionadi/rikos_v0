import { useState } from 'react'

export const PresentationForm = ({ initial, onSubmit, onCancel }) => {
	const [label, setLabel] = useState(initial?.label ?? '')
	const [grams, setGrams] = useState(initial?.grams ?? '')
	const [margin, setMargin] = useState(initial?.margin ?? '')
	const [salePrice, setSalePrice] = useState(initial?.salePrice ?? '')
	const [stock, setStock] = useState(initial?.stock ?? 0)

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit({
			label: label.trim() || null,
			grams: grams === '' ? null : parseInt(grams),
			margin: margin === '' ? null : parseInt(margin),
			salePrice: salePrice === '' ? null : parseFloat(salePrice),
			stock: parseInt(stock) || 0,
		})
	}

	return (
		<form className='product-form' onSubmit={handleSubmit}>
			<label className='field-label'>Etiqueta (ej: &quot;200g&quot;, &quot;Unidad&quot;)</label>
			<input
				className='field-input'
				type='text'
				value={label}
				onChange={(e) => setLabel(e.target.value)}
				autoFocus
			/>

			<label className='field-label'>Gramos</label>
			<input
				className='field-input'
				type='number'
				value={grams}
				onChange={(e) => setGrams(e.target.value)}
			/>

			<label className='field-label'>Margen (%)</label>
			<input
				className='field-input'
				type='number'
				value={margin}
				onChange={(e) => setMargin(e.target.value)}
			/>

			<label className='field-label'>Precio de venta ($)</label>
			<input
				className='field-input'
				type='number'
				value={salePrice}
				onChange={(e) => setSalePrice(e.target.value)}
			/>

			<label className='field-label'>Stock inicial</label>
			<input
				className='field-input'
				type='number'
				value={stock}
				onChange={(e) => setStock(e.target.value)}
			/>

			<div className='modal-actions'>
				<button type='button' className='shift-bar__btn' onClick={onCancel}>
					Cancelar
				</button>
				<button
					type='submit'
					className='shift-bar__btn shift-bar__btn--primary'
				>
					{initial ? 'Guardar cambios' : 'Crear presentación'}
				</button>
			</div>
		</form>
	)
}
