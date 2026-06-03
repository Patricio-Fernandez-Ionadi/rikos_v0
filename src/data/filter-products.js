/**
 * Filter products by category, tags, and/or search term.
 * Search matches product name, marca, and presentation labels.
 *
 * @param {Object[]} products       Full product list
 * @param {Object[]} presentations  Full presentation list
 * @param {Object}   [options]
 * @param {string}   [options.searchTerm='']  Text to search by name/marca/label
 * @param {string[]} [options.categoryIds=[]]  Array of category IDs to filter by
 * @param {string[]} [options.tags=[]]  Array of tag strings to filter by (OR logic)
 * @returns {Object[]} Filtered products
 */
export function filterProducts(
	products,
	presentations,
	{ searchTerm = '', categoryIds = [], tags = [] } = {},
) {
	const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds].filter(Boolean)

	let result = products
	if (ids.length > 0) {
		result = result.filter((p) => ids.includes(p.categoryId))
	}
	if (tags.length > 0) {
		result = result.filter((p) => {
			const productTags = p.tags ?? []
			return tags.some((t) => productTags.includes(t))
		})
	}
	if (searchTerm.trim()) {
		const term = searchTerm.trim().toLowerCase()
		result = result.filter((p) => {
			if (p.name.toLowerCase().includes(term)) return true
			if (p.marca && p.marca.toLowerCase().includes(term)) return true
			const labels = presentations
				.filter((pr) => pr.productId === p._id)
				.map((pr) => pr.label?.toLowerCase() ?? '')
			return labels.some((l) => l.includes(term))
		})
	}
	return result
}

/**
 * Like filterProducts but returns only the product IDs.
 *
 * @param {Object[]} products
 * @param {Object[]} presentations
 * @param {Object}   [options]
 * @returns {string[]}
 */
export function filterProductIds(products, presentations, options = {}) {
	return filterProducts(products, presentations, options).map((p) => p._id)
}
