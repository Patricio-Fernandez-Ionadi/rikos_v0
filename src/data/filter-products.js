/**
 * Filter products by category, tags, search term, and/or supplier name.
 * Search matches product name, marca, presentation labels, and supplier names.
 *
 * @param {Object[]} products       Full product list
 * @param {Object[]} presentations  Full presentation list
 * @param {Object}   [options]
 * @param {string}   [options.searchTerm='']  Text to search by name/marca/label/supplier
 * @param {string[]} [options.categoryIds=[]]  Array of category IDs to filter by
 * @param {string[]} [options.tags=[]]  Array of tag strings to filter by (OR logic)
 * @param {Object[]} [options.suppliers]  Suppliers list (enables supplier name search)
 * @param {Object[]} [options.productSuppliers]  Links products to suppliers
 * @returns {Object[]} Filtered products
 */
export function filterProducts(
	products,
	presentations,
	{ searchTerm = '', categoryIds = [], tags = [], suppliers, productSuppliers } = {},
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
		const termNum = parseInt(term, 10)
		const isNumeric = !isNaN(termNum) && String(termNum) === term

		const supplierNameById = {}
		suppliers?.forEach((s) => { supplierNameById[s._id] = (s.name ?? '').toLowerCase() })

		const productToSupplierIds = {}
		productSuppliers?.forEach((ps) => {
			if (!productToSupplierIds[ps.productId]) productToSupplierIds[ps.productId] = []
			productToSupplierIds[ps.productId].push(ps.supplierId)
		})

		const productToCodes = {}
		if (isNumeric) {
			presentations.forEach((pr) => {
				if (pr.code != null) {
					if (!productToCodes[pr.productId]) productToCodes[pr.productId] = []
					productToCodes[pr.productId].push(pr.code)
				}
			})
		}

		result = result.filter((p) => {
			if (p.name.toLowerCase().includes(term)) return true
			if (p.marca && p.marca.toLowerCase().includes(term)) return true

			const labels = presentations
				.filter((pr) => pr.productId === p._id)
				.map((pr) => pr.label?.toLowerCase() ?? '')
			if (labels.some((l) => l.includes(term))) return true

			const codes = productToCodes[p._id]
			if (codes && codes.some((c) => String(c).includes(term))) return true

			const sids = productToSupplierIds[p._id] ?? []
			if (sids.some((sid) => supplierNameById[sid]?.includes(term))) return true

			return false
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

/**
 * Find a presentation by exact code match.
 * Returns the presentation object or null.
 */
export function findPresentationByCode(presentations, code) {
	const num = parseInt(code, 10)
	if (isNaN(num)) return null
	return presentations.find((p) => p.code === num) ?? null
}
