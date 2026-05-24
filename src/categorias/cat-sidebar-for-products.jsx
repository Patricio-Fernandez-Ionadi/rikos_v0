export const CategoriesSidebar = ({
	selected,
	onEvent,
	categories,
	products,
	filteredProducts,
}) => {
	return (
		<>
			{/* Category Sidebar */}
			<div
				style={{
					width: '250px',
					borderRight: '1px solid #eee',
					paddingRight: '20px',
				}}
			>
				<h3>Categorías</h3>
				<button
					onClick={() => onEvent(null)}
					style={{
						width: '100%',
						padding: '8px',
						marginBottom: '10px',
						background: selected === null ? '#007bff' : '#f8f9fa',
						color: selected === null ? 'white' : 'black',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					Todas las categorías
				</button>

				{categories?.map((category) => (
					<button
						key={category._id}
						onClick={() => onEvent(category._id)}
						style={{
							width: '100%',
							padding: '8px',
							marginBottom: '5px',
							background: selected === category._id ? '#007bff' : '#f8f9fa',
							color: selected === category._id ? 'white' : 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						{category.name}
					</button>
				))}

				<div
					style={{
						marginTop: '20px',
						paddingTop: '15px',
						borderTop: '1px solid #eee',
					}}
				>
					<h4>Estadísticas</h4>
					<p>Total categorías: {categories?.length}</p>
					<p>Total productos: {products.length}</p>
					<p>Productos en vista: {filteredProducts.length}</p>
					<p>
						Productos sin costo:{' '}
						{filteredProducts.filter((p) => p.purchaseCost === null).length}
					</p>
				</div>
			</div>
		</>
	)
}
