/**
 * Apply stock deduction for a single sale.
 * Returns updated copies of presentations and products arrays.
 *
 * @param {Object[]} presentations  Current presentations array
 * @param {Object[]} products       Current products array
 * @param {Object}   sale          Sale object with presentationId, quantity, etc.
 * @returns {{ presentations: Object[], products: Object[] }}
 */
export function applyStockDeduction(presentations, products, sale) {
	const pres = presentations.find((p) => p._id === sale.presentationId)
	if (!pres) return { presentations, products }

	const prod = products.find((p) => p._id === pres.productId)

	const updatedPres = presentations.map((p) =>
		p._id === sale.presentationId
			? { ...p, stock: Math.max(0, (p.stock ?? 0) - sale.quantity) }
			: p,
	)

	let updatedProds = products
	if (prod?.saleType === 'fraction' && pres.grams) {
		const deduction = sale.quantity * pres.grams
		updatedProds = products.map((p) =>
			p._id === prod._id
				? { ...p, stockGrams: Math.max(0, (p.stockGrams ?? 0) - deduction) }
				: p,
		)
	}

	return { presentations: updatedPres, products: updatedProds }
}

/**
 * Apply stock deduction for multiple items (batch, e.g. a ticket).
 * Each item must have presentationId/productId, quantity, saleType, and grams.
 *
 * @param {Object[]} presentations
 * @param {Object[]} products
 * @param {Object[]} items  Array of items with saleType, presentationId/productId, quantity, grams
 * @returns {{ presentations: Object[], products: Object[] }}
 */
export function applyBatchStockDeduction(presentations, products, items) {
	let updatedPres = presentations
	let updatedProds = products

	for (const item of items) {
		if (item.saleType === 'fraction') {
			const deduction = item.quantity * (item.grams ?? 0)
			updatedProds = updatedProds.map((p) =>
				p._id === item.productId
					? { ...p, stockGrams: Math.max(0, (p.stockGrams ?? 0) - deduction) }
					: p,
			)
		} else {
			updatedPres = updatedPres.map((p) =>
				p._id === item.presentationId
					? { ...p, stock: Math.max(0, (p.stock ?? 0) - item.quantity) }
					: p,
			)
		}
	}

	return { presentations: updatedPres, products: updatedProds }
}
