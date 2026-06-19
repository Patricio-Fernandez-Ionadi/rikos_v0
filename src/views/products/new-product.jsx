import { useNavigate } from 'react-router-dom'
import { useProductManager } from '../../modules/products/product-manager.js'
import { ProductForm } from '../../modules/products/product/product-form.jsx'
import { BackButton } from '../../components/back-button.jsx'

export const NewProductPage = () => {
	const navigate = useNavigate()
	const { categories, suppliers, createProduct } = useProductManager()

	const handleCreate = async (data) => {
		const created = await createProduct(data)
		if (created?._id) navigate(`/products/${created._id}`)
	}

	return (
		<div className='detail-page'>
			<div className='detail-page__header'>
				<BackButton to='/products' />
			</div>

			<h2 className='detail-page__title'>Nuevo producto</h2>

			<div className='detail-page__info'>
				<ProductForm
					categories={categories}
					suppliers={suppliers}
					onSubmit={handleCreate}
					onCancel={() => navigate('/products')}
				/>
			</div>
		</div>
	)
}
