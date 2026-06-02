import { ProductInfoSection } from './product-info-section.jsx'

export const ProductInfo = ({
	product,
	category,
	isFraction,
	totalStock,
	productPres,
	minSalePrice,
	activeSupplierName,
	stockGramsEdit,
	stockGramsValue,
	setStockGramsEdit,
	setStockGramsValue,
	handleStockGramsSave,
}) => {
	return (
		<ProductInfoSection
			isFraction={isFraction}
			totalStock={totalStock}
			purchaseCost={product.purchaseCost}
			margin={product.margin}
			productPres={productPres}
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
	)
}
