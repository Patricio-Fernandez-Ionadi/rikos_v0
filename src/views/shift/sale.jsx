import { useNavigate } from 'react-router-dom'
import { useSaleCart } from '../../modules/shift/sale-cart/sale-cart-manager.js'
import { ProductBrowser } from '../../modules/shift/sale-cart/product-browser.jsx'
import { CartPanel } from '../../modules/shift/sale-cart/cart-panel.jsx'
import { PromoSetView } from '../../modules/promo-sets/components/promo-set-list.jsx'

export const SalePage = () => {
	const navigate = useNavigate()
	const {
		cartItems,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		selectedTags,
		setSelectedTags,
		selectedProductId,
		setSelectedProductId,
		selectedPresId,
		setSelectedPresId,
		quantity,
		setQuantity,
		paymentMethod,
		setPaymentMethod,
		searchRef,
		categories,
		tags,
		filteredProducts,
		selectedProduct,
		productPres,
		isFraction,
		subtotal,
		discount,
		calcTotal,
		finalTotal,
		collectedTotal,
		setCollectedTotal,
		handleAddToCart,
		handleRemoveItem,
		handleSubmit,
		promoSets,
		activeTab,
		setActiveTab,
		presInPromos,
		handleAddPromoToCart,
	} = useSaleCart()

	return (
		<div className='sale-cart'>
			<div className='sale-cart__header'>
				<button className='back-btn' onClick={() => navigate('/shifts')}>
					<span className='material-icons'>arrow_back</span> Volver
				</button>
				<h2 className='sale-cart__title'>Registrar Venta</h2>
			</div>

			<div className='sale-cart__tabs'>
				<button
					className={`sale-cart__tab${activeTab === 'products' ? ' sale-cart__tab--active' : ''}`}
					onClick={() => setActiveTab('products')}
				>
					Productos
				</button>
				<button
					className={`sale-cart__tab${activeTab === 'promos' ? ' sale-cart__tab--active' : ''}`}
					onClick={() => setActiveTab('promos')}
				>
					Promos
				</button>
			</div>

			<div className='sale-cart__body'>
				{activeTab === 'products' ? (
					<ProductBrowser
						searchRef={searchRef}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						selectedTags={selectedTags}
						setSelectedTags={setSelectedTags}
						categories={categories}
						tags={tags}
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
						presInPromos={presInPromos}
					/>
				) : (
					<div className='sale-cart__products'>
						<PromoSetView promoSets={promoSets} onAddToCart={handleAddPromoToCart} />
					</div>
				)}
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
