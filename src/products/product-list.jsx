export const ProductList = ({
	selectedCat,
	onEvent,
	filteredProducts,
	selectedProd,
	presentations,
}) => {
	return (
		<>
			{!selectedCat ? (
				<div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
					<h3>Selecciona una categoría</h3>
					<p>Para ver los productos disponibles</p>
				</div>
			) : filteredProducts.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
					<h3>No hay productos en esta categoría</h3>
				</div>
			) : (
				<>
					<h3>Productos</h3>
					<div
						style={{
							maxHeight: '400px',
							overflowY: 'auto',
							border: '1px solid #ddd',
							borderRadius: '4px',
						}}
					>
						{filteredProducts.map((product) => (
							<div
								key={product._id}
								onClick={() => onEvent(product._id)}
								style={{
									padding: '12px',
									borderBottom: '1px solid #f0f0f0',
									background:
										selectedProd === product._id ? '#e9f5ff' : 'white',
									cursor: 'pointer',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<div>
										<strong>{product.name}</strong>
										<br />
										<small style={{ color: '#666' }}>
											Costo: $
											{product.purchaseCost?.toLocaleString() ?? 'Sin datos'}
										</small>
									</div>
									<div style={{ textAlign: 'right', minWidth: '120px' }}>
										{presentations.length > 0 ? (
											<>
												<strong>{presentations.length}</strong> presentaciones
												<br />
												<small style={{ color: '#666' }}>
													{
														presentations.filter((p) => p.salePrice !== null)
															.length
													}{' '}
													con precio
												</small>
											</>
										) : (
											<span style={{ color: '#999' }}>Sin presentaciones</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</>
	)
}
