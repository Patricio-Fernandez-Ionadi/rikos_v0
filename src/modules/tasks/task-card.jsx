import { Link } from 'react-router-dom'

export const TaskCard = ({ group, productItems, presProductItems, isInRestock, onToggleRestock }) => {
	const total = group.isManual
		? productItems.length
		: group.productFilter
			? productItems.length
			: presProductItems.length
	if (total === 0) return null

	const renderItem = (prod) => (
		<li key={prod._id} className='tasks__card-item'>
			<Link to={`/products/${prod._id}`} className='tasks__card-link'>
				{prod.name}
			</Link>
			{!group.isManual && (
				<button
					className={`tasks__card-btn ${isInRestock(prod._id) ? 'tasks__card-btn--active' : ''}`}
					onClick={() => onToggleRestock(prod._id)}
					title={isInRestock(prod._id) ? 'Quitar de "Para pedir"' : 'Agregar a "Para pedir"'}
				>
					{isInRestock(prod._id) ? '✓' : '+'}
				</button>
			)}
		</li>
	)

	const renderPresItem = ({ pres, product }) => (
		<li key={pres._id} className='tasks__card-item'>
			<Link to={`/products/${product._id}`} className='tasks__card-link'>
				{product.name}
				{pres.label ? <span className='tasks__card-label'>— {pres.label}</span> : null}
			</Link>
			<button
				className={`tasks__card-btn ${isInRestock(product._id) ? 'tasks__card-btn--active' : ''}`}
				onClick={() => onToggleRestock(product._id)}
				title={isInRestock(product._id) ? 'Quitar de "Para pedir"' : 'Agregar a "Para pedir"'}
			>
				{isInRestock(product._id) ? '✓' : '+'}
			</button>
		</li>
	)

	return (
		<div className='tasks__card'>
			<div className='tasks__card-header'>
				<span className='tasks__card-icon'>{group.icon}</span>
				<div>
					<h3 className='tasks__card-title'>{group.title}</h3>
					<p className='tasks__card-desc'>{group.desc}</p>
				</div>
				<span className='tasks__card-count'>{total}</span>
			</div>
			<ul className='tasks__card-list'>
				{group.isManual
					? productItems.slice(0, 30).map((prod) => (
						<li key={prod._id} className='tasks__card-item'>
							<Link to={`/products/${prod._id}`} className='tasks__card-link'>
								{prod.name}
							</Link>
							<button
								className='tasks__card-btn tasks__card-btn--remove'
								onClick={() => onToggleRestock(prod._id)}
								title='Quitar de la lista'
							>
								✕
							</button>
						</li>
					))
					: group.productFilter
						? productItems.slice(0, 20).map(renderItem)
						: presProductItems.slice(0, 30).map(renderPresItem)
				}
				{total > 30 && (
					<li className='tasks__card-item tasks__card-item--more'>
						+{total - 30} más
					</li>
				)}
			</ul>
		</div>
	)
}
