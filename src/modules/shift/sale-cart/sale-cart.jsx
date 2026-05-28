import { useSaleCart } from './sale-cart-manager.js'
import { ProductBrowser } from './product-browser.jsx'
import { CartPanel } from './cart-panel.jsx'

export const SaleCart = ({ onClose }) => {
	const {
		cartItems,
		searchQuery, setSearchQuery,
		selectedProductId, setSelectedProductId,
		selectedPresId, setSelectedPresId,
		quantity, setQuantity,
		paymentMethod, setPaymentMethod,
		searchRef,
		filteredProducts, selectedProduct, productPres,
		isFraction,
		subtotal, discount, total,
		handleAddToCart, handleRemoveItem, handleSubmit,
	} = useSaleCart()

	return (
		<div className='sale-cart-overlay' onClick={onClose}>
			<div className='sale-cart' onClick={(e) => e.stopPropagation()}>
				<div className='sale-cart__header'>
					<h2 className='sale-cart__title'>Registrar Venta</h2>
					<button
						className='modal-close'
						onClick={onClose}
						type='button'
						aria-label='Cerrar'
					>
						✕
					</button>
				</div>

				<div className='sale-cart__body'>
					<ProductBrowser
						searchRef={searchRef}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						filteredProducts={filteredProducts}
						selectedProductId={selectedProductId}
						setSelectedProductId={setSelectedProductId}
						selectedProduct={selectedProduct}
						productPres={productPres}
						selectedPresId={selectedPresId}
						setSelectedPresId={setSelectedPresId}
						isFraction={isFraction}
						quantity={quantity}
						setQuantity={setQuantity}
						handleAddToCart={handleAddToCart}
					/>
					<CartPanel
						cartItems={cartItems}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
						subtotal={subtotal}
						discount={discount}
						total={total}
						onRemoveItem={handleRemoveItem}
						onSubmit={handleSubmit}
						onClose={onClose}
					/>
				</div>
			</div>
		</div>
	)
}
