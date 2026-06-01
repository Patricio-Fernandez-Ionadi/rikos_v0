import { useState } from 'react'
import { TaskAssigner } from '../tasks/task-assigner.jsx'

export const ProductList = ({
	onEvent,
	filteredProducts,
	presentations,
	getProductTaskCategories,
	toggleProductTask,
}) => {
	const [openTasks, setOpenTasks] = useState(null)

	return (
		<>
			{filteredProducts.length === 0 ? (
				<div className="placeholder">
					<h3>No hay productos</h3>
				</div>
			) : (
				<>
					<h3>Productos</h3>
					<div className="product-list">
						{filteredProducts.map((product) => {
							const productPresentations = presentations.filter(
								(p) => p.productId === product._id
							)
							const isFraction = product.saleType === 'fraction'
							const totalStock = isFraction
								? (product.stockGrams ?? 0)
								: productPresentations.reduce((sum, p) => sum + (p.stock ?? 0), 0)
							const stockLabel = isFraction ? `${totalStock}g` : totalStock
							const taskCategories = getProductTaskCategories?.(product._id) ?? []
							const hasTasks = taskCategories.length > 0

							return (
								<div key={product._id} className="product-list__item-wrap">
									<div
										className="product-list__item"
										onClick={() => onEvent(product._id)}
									>
										<div className="product-list__item-left">
											<div className="product-list__item-name">
												{product.name}
												{product.marca && <span className="product-list__item-marca"> — {product.marca}</span>}
											</div>
											<div className="product-list__item-type">
												{isFraction ? 'Fraccionable' : 'Unidad'}
											</div>
										</div>
										<div className="product-list__item-right">
											<div className="product-list__item-meta">
												{productPresentations.length > 0 ? (
													<>
														<div className="product-list__item-prices">
															{productPresentations.map((pres, i) => (
																<span key={pres._id}>
																	{i > 0 && <span className="product-list__item-prices-sep">, </span>}
																	<span className="product-list__item-price-label">{pres.label}</span>
																	<span className="product-list__item-price-value">
																		${pres.salePrice?.toLocaleString() ?? '—'}
																	</span>
																</span>
															))}
														</div>
														<div className="product-list__item-stock">
															Stock: <strong>{stockLabel}</strong>
														</div>
													</>
												) : (
													<div className="product-list__item-error">
														Sin presentaciones
													</div>
												)}
											</div>
											<button
												className={`product-list__task-btn ${hasTasks ? 'product-list__task-btn--active' : ''}`}
												onClick={(e) => {
													e.stopPropagation()
													setOpenTasks(openTasks === product._id ? null : product._id)
												}}
												title={hasTasks ? `${taskCategories.length} tarea(s)` : 'Asignar tarea'}
											>
												⚑
											</button>
										</div>
									</div>
									{openTasks === product._id && (
										<div className="product-list__task-panel">
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
						})}
					</div>
				</>
			)}
		</>
	)
}
