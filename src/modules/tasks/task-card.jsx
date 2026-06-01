import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from '../../components/search-input.jsx'

/**
 * Card for a single task category. Displays assigned products/suggestions
 * and allows adding new items via a search input.
 *
 * @param {Object}   props
 * @param {Object}   props.group           Task group definition
 * @param {Object[]} props.products        Assigned product objects
 * @param {Object[]} props.suggestions     Suggested product objects (only for isNameType)
 * @param {Function} props.toggleProduct   (productId) => void
 * @param {Function} props.addSuggested    (name) => void
 * @param {Function} props.removeSuggested (id) => void
 * @param {Object[]} props.allProducts     All products for search
 */
export const TaskCard = ({
	group,
	products,
	suggestions = [],
	toggleProduct,
	addSuggested,
	removeSuggested,
	allProducts = [],
}) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [suggestionName, setSuggestionName] = useState('')
	const [showAdd, setShowAdd] = useState(false)

	const filtered = searchTerm.trim()
		? allProducts.filter(
				(p) =>
					p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase())),
			)
		: []

	const total = group.isNameType ? suggestions.length : products.length

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
						{group.isNameType ? (
							<div className='tasks__card-add-row'>
								<input
									className='field-input field-input--sm'
									type='text'
									placeholder='Nombre del producto sugerido…'
									value={suggestionName}
									onChange={(e) => setSuggestionName(e.target.value)}
									autoFocus
								/>
								<button
									className='sidebar__btn sidebar__btn--xs'
									disabled={!suggestionName.trim()}
									onClick={() => {
										if (suggestionName.trim()) {
											addSuggested(suggestionName.trim())
											setSuggestionName('')
										}
									}}
								>
									OK
								</button>
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
											<li key={p._id} className='tasks__card-search-item'>
												<Link to={`/products/${p._id}`} className='tasks__card-link'>
													{p.name}
												</Link>
												<button
													className='tasks__card-btn'
													onClick={() => {
														toggleProduct(p._id)
														setSearchTerm('')
													}}
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
				{group.isNameType
					? suggestions.map((s) => (
							<li key={s._id} className='tasks__card-item'>
								<span className='tasks__card-link'>{s.name}</span>
								<button
									className='tasks__card-btn tasks__card-btn--remove'
									onClick={() => removeSuggested(s._id)}
								>
									✕
								</button>
							</li>
						))
					: products.map((prod) => (
							<li key={prod._id} className='tasks__card-item'>
								<Link to={`/products/${prod._id}`} className='tasks__card-link'>
									{prod.name}
								</Link>
								<button
									className='tasks__card-btn tasks__card-btn--remove'
									onClick={() => toggleProduct(prod._id)}
								>
									✕
								</button>
							</li>
						))}
			</ul>
		</div>
	)
}
