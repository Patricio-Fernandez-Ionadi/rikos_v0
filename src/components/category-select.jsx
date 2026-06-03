/**
 * Reusable category <select> with consistent styling.
 *
 * @param {Object}   props
 * @param {Array}    props.categories         Array of { _id, name } objects
 * @param {string}   props.value              Selected category ID
 * @param {Function} props.onChange           (value: string) => void
 * @param {string}   [props.placeholder='Todas las categorías']
 * @param {boolean}  [props.allowEmpty=true]  Whether to show the "all" option
 * @param {string}   [props.className='field-input']
 */
export const CategorySelect = ({
	categories,
	value,
	onChange,
	placeholder = 'Todas las categorías',
	allowEmpty = true,
	className = 'field-input',
}) => {
	return (
		<select
			className={className}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		>
			{allowEmpty && <option value=''>{placeholder}</option>}
			{categories?.map((cat) => (
				<option key={cat._id} value={cat._id}>
					{cat.name}
				</option>
			))}
		</select>
	)
}
