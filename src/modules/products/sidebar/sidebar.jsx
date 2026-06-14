import { Link } from 'react-router-dom'
import { ProductStats } from '../product-stats/product-stats.jsx'
import { Button } from '../../../components/button.jsx'

export const Sidebar = ({
	categories,
	filteredProducts,
	products,
}) => {
	return (
		<div className='products-sidebar'>
			<ProductStats
				categories={categories}
				filteredProducts={filteredProducts}
				products={products}
			/>
			<Link to='/products/new' style={{ textDecoration: 'none' }}>
				<Button block style={{ marginBottom: 10 }}>+Nuevo producto</Button>
			</Link>
		</div>
	)
}
