const ID = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export function createCategory({ _id = ID(), name }) {
  return { _id, name }
}

export function createProduct({ _id = ID(), categoryId, name, purchaseCost = null }) {
  return { _id, categoryId, name, purchaseCost }
}

export function createPresentation({ _id = ID(), productId, label = null, grams = null, margin = null, salePrice = null }) {
  return { _id, productId, label, grams, margin, salePrice }
}
