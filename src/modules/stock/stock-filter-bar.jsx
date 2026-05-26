/**
 * Filter bar for the stock page — toggles between all/stocked/low/empty.
 *
 * @param {Object}     props
 * @param {string}     props.filter   Current filter value
 * @param {Function}   props.onChange Callback receiving the new filter value
 */
export const StockFilterBar = ({ filter, onChange }) => {
	const options = [
		{ value: 'all', label: 'Todos' },
		{ value: 'stocked', label: 'Con stock' },
		{ value: 'low', label: 'Stock bajo' },
		{ value: 'empty', label: 'Sin stock' },
	]

	return (
		<div className='stock-page__toolbar'>
			<span style={{ color: '#8e8e8e', fontSize: '0.85em' }}>Filtrar:</span>
			{options.map((opt) => (
				<button
					key={opt.value}
					className={
						'sidebar__btn' +
						(filter === opt.value ? ' sidebar__btn--active' : '')
					}
					style={{
						width: 'auto',
						padding: '4px 10px',
						fontSize: '0.8em',
					}}
					onClick={() => onChange(opt.value)}
				>
					{opt.label}
				</button>
			))}
		</div>
	)
}
