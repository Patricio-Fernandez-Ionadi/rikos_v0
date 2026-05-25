import { useState } from 'react'

/**
 * Sidebar that lists product categories with multi-select support.
 * Categories section is collapsible to maximize space.
 *
 * @param {Object}        props
 * @param {Array}         props.selected     Array of selected category IDs (empty = all)
 * @param {Function}      props.onEvent      Callback when categories are selected/deselected
 * @param {Array}         props.categories   Full list of categories
 */
export const CategoriesSidebar = ({
	selected,
	onEvent,
	categories,
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
		<>
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
		</>
	)
}
