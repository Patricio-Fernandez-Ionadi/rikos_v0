const ID = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export function createCategory({ id = ID(), name }) {
  return { id, name }
}

export function createProduct({ id = ID(), categoryId, name, purchaseCost = null }) {
  return { id, categoryId, name, purchaseCost }
}

export function createPresentation({ id = ID(), productId, label = null, grams = null, margin = null, salePrice = null }) {
  return { id, productId, label, grams, margin, salePrice }
}
