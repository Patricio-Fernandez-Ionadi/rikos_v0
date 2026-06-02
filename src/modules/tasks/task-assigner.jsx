import { TASK_GROUPS } from './tasks-manager.js'

/**
 * Displays task categories as checkboxes for a single product.
 *
 * @param {Object}     props
 * @param {string}     props.productId
 * @param {Function}   props.getProductTaskCategories  (productId) => string[]
 * @param {Function}   props.toggleProductTask          (category, productId) => void
 * @param {string}     [props.className]                Extra class for the wrapper
 * @param {boolean}    [props.compact]                  Smaller layout for inline use
 */
export const TaskAssigner = ({
	productId,
	getProductTaskCategories,
	toggleProductTask,
	className = '',
	compact = false,
}) => {
	const assigned = getProductTaskCategories(productId)

	return (
		<div className={`task-assigner ${className} ${compact ? 'task-assigner--compact' : ''}`}
			onClick={(e) => e.stopPropagation()}
		>
			{TASK_GROUPS.filter((g) => !g.isNameType).map((g) => {
				const checked = assigned.includes(g.key)
				return (
					<label key={g.key} className='task-assigner__item'>
						<input
							type='checkbox'
							checked={checked}
							onChange={() => toggleProductTask(g.key, productId)}
						/>
						<span className='task-assigner__label'>
							<span className={`material-icons tasks__card-icon--${g.key}`}>{g.icon}</span> {g.title}
						</span>
					</label>
				)
			})}
		</div>
	)
}
