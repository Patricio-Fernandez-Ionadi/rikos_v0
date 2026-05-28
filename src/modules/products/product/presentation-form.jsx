import { useState, useMemo } from 'react'
import {
	getCostPerPresentation,
	getListPrice,
} from '../../../data/calculations.js'

export const PresentationForm = ({ initial, onSubmit, onCancel, product }) => {
	const isFraction = product?.saleType === 'fraction'
	const [label, setLabel] = useState(initial?.label ?? '')
	const [grams, setGrams] = useState(initial?.grams ?? '')
	const [margin, setMargin] = useState(initial?.margin ?? '')
	const [salePrice, setSalePrice] = useState(initial?.salePrice ?? '')

	const listPrice = useMemo(() => {
		const g = isFraction ? (grams === '' ? null : parseInt(grams)) : null
		const m = margin === '' ? null : parseInt(margin)
		if (product?.purchaseCost == null) return null
		if (isFraction && g == null) return null
		const cost = isFraction
			? getCostPerPresentation(product.purchaseCost, g)
			: product.purchaseCost
		return getListPrice(cost, m)
	}, [product?.purchaseCost, isFraction, grams, margin])

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit({
			label: label.trim() || null,
			grams: grams === '' ? null : parseInt(grams),
			margin: margin === '' ? null : parseInt(margin),
			salePrice: salePrice === '' ? null : parseFloat(salePrice),
		})
	}

	return (
		<form className='product-form' onSubmit={handleSubmit}>
			<label className='field-label'>
				Etiqueta (ej: &quot;200g&quot;, &quot;Unidad&quot;)
			</label>
			<input
				className='field-input'
				type='text'
				value={label}
				onChange={(e) => setLabel(e.target.value)}
				autoFocus
			/>

			{isFraction && (
				<>
					<label className='field-label'>Gramos (requerido)</label>
					<input
						className='field-input'
						type='number'
						value={grams}
						onChange={(e) => setGrams(e.target.value)}
					/>
				</>
			)}

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

			{listPrice != null && (
				<p style={{ color: '#9db683', fontSize: '0.9em', marginTop: '8px' }}>
					Precio de lista sugerido: ${listPrice.toLocaleString()}
				</p>
			)}

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
