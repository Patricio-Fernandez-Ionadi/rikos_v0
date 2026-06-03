/**
 * Reusable data table with consistent wrapper and structure.
 * Table variant is exposed via `variant` prop for different table styles
 * (e.g. 'stock-page', 'dashboard', 'shifts-page').
 *
 * @param {Object}   props
 * @param {string}   [props.variant='']       Class prefix for table/wrapper (e.g. 'stock-page', 'dashboard')
 * @param {Array}    props.columns             Array of { key, label, className? } for <th> elements
 * @param {Array}    props.rows                Array of row data objects
 * @param {Function} props.renderRow           (row, index) => <tr>...</tr>
 * @param {string}   [props.emptyMessage='No hay datos']
 * @param {string}   [props.className]
 */
export const DataTable = ({
	variant = '',
	columns,
	rows,
	renderRow,
	emptyMessage = 'No hay datos',
	className = '',
}) => {
	const prefix = variant ? `${variant}__` : ''

	if (rows.length === 0) {
		return <p className='placeholder' style={{ textAlign: 'center', padding: '40px', color: '#616161' }}>{emptyMessage}</p>
	}

	return (
		<div className={`${prefix}table-wrap${className ? ` ${className}` : ''}`}>
			<table className={`${prefix}table`}>
				<thead>
					<tr>
						{columns.map((col) => (
							<th key={col.key} className={col.className ?? ''}>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => renderRow(row, i))}
				</tbody>
			</table>
		</div>
	)
}
