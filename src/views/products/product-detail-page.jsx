import { useParams, useLocation } from 'react-router-dom'
import { ProductDetail } from '../../modules/products/product/product-detail.jsx'

export const ProductDetailPage = () => {
	const { id } = useParams()
	const location = useLocation()
	const filterState = location.state ?? null
	return <ProductDetail productId={id} filterState={filterState} />
}
