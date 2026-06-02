import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from '../../components/search-input.jsx'

const MAX_VISIBLE = 3

/**
 * Card for a single task category.
 *
 * @param {Object}   props
 * @param {Object}   props.group            Task group definition
 * @param {Object[]} props.products         Assigned product objects (for non-text-based)
 * @param {Object[]} props.allTasks         All TaskItem objects for this type
 * @param {Function} props.toggleProduct    (productId, note?) => void
 * @param {Function} props.addSuggested     (name, note?) => void
 * @param {Function} props.removeSuggested  (id) => void
 * @param {Function} props.addTextTask      (type, description, productId?) => void
 * @param {Function} props.updateNote       (id, note) => void
 * @param {Function} props.removeTask       (id) => void
 * @param {Object[]} props.allProducts      All products for search
 */
export const TaskCard = ({
	group,
	allTasks = [],
	toggleProduct,
	addSuggested,
	addTextTask,
	updateNote,
	removeTask,
	allProducts = [],
}) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [suggestionName, setSuggestionName] = useState('')
	const [showAdd, setShowAdd] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const [editingNoteId, setEditingNoteId] = useState(null)
	const [noteValue, setNoteValue] = useState('')

	// For "Otros" hybrid: text description + optional product link
	const [otrosDesc, setOtrosDesc] = useState('')
	const [otrosSearch, setOtrosSearch] = useState('')
	const [otrosLinkedProduct, setOtrosLinkedProduct] = useState(null)

	const filtered = searchTerm.trim()
		? allProducts.filter(
				(p) =>
					p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase())),
			)
		: []

	const isNameType = group.isNameType
	const isTextBased = group.textBased

	// Build display items from allTasks (for text-based) or products (for standard)
	const displayItems = isNameType
		? allTasks.filter((t) => !t.productId && t.name)
		: isTextBased
			? allTasks
			: allTasks.filter((t) => t.productId)

	const total = displayItems.length
	const visibleItems = expanded ? displayItems : displayItems.slice(0, MAX_VISIBLE)
	const hiddenCount = total - MAX_VISIBLE

	const handleToggleProduct = (productId) => {
		toggleProduct(productId)
		setSearchTerm('')
	}

	const handleAddSuggestion = () => {
		if (suggestionName.trim()) {
			addSuggested(suggestionName.trim())
			setSuggestionName('')
		}
	}

	const handleAddOtros = () => {
		if (otrosDesc.trim()) {
			addTextTask(group.key, otrosDesc.trim(), otrosLinkedProduct?._id ?? null)
			setOtrosDesc('')
			setOtrosLinkedProduct(null)
			setOtrosSearch('')
		}
	}

	const handleNoteClick = (task) => {
		setEditingNoteId(task._id)
		setNoteValue(task.note ?? '')
	}

	const handleNoteSave = (taskId) => {
		updateNote(taskId, noteValue)
		setEditingNoteId(null)
	}

	const handleNoteKeyDown = (e, taskId) => {
		if (e.key === 'Enter') handleNoteSave(taskId)
		if (e.key === 'Escape') setEditingNoteId(null)
	}

	const renderItem = (task, index) => {
		const isProductItem = !!task.productId
		const prod = isProductItem ? allProducts.find((p) => p._id === task.productId) : null
		const displayName = isNameType || isTextBased ? task.name : (prod?.name ?? '—')
		const linkTo = isProductItem && prod ? `/products/${prod._id}` : null

		return (
			<li key={task._id ?? index} className='tasks__card-item'>
				<div className='tasks__card-item-body'>
					{linkTo ? (
						<Link to={linkTo} className='tasks__card-item-name'>{displayName}</Link>
					) : (
						<span className='tasks__card-item-name'>{displayName}</span>
					)}

					{/* Note display / edit */}
					{editingNoteId === task._id ? (
						<input
							className='tasks__card-note-input'
							type='text'
							value={noteValue}
							onChange={(e) => setNoteValue(e.target.value)}
							onBlur={() => handleNoteSave(task._id)}
							onKeyDown={(e) => handleNoteKeyDown(e, task._id)}
							autoFocus
							placeholder='Agregar detalle…'
						/>
					) : (
						<span
							className='tasks__card-note'
							onClick={() => handleNoteClick(task)}
							title={task.note || 'Agregar detalle'}
						>
							{task.note || '✎ Agregar detalle'}
						</span>
					)}
				</div>

				{/* Linked product badge for "Otros" items with a productId */}
				{isTextBased && task.productId && prod && (
					<Link to={`/products/${prod._id}`} className='tasks__card-product-badge'>
						{prod.name}
					</Link>
				)}

				<button
					className='tasks__card-btn tasks__card-btn--remove'
					onClick={() => removeTask(task._id)}
					title='Eliminar'
				>
					✕
				</button>
			</li>
		)
	}

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

			{/* ── Add area ─────────────────────────── */}
			<div className='tasks__card-add'>
				<button
					className='sidebar__btn sidebar__btn--xs'
					onClick={() => setShowAdd(!showAdd)}
				>
					{showAdd ? 'Cancelar' : '+ Agregar'}
				</button>

				{showAdd && (
					<div className='tasks__card-add-form'>
						{isNameType ? (
							/* productos-sugeridos: text input */
							<div className='tasks__card-add-row'>
								<input
									className='field-input field-input--sm'
									type='text'
									placeholder='Nombre del producto sugerido…'
									value={suggestionName}
									onChange={(e) => setSuggestionName(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleAddSuggestion()}
									autoFocus
								/>
								<button
									className='sidebar__btn sidebar__btn--xs'
									disabled={!suggestionName.trim()}
									onClick={handleAddSuggestion}
								>
									OK
								</button>
							</div>
						) : isTextBased ? (
							/* "Otros": text description + optional product link */
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<div className='tasks__card-add-row'>
									<input
										className='field-input field-input--sm'
										type='text'
										placeholder='¿Qué hay que hacer?'
										value={otrosDesc}
										onChange={(e) => setOtrosDesc(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && handleAddOtros()}
										autoFocus
									/>
									<button
										className='sidebar__btn sidebar__btn--xs'
										disabled={!otrosDesc.trim()}
										onClick={handleAddOtros}
									>
										OK
									</button>
								</div>

								{/* Optional product search */}
								{!otrosLinkedProduct ? (
									<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
										<SearchInput
											placeholder='Opcional: vincular producto…'
											value={otrosSearch}
											onChange={(e) => setOtrosSearch(e.target.value)}
										/>
										{otrosSearch.trim() && (
											<ul className='tasks__card-search-results'>
												{allProducts
													.filter((p) =>
														p.name.toLowerCase().includes(otrosSearch.toLowerCase()) ||
														(p.marca && p.marca.toLowerCase().includes(otrosSearch.toLowerCase())),
													)
													.slice(0, 8)
													.map((p) => (
														<li key={p._id} className='tasks__card-search-item'>
															<Link to={`/products/${p._id}`} className='tasks__card-link'>
																{p.name}
															</Link>
															<button
																className='tasks__card-btn'
																onClick={() => {
																	setOtrosLinkedProduct(p)
																	setOtrosSearch('')
																}}
															>
																+
															</button>
														</li>
													))}
											</ul>
										)}
									</div>
								) : (
									<div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85em' }}>
										<span style={{ color: '#9e9e9e' }}>Producto:</span>
										<Link to={`/products/${otrosLinkedProduct._id}`} style={{ color: '#9db683' }}>
											{otrosLinkedProduct.name}
										</Link>
										<button
											className='tasks__card-btn tasks__card-btn--remove'
											style={{ width: 20, height: 20, fontSize: 12 }}
											onClick={() => setOtrosLinkedProduct(null)}
										>
											✕
										</button>
									</div>
								)}
							</div>
						) : (
							/* Standard product-based categories: search */
							<>
								<SearchInput
									placeholder='Buscar producto…'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								{filtered.length > 0 && (
									<ul className='tasks__card-search-results'>
										{filtered.slice(0, 10).map((p) => (
											<li key={p._id} className='tasks__card-search-item'>
												<Link to={`/products/${p._id}`} className='tasks__card-link'>
													{p.name}
												</Link>
												<button
													className='tasks__card-btn'
													onClick={() => handleToggleProduct(p._id)}
												>
													+
												</button>
											</li>
										))}
									</ul>
								)}
							</>
						)}
					</div>
				)}
			</div>

			{/* ── List ─────────────────────────────── */}
			<ul className='tasks__card-list'>
				{total === 0 && (
					<li className='tasks__card-item tasks__card-item--empty'>
						No hay elementos en esta tarea
					</li>
				)}
				{visibleItems.map((item, i) => renderItem(item, i))}
			</ul>

			{total > MAX_VISIBLE && (
				<div className='tasks__card-more'>
					<button
						className='tasks__card-more-btn'
						onClick={() => setExpanded(!expanded)}
					>
						{expanded
							? '▲ Mostrar menos'
							: `▼ Ver ${hiddenCount} más...`}
					</button>
				</div>
			)}
		</div>
	)
}
