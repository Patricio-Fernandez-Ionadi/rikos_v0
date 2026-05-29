import { useSaleCart } from './sale-cart-manager.js'
import { ProductBrowser } from './product-browser.jsx'
import { CartPanel } from './cart-panel.jsx'

export const SaleCart = ({ onClose }) => {
	const {
		cartItems,
		searchQuery, setSearchQuery,
		selectedCategory, setSelectedCategory,
		selectedProductId, setSelectedProductId,
		selectedPresId, setSelectedPresId,
		quantity, setQuantity,
		paymentMethod, setPaymentMethod,
		searchRef,
		categories,
		filteredProducts, selectedProduct, productPres,
		isFraction,
		subtotal, discount, calcTotal, finalTotal,
		collectedTotal, setCollectedTotal,
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
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						categories={categories}
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
						calcTotal={calcTotal}
						finalTotal={finalTotal}
						collectedTotal={collectedTotal}
						setCollectedTotal={setCollectedTotal}
						onRemoveItem={handleRemoveItem}
						onSubmit={handleSubmit}
						onClose={onClose}
					/>
				</div>
			</div>
		</div>
	)
}
