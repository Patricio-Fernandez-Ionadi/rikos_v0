import seed from './seed.json' with { type: 'json' }

export const categories = seed.categories || []
export const products = seed.products || []
export const presentations = seed.presentations || []
export const suppliers = seed.suppliers || []
export const productSuppliers = seed.productSuppliers || []
