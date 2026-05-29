import { useNavigate } from 'react-router-dom'
import { useSaleCart } from '../modules/shift/sale-cart/sale-cart-manager.js'
import { ProductBrowser } from '../modules/shift/sale-cart/product-browser.jsx'
import { CartPanel } from '../modules/shift/sale-cart/cart-panel.jsx'

export const SalePage = () => {
	const navigate = useNavigate()
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
		<div className='sale-cart'>
			<div className='sale-cart__header'>
				<button className='sidebar__btn' onClick={() => navigate('/shifts')}>
					← Volver
				</button>
				<h2 className='sale-cart__title'>Registrar Venta</h2>
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
					onClose={() => navigate('/shifts')}
				/>
			</div>
		</div>
	)
}
