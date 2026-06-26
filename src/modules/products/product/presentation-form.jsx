import { useState, useMemo } from 'react'
import {
	getCostPerPresentation,
	getListPrice,
} from '../../../data/calculations.js'
import { FormActions } from '../../../components/form-actions.jsx'

export const PresentationForm = ({ initial, onSubmit, onCancel, product }) => {
	const isFraction = product?.saleType === 'fraction'
  const [label, setLabel] = useState(initial?.label ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
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
      description: description.trim(),
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

      <label className='field-label'>Descripción</label>
      <textarea className='field-input field-textarea' value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />

      <div className='text-sm text-muted-light mb-8'>
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
				<div className='flex-col gap-4 mt-8'>
					<span className='text-primary'>
						Precio de lista sugerido: ${listPrice.toLocaleString()}
					</span>
					{diffInfo && (
						<span className={diffInfo.diff >= 0 ? 'text-primary' : 'text-error'}>
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
