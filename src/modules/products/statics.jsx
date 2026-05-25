export const ProductStatics = ({ categories, filteredProducts, products }) => {
	return (
		<div className='sidebar__stats'>
			<h4 className='sidebar__stats-title'>Estadísticas</h4>
			<p className='sidebar__stat'>Total categorías: {categories?.length}</p>
			<p className='sidebar__stat'>Total productos: {products.length}</p>
			<p className='sidebar__stat'>
				Productos en vista: {filteredProducts.length}
			</p>
			<p className='sidebar__stat'>
				Productos sin costo:{' '}
				{filteredProducts.filter((p) => p.purchaseCost === null).length}
			</p>
		</div>
	)
}
