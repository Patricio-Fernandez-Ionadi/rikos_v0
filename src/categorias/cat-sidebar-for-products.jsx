/**
 * Sidebar that lists product categories.
 * Displays a "Todas las categorías" option and individual category buttons,
 * along with basic statistics about products.
 *
 * @param {Object}        props
 * @param {string|null}   props.selected       Currently selected category ID
 * @param {Function}      props.onEvent        Callback when a category is clicked (receives category ID or null)
 * @param {Array}         props.categories     Full list of categories
 * @param {Array}         props.products       Full list of products
 * @param {Array}         props.filteredProducts  Products currently visible in the view
 */
export const CategoriesSidebar = ({
	selected,
	onEvent,
	categories,
	products,
	filteredProducts,
}) => {
	return (
		<div className="cat-sidebar">
			<h3 className="cat-sidebar__title">Categorías</h3>
			<div className="cat-sidebar__buttons">
				<button
					className={
						'cat-sidebar__btn cat-sidebar__btn--all' +
						(selected === null ? ' cat-sidebar__btn--active' : '')
					}
					onClick={() => onEvent(null)}
				>
					Todas las categorías
				</button>

			{categories?.map((category) => (
				<button
					key={category._id}
					className={
						'cat-sidebar__btn' +
						(selected === category._id ? ' cat-sidebar__btn--active' : '')
					}
					onClick={() => onEvent(category._id)}
				>
					{category.name}
				</button>
			))}
			</div>

			<div className="cat-sidebar__stats">
				<h4 className="cat-sidebar__stats-title">Estadísticas</h4>
				<p className="cat-sidebar__stat">Total categorías: {categories?.length}</p>
				<p className="cat-sidebar__stat">Total productos: {products.length}</p>
				<p className="cat-sidebar__stat">Productos en vista: {filteredProducts.length}</p>
				<p className="cat-sidebar__stat">
					Productos sin costo:{' '}
					{filteredProducts.filter((p) => p.purchaseCost === null).length}
				</p>
			</div>
		</div>
	)
}
