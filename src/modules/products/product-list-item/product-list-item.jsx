import { useState } from 'react'
import { useTasksManager } from '../../tasks/tasks-manager.js'
import { useProductManager } from '../product-manager.js'
import { TaskAssigner } from '../../tasks/task-assigner.jsx'

export const ProductListItem = ({ product, onEvent }) => {
	const [isTaskOpen, setIsTaskOpen] = useState(false)
	const { presentations } = useProductManager()
	const { getProductTaskCategories, toggleProductTask } = useTasksManager()

	const productPresentations = presentations.filter(
		(p) => p.productId === product._id,
	)
	const taskCategories = getProductTaskCategories?.(product._id) ?? []
	const hasTasks = taskCategories.length > 0

	return (
		<div className='product-list__item-wrap'>
			<div className='product-list__item' onClick={() => onEvent(product._id)}>
				<div className='product-list__item-header'>
			<span className='product-list__item-name'>
					{product.name}
					{product.marca && (
						<span className='product-list__item-marca'> — {product.marca}</span>
					)}
				</span>
				</div>
				<div className='product-list__item-pres'>
					{productPresentations.length > 0 ? (
						productPresentations.map((pres) => (
							<span key={pres._id} className='product-list__item-pres-chip'>
								<span className='product-list__item-pres-label'>
									{pres.code != null && <span className='product-list__item-pres-code'>{pres.code}</span>}
									{pres.label}
								</span>
								<span className='product-list__item-pres-price'>${pres.salePrice?.toLocaleString() ?? '—'}</span>
							</span>
						))
					) : (
						<span className='product-list__item-error'>Sin presentaciones</span>
					)}
				</div>
				<button
					className={`product-list__task-btn ${hasTasks ? 'product-list__task-btn--active' : ''}`}
					onClick={(e) => {
						e.stopPropagation()
						setIsTaskOpen((prev) => !prev)
					}}
					title={
						hasTasks ? `${taskCategories.length} tarea(s)` : 'Asignar tarea'
					}
				>
					⚑
				</button>
			</div>
			{isTaskOpen && (
				<div className='product-list__task-panel'>
					<TaskAssigner
						productId={product._id}
						getProductTaskCategories={getProductTaskCategories}
						toggleProductTask={toggleProductTask}
						compact
					/>
				</div>
			)}
		</div>
	)
}
