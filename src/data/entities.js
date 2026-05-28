const ID = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export function createCategory({ _id = ID(), name }) {
  return { _id, name }
}

export function createProduct({ _id = ID(), categoryId, name, purchaseCost = null, saleType = 'unit', stockGrams = null }) {
  return { _id, categoryId, name, purchaseCost, saleType, stockGrams }
}

export function createPresentation({ _id = ID(), productId, label = null, grams = null, margin = null, salePrice = null, stock = 0 }) {
  return { _id, productId, label, grams, margin, salePrice, stock }
}

export function createSupplier({ _id = ID(), name, contactName = null, phone = null, email = null, notes = '' }) {
  return { _id, name, contactName, phone, email, notes }
}

export function createProductSupplier({ _id = ID(), productId, supplierId, purchaseCost }) {
  return { _id, productId, supplierId, purchaseCost }
}
