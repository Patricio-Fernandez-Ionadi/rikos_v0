import { useState, useMemo, useRef, useEffect } from 'react'
import { useCatalog } from '../../../app/catalog-context.jsx'
import { useShift } from '../shift-context.jsx'
import { generateTempId } from '../../../data/entities.js'
import { filterProducts } from '../../../data/filter-products.js'
import { applyBatchStockDeduction } from '../../../data/stock-utils.js'

export function useSaleCart() {
	const { products, presentations, categories, tags, setProducts, setPresentations } = useCatalog()
	const { recordTicket } = useShift()

	const [cartItems, setCartItems] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('')
	const [selectedTags, setSelectedTags] = useState([])
	const [selectedProductId, setSelectedProductId] = useState(null)
	const [selectedPresId, setSelectedPresId] = useState(null)
	const [quantity, setQuantity] = useState(1)
	const [paymentMethod, setPaymentMethod] = useState('electronic')
	const [collectedTotal, setCollectedTotal] = useState(null)

	const searchRef = useRef(null)

	useEffect(() => {
		searchRef.current?.focus()
	}, [])

	const filteredProducts = useMemo(() => {
		return filterProducts(products, presentations, {
			searchTerm: searchQuery,
			categoryIds: selectedCategory ? [selectedCategory] : [],
			tags: selectedTags,
		})
	}, [products, presentations, searchQuery, selectedCategory, selectedTags])

	const selectedProduct = useMemo(
		() => products.find((p) => p._id === selectedProductId),
		[products, selectedProductId],
	)

	const productPres = useMemo(
		() => presentations.filter((p) => p.productId === selectedProductId),
		[presentations, selectedProductId],
	)

	const selectedPres = useMemo(
		() => productPres.find((p) => p._id === selectedPresId),
		[productPres, selectedPresId],
	)

	const isFraction = selectedProduct?.saleType === 'fraction'

	const handleAddToCart = () => {
		const qty = Math.max(1, parseInt(quantity) || 1)
		if (!selectedPres || !selectedProduct) return
		setCartItems((prev) => [
			...prev,
			{
				_cartId: generateTempId(),
				productId: selectedProduct._id,
				presentationId: selectedPres._id,
				productName: selectedProduct.name,
				presLabel: selectedPres.label,
				saleType: selectedProduct.saleType,
				grams: selectedPres.grams,
				quantity: qty,
				unitPrice: selectedPres.salePrice ?? 0,
				total: qty * (selectedPres.salePrice ?? 0),
			},
		])
		setQuantity(1)
		setSelectedPresId(null)
		setSelectedProductId(null)
	}

	const handleRemoveItem = (cartId) => {
		setCartItems((prev) => prev.filter((i) => i._cartId !== cartId))
	}

	const subtotal = cartItems.reduce((s, i) => s + i.total, 0)
	const discount = paymentMethod === 'cash' ? subtotal * 0.1 : 0
	const calcTotal = subtotal - discount
	const finalTotal = collectedTotal != null ? collectedTotal : calcTotal

	// Reset collectedTotal when payment method or cart changes
	useEffect(() => {
		setCollectedTotal(null)
	}, [paymentMethod, cartItems.length])

	const handleSubmit = async (onClose) => {
		if (cartItems.length === 0) return
		const ticketId = generateTempId({ length: 8 })

		const items = cartItems.map((i) => ({
			productId: i.productId,
			presentationId: i.presentationId,
			quantity: i.quantity,
			unitPrice: i.unitPrice,
			total: i.total,
		}))

		await recordTicket(ticketId, paymentMethod, items, finalTotal)

		const result = applyBatchStockDeduction(presentations, products, cartItems)
		setPresentations(result.presentations)
		setProducts(result.products)

		setCartItems([])
		setSelectedProductId(null)
		setSelectedPresId(null)
		onClose()
	}

	return {
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
		selectedPres,
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
	}
}
