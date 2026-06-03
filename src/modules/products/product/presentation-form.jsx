import { useState, useMemo } from 'react'
import {
	getCostPerPresentation,
	getListPrice,
} from '../../../data/calculations.js'
import { FormActions } from '../../../components/form-actions.jsx'

export const PresentationForm = ({ initial, onSubmit, onCancel, product }) => {
	const isFraction = product?.saleType === 'fraction'
	const [label, setLabel] = useState(initial?.label ?? '')
	const [grams, setGrams] = useState(initial?.grams ?? '')
	const [salePrice, setSalePrice] = useState(initial?.salePrice ?? '')
	const [stock, setStock] = useState(initial?.stock ?? '')

	const listPrice = useMemo(() => {
		const g = isFraction ? (grams === '' ? null : parseInt(grams)) : null
		if (product?.purchaseCost == null) return null
		if (isFraction && g == null) return null
		const cost = isFraction
			? getCostPerPresentation(product.purchaseCost, g)
			: product.purchaseCost
		return getListPrice(cost, product.margin)
	}, [product?.purchaseCost, product.margin, isFraction, grams])

	const diffInfo = useMemo(() => {
		if (listPrice == null || salePrice === '') return null
		const sp = parseFloat(salePrice)
		if (isNaN(sp)) return null
		const diff = sp - listPrice
		const pct = listPrice !== 0 ? (diff / listPrice) * 100 : null
		return { diff, pct }
	}, [listPrice, salePrice])

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit({
			label: label.trim() || null,
			grams: grams === '' ? null : parseInt(grams),
			salePrice: salePrice === '' ? null : parseFloat(salePrice),
			stock: stock === '' ? 0 : parseInt(stock),
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

			<div style={{ fontSize: '0.85em', color: '#8e8e8e', marginBottom: 8 }}>
				Margen del producto: {product.margin != null ? `${product.margin}%` : 'No asignado'}
			</div>

			<label className='field-label'>Stock inicial</label>
			<input
				className='field-input'
				type='number'
				value={stock}
				onChange={(e) => setStock(e.target.value)}
			/>

			<label className='field-label'>Precio de venta ($)</label>
			<input
				className='field-input'
				type='number'
				value={salePrice}
				onChange={(e) => setSalePrice(e.target.value)}
			/>

			{listPrice != null && (
				<div style={{ fontSize: '0.9em', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
					<span style={{ color: '#9db683' }}>
						Precio de lista sugerido: ${listPrice.toLocaleString()}
					</span>
					{diffInfo && (
						<span style={{ color: diffInfo.diff >= 0 ? '#9db683' : '#e57373' }}>
							Diferencia: ${diffInfo.diff.toLocaleString()} ({diffInfo.pct?.toFixed(1) ?? '?'}%)
						</span>
					)}
				</div>
			)}

			<FormActions
				onCancel={onCancel}
				submitLabel={initial ? 'Guardar cambios' : 'Crear presentación'}
			/>
		</form>
	)
}
