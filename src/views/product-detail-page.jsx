import { useParams } from 'react-router-dom'
import { ProductDetail } from '../modules/products/product-detail.jsx'

export const ProductDetailPage = () => {
	const { id } = useParams()
	return <ProductDetail productId={id} />
}
