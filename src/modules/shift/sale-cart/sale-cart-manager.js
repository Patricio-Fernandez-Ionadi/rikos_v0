import { useState, useMemo, useRef, useEffect } from 'react'
import { useData } from '../../../app/data-context.jsx'
import { useShift } from '../shift-context.jsx'

export function useSaleCart() {
	const { products, presentations, setProducts, setPresentations } = useData()
	const { recordTicket } = useShift()

	const [cartItems, setCartItems] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedProductId, setSelectedProductId] = useState(null)
	const [selectedPresId, setSelectedPresId] = useState(null)
	const [quantity, setQuantity] = useState(1)
	const [paymentMethod, setPaymentMethod] = useState('electronic')

	const searchRef = useRef(null)

	useEffect(() => {
		searchRef.current?.focus()
	}, [])

	const filteredProducts = useMemo(() => {
		if (!searchQuery.trim()) return products
		const q = searchQuery.toLowerCase()
		return products.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				(p.marca && p.marca.toLowerCase().includes(q)),
		)
	}, [products, searchQuery])

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
				_cartId: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
	}

	const handleRemoveItem = (cartId) => {
		setCartItems((prev) => prev.filter((i) => i._cartId !== cartId))
	}

	const subtotal = cartItems.reduce((s, i) => s + i.total, 0)
	const discount = paymentMethod === 'cash' ? subtotal * 0.1 : 0
	const total = subtotal - discount

	const handleSubmit = async (onClose) => {
		if (cartItems.length === 0) return
		const ticketId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

		const items = cartItems.map((i) => ({
			productId: i.productId,
			presentationId: i.presentationId,
			quantity: i.quantity,
			unitPrice: i.unitPrice,
			total: i.total,
		}))

		await recordTicket(ticketId, paymentMethod, items)

		for (const item of cartItems) {
			if (item.saleType === 'fraction') {
				const deduction = item.quantity * (item.grams ?? 0)
				setProducts((prev) =>
					prev.map((p) =>
						p._id === item.productId
							? {
									...p,
									stockGrams: Math.max(0, (p.stockGrams ?? 0) - deduction),
								}
							: p,
					),
				)
			} else {
				setPresentations((prev) =>
					prev.map((p) =>
						p._id === item.presentationId
							? {
									...p,
									stock: Math.max(0, (p.stock ?? 0) - item.quantity),
								}
							: p,
					),
				)
			}
		}

		setCartItems([])
		setSelectedProductId(null)
		setSelectedPresId(null)
		onClose()
	}

	return {
		cartItems,
		searchQuery,
		setSearchQuery,
		selectedProductId,
		setSelectedProductId,
		selectedPresId,
		setSelectedPresId,
		quantity,
		setQuantity,
		paymentMethod,
		setPaymentMethod,
		searchRef,
		filteredProducts,
		selectedProduct,
		productPres,
		selectedPres,
		isFraction,
		subtotal,
		discount,
		total,
		handleAddToCart,
		handleRemoveItem,
		handleSubmit,
	}
}
