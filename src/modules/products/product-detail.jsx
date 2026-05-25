import { DottedMenu } from '../../components/DottedMenu.jsx'

export const ProductDetail = ({
	onSetEdit,
	product,
	onDelete,
	showModal,
	showForm,
}) => {
	const menuItems = [
		{ label: 'Editar producto', onClick: () => onSetEdit(product) },
		{ label: 'Ver presentaciones', onClick: () => showModal(true) },
		{ label: '+ Presentación', onClick: () => showForm(true) },
		{
			label: 'Eliminar producto',
			onClick: () => onDelete(product._id),
			danger: true,
		},
	]

	return (
		<>
			<div className='detail__header'>
				<h3 className='detail__title'>{product.name}</h3>
				<DottedMenu items={menuItems} />
			</div>
			<p className='detail__cost'>
				<strong>Costo de compra:</strong> $
				{product.purchaseCost?.toLocaleString() ?? 'Sin datos'}
			</p>
		</>
	)
}
