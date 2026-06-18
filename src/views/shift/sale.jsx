import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSaleCart } from '../../modules/shifts/sale-cart/sale-cart-manager.js'
import { ProductBrowser } from '../../modules/shifts/sale-cart/product-browser.jsx'
import { CartPanel } from '../../modules/shifts/sale-cart/cart-panel.jsx'
import { PromoSetView } from '../../modules/promo-sets/components/promo-set-list.jsx'

export const SalePage = () => {
	const navigate = useNavigate()
	const [showDrawer, setShowDrawer] = useState(false)
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
		handleUpdateItemQuantity,
		handleSubmit,
		promoSets,
		activeTab,
		setActiveTab,
		presInPromos,
		handleAddPromoToCart,
	} = useSaleCart()

	const cartProps = {
		cartItems,
		paymentMethod,
		setPaymentMethod,
		subtotal,
		discount,
		calcTotal,
		finalTotal,
		collectedTotal,
		setCollectedTotal,
		onRemoveItem: handleRemoveItem,
		onUpdateItemQuantity: handleUpdateItemQuantity,
		onSubmit: handleSubmit,
		onClose: () => navigate('/shifts'),
	}

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
						<PromoSetView
							promoSets={promoSets}
							onAddToCart={handleAddPromoToCart}
						/>
					</div>
				)}

				<div className='sale-cart__cart-desktop'>
					<CartPanel {...cartProps} />
				</div>
			</div>

			{cartItems.length > 0 && (
				<button
					className='sale-cart__cart-bar'
					onClick={() => setShowDrawer(true)}
				>
					<span className='sale-cart__cart-bar-info'>
						{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
					</span>
					<span className='sale-cart__cart-bar-total'>
						${finalTotal.toLocaleString()}
					</span>
					<span className='sale-cart__cart-bar-action'>Ver carrito</span>
				</button>
			)}

			{showDrawer && (
				<div
					className='sale-cart__drawer-overlay'
					onClick={() => setShowDrawer(false)}
				>
					<div
						className='sale-cart__drawer'
						onClick={(e) => e.stopPropagation()}
					>
						<CartPanel
							{...cartProps}
							isDrawer
							onDrawerClose={() => setShowDrawer(false)}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
