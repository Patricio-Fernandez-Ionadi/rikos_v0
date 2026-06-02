import { Link } from 'react-router-dom'
import { SearchInput } from '../../components/search-input.jsx'

export const TaskCard = ({
	group,
	showAdd, setShowAdd,
	expanded, setExpanded,
	editingNoteId, noteValue, setNoteValue,
	searchTerm, setSearchTerm,
	suggestionName, setSuggestionName,
	otrosDesc, setOtrosDesc,
	otrosSearch, setOtrosSearch,
	otrosLinkedProduct, setOtrosLinkedProduct,
	filtered, otrosFiltered, total, visibleItems, hiddenCount,
	isNameType, isTextBased,
	handleToggleProduct,
	handleAddSuggestion,
	handleAddOtros,
	handleNoteClick,
	handleNoteSave,
	handleNoteKeyDown,
	handleLinkOtrosProduct,
	getProduct,
	removeTask,
}) => {
	const renderItem = (task, index) => {
		const hasProduct = !!task.productId
		const prod = hasProduct ? getProduct(task.productId) : null
		const displayName = isNameType || isTextBased ? task.name : (prod?.name ?? '—')
		const linkTo = hasProduct && prod ? `/products/${prod._id}` : null

		return (
			<li key={task._id ?? index} className='tasks__card-item'>
				<div className='tasks__card-item-body'>
					{linkTo ? (
						<Link to={linkTo} className='tasks__card-item-name'>{displayName}</Link>
					) : (
						<span className='tasks__card-item-name'>{displayName}</span>
					)}

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
							onClick={() => handleNoteClick(task._id, task.note)}
							title={task.note || 'Agregar detalle'}
						>
							{task.note || '✎ Agregar detalle'}
						</span>
					)}
				</div>

				{isTextBased && hasProduct && prod && (
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

								{!otrosLinkedProduct ? (
									<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
										<SearchInput
											placeholder='Opcional: vincular producto…'
											value={otrosSearch}
											onChange={(e) => setOtrosSearch(e.target.value)}
										/>
										{otrosSearch.trim() && (
											<ul className='tasks__card-search-results'>
												{otrosFiltered.slice(0, 8).map((p) => (
													<li
														key={p._id}
														className='tasks__card-search-item tasks__card-search-item--clickable'
														onClick={() => handleLinkOtrosProduct(p)}
													>
														<span className='tasks__card-link'>{p.name}</span>
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
							<>
								<SearchInput
									placeholder='Buscar producto…'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								{filtered.length > 0 && (
									<ul className='tasks__card-search-results'>
										{filtered.slice(0, 10).map((p) => (
											<li
												key={p._id}
												className='tasks__card-search-item tasks__card-search-item--clickable'
												onClick={() => handleToggleProduct(p._id)}
											>
												<span className='tasks__card-link'>{p.name}</span>
												<Link
													to={`/products/${p._id}`}
													className='tasks__card-btn'
													onClick={(e) => e.stopPropagation()}
													title='Ver producto'
												>
													↗
												</Link>
											</li>
										))}
									</ul>
								)}
							</>
						)}
					</div>
				)}
			</div>

			<ul className='tasks__card-list'>
				{total === 0 && (
					<li className='tasks__card-item tasks__card-item--empty'>
						No hay elementos en esta tarea
					</li>
				)}
				{visibleItems.map((item, i) => renderItem(item, i))}
			</ul>

			{total > 3 && (
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
