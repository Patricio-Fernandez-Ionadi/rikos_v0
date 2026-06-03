import { Button } from '../../components/button.jsx'

/**
 * Filter bar for the stock page — presets + custom threshold.
 */
export const StockFilterBar = ({ filter, onChange, customType, onCustomTypeChange, customValue, onCustomValueChange }) => {
	const options = [
		{ value: 'all', label: 'Todos' },
		{ value: 'stocked', label: 'Con stock' },
		{ value: 'low', label: 'Stock bajo' },
		{ value: 'empty', label: 'Sin stock' },
		{ value: 'custom', label: 'Personalizado' },
	]

	return (
		<div className='stock-page__toolbar'>
			<span style={{ color: '#8e8e8e', fontSize: '0.85em' }}>Filtrar:</span>
			{options.map((opt) => (
				<Button
					key={opt.value}
					size='xs'
					active={filter === opt.value}
					onClick={() => onChange(opt.value)}
				>
					{opt.label}
				</Button>
			))}

			{filter === 'custom' && (
				<div style={{ display: 'inline-flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
					<select
						className='field-input field-input--xs'
						value={customType}
						onChange={(e) => onCustomTypeChange(e.target.value)}
						style={{ width: 50 }}
					>
						<option value='lt'>≤</option>
						<option value='gt'>≥</option>
					</select>
					<input
						className='field-input field-input--xs'
						type='number'
						min='1'
						value={customValue}
						onChange={(e) => onCustomValueChange(Math.max(1, parseInt(e.target.value) || 1))}
						style={{ width: 60 }}
					/>
					<span style={{ color: '#8e8e8e', fontSize: '0.8em' }}>
						unidades
					</span>
				</div>
			)}
		</div>
	)
}
