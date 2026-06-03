/**
 * Empty state placeholder with consistent styling.
 *
 * @param {Object}   props
 * @param {string}   props.message
 * @param {string}   [props.className]
 */
export const EmptyState = ({ message, className = '' }) => {
	return (
		<p className={`placeholder${className ? ` ${className}` : ''}`}>
			{message}
		</p>
	)
}
