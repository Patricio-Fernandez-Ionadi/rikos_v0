import { useNavigate } from 'react-router-dom'
import { ProductInfoSection } from './product-info-section.jsx'

export const ProductInfo = ({
	product,
	category,
	isFraction,
	totalStock,
	minSalePrice,
	activeSupplierName,
	stockGramsEdit,
	stockGramsValue,
	setStockGramsEdit,
	setStockGramsValue,
	handleStockGramsSave,
	onEdit,
	onDelete,
}) => {
	const navigate = useNavigate()

	return (
		<>
			<div className='detail-page__header'>
				<button className='sidebar__btn' onClick={() => navigate(-1)}>
					← Volver
				</button>
				<div className='detail-page__header-right'>
					<button className='sidebar__btn' onClick={onEdit}>
						Editar
					</button>
					<button
						className='sidebar__btn sidebar__btn--danger'
						onClick={onDelete}
					>
						Eliminar
					</button>
				</div>
			</div>

			<h2 className='detail-page__title'>{product.name}</h2>

			<ProductInfoSection
				isFraction={isFraction}
				totalStock={totalStock}
				purchaseCost={product.purchaseCost}
				minSalePrice={minSalePrice}
				stockGramsEdit={stockGramsEdit}
				stockGramsValue={stockGramsValue}
				setStockGramsEdit={setStockGramsEdit}
				setStockGramsValue={setStockGramsValue}
				handleStockGramsSave={handleStockGramsSave}
				categoryName={category?.name ?? null}
				saleTypeLabel={isFraction ? 'Fraccionable' : 'Unidad'}
				marca={product.marca}
				activeSupplierName={activeSupplierName}
			/>
		</>
	)
}
