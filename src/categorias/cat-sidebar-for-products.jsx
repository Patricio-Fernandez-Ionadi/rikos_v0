/**
 * Sidebar that lists product categories with multi-select support.
 * Displays a "Todas las categorías" option and individual category buttons.
 * Users can select multiple categories to filter products across them.
 * Displays basic statistics about products.
 *
 * @param {Object}        props
 * @param {Array}         props.selected            Array of selected category IDs (empty = all)
 * @param {Function}      props.onEvent            Callback when categories are selected/deselected
 * @param {Array}         props.categories          Full list of categories
 * @param {Array}         props.products            Full list of products
 * @param {Array}         props.filteredProducts    Products currently visible in the view
 */
export const CategoriesSidebar = ({
	selected,
	onEvent,
	categories,
	products,
	filteredProducts,
}) => {
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
			<h3 className='cat-sidebar__title'>Categorías</h3>
			<div className='cat-sidebar__buttons'>
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
	)
}
