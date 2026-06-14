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
	const isFraction = product.saleType === 'fraction'
	const totalStock = isFraction
		? (product.stockGrams ?? 0)
		: productPresentations.reduce((sum, p) => sum + (p.stock ?? 0), 0)
	const stockLabel = isFraction ? `${totalStock}g` : totalStock
	const taskCategories = getProductTaskCategories?.(product._id) ?? []
	const hasTasks = taskCategories.length > 0

	return (
		<div className='product-list__item-wrap'>
			<div className='product-list__item' onClick={() => onEvent(product._id)}>
				<div className='product-list__item-left'>
					<div className='product-list__item-name'>
						{product.name}
						{product.marca && (
							<span className='product-list__item-marca'>
								{' '}
								— {product.marca}
							</span>
						)}
					</div>
				</div>
				<div className='product-list__item-right'>
					<div className='product-list__item-meta'>
						{productPresentations.length > 0 ? (
							<>
								<div className='product-list__item-prices'>
									{productPresentations.map((pres, i) => (
										<span key={pres._id}>
											{i > 0 && (
												<span className='product-list__item-prices-sep'>
													,{' '}
												</span>
											)}
											<span className='product-list__item-price-label'>
												{pres.label}
											</span>
											<span className='product-list__item-price-value'>
												${pres.salePrice?.toLocaleString() ?? '—'}
											</span>
										</span>
									))}
								</div>
								<div className='product-list__item-stock'>
									Stock: <strong>{stockLabel}</strong>
								</div>
							</>
						) : (
							<div className='product-list__item-error'>Sin presentaciones</div>
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
