/**
 * Generates a unique ID using crypto.randomUUID when available,
 * falling back to a timestamp + random string.
 */
const ID = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

/** Creates a category object. */
export function createCategory({ _id = ID(), name }) {
  return { _id, name }
}

/** Creates a product object. */
export function createProduct({ _id = ID(), categoryId, name, purchaseCost = null }) {
  return { _id, categoryId, name, purchaseCost }
}

/** Creates a presentation object. */
export function createPresentation({ _id = ID(), productId, label = null, grams = null, margin = null, salePrice = null }) {
  return { _id, productId, label, grams, margin, salePrice }
}
