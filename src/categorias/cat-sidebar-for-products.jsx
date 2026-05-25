import { useState } from 'react'

/**
 * Sidebar that lists product categories with multi-select support.
 * Includes a search input to filter products by name.
 * Categories section is collapsible to maximize space for results.
 *
 * @param {Object}        props
 * @param {Array}         props.selected            Array of selected category IDs (empty = all)
 * @param {Function}      props.onEvent            Callback when categories are selected/deselected
 * @param {Array}         props.categories          Full list of categories
 * @param {Array}         props.products            Full list of products
 * @param {Array}         props.filteredProducts    Products currently visible in the view
 * @param {string}        props.searchTerm         Current search term
 * @param {Function}      props.onSearchChange     Callback when search term changes
 */
export const CategoriesSidebar = ({
	selected,
	onEvent,
	categories,
	products,
	filteredProducts,
	searchTerm,
	onSearchChange,
}) => {
	const [categoriesOpen, setCategoriesOpen] = useState(false)
	/**
	 * Handle category selection/deselection.
	 * If clicking "all" when any are selected, clears selection.
	 * If clicking a category, toggles it in the selection.
	 */
	const handleSelectCategory = (categoryId) => {
		if (categoryId === null) {
			// Click on "Todas las categorías"
			onEvent([])
		} else {
			// Toggle category selection
			const newSelected = selected.includes(categoryId)
				? selected.filter((id) => id !== categoryId)
				: [...selected, categoryId]
			onEvent(newSelected)
		}
	}

	// Show all categories when selection is empty
	const showingAllCategories = selected.length === 0

	return (
		<div className='cat-sidebar'>
			<div className='cat-sidebar__stats'>
				<h4 className='cat-sidebar__stats-title'>Estadísticas</h4>
				<p className='cat-sidebar__stat'>
					Total categorías: {categories?.length}
				</p>
				<p className='cat-sidebar__stat'>Total productos: {products.length}</p>
				<p className='cat-sidebar__stat'>
					Productos en vista: {filteredProducts.length}
				</p>
				<p className='cat-sidebar__stat'>
					Productos sin costo:{' '}
					{filteredProducts.filter((p) => p.purchaseCost === null).length}
				</p>
			</div>

			<div className='cat-sidebar__search'>
				<input
					className='cat-sidebar__search-input'
					type='text'
					placeholder='Buscar producto…'
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>

			<div className='cat-sidebar__categories'>
				<button
					className='cat-sidebar__categories-header'
					onClick={() => setCategoriesOpen((prev) => !prev)}
					type='button'
					aria-expanded={categoriesOpen}
				>
					<span className='cat-sidebar__title'>
						<span
							className={`cat-sidebar__arrow${categoriesOpen ? ' cat-sidebar__arrow--open' : ''}`}
						>
							▸
						</span>
						Categorías
					</span>
				</button>

				<div
					className={`cat-sidebar__buttons${!categoriesOpen ? ' cat-sidebar__buttons--collapsed' : ''}`}
				>
					<button
						className={
							'cat-sidebar__btn cat-sidebar__btn--all' +
							(showingAllCategories ? ' cat-sidebar__btn--active' : '')
						}
						onClick={() => handleSelectCategory(null)}
					>
						Todas las categorías
					</button>

					{categories?.map((category) => (
						<button
							key={category._id}
							className={
								'cat-sidebar__btn' +
								(selected.includes(category._id)
									? ' cat-sidebar__btn--active'
									: '')
							}
							onClick={() => handleSelectCategory(category._id)}
						>
							{category.name}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}
