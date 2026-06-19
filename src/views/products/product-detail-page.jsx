import { useParams, useLocation } from 'react-router-dom'
import { ProductDetail } from '../../modules/products/product/product-detail.jsx'

export const ProductDetailPage = () => {
	const { id } = useParams()
	const location = useLocation()
	const productList = location.state?.productList ?? null
	return <ProductDetail productId={id} productList={productList} />
}
