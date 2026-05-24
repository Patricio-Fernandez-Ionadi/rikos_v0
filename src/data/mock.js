import { createCategory, createProduct, createPresentation } from './entities.js'

export const categories = [
  createCategory({ id: 'cat-1', name: 'Aceites y Vinagres' }),
  createCategory({ id: 'cat-2', name: 'Condimentos y Especias' }),
  createCategory({ id: 'cat-3', name: 'Frutos Secos' }),
  createCategory({ id: 'cat-4', name: 'Cereales y Legumbres' }),
]

export const products = [
  createProduct({ id: 'prod-1', categoryId: 'cat-1', name: 'Aceite de Coco Entrenuts', purchaseCost: 5578 }),
  createProduct({ id: 'prod-2', categoryId: 'cat-1', name: 'Aceite de Oliva Oleovares', purchaseCost: 5320 }),
  createProduct({ id: 'prod-3', categoryId: 'cat-2', name: 'Ají', purchaseCost: 6077 }),
  createProduct({ id: 'prod-4', categoryId: 'cat-2', name: 'Ajo en Polvo', purchaseCost: 6897 }),
  createProduct({ id: 'prod-5', categoryId: 'cat-7', name: 'Alfajor Abuela Mecha', purchaseCost: null }),
  createProduct({ id: 'prod-6', categoryId: 'cat-3', name: 'Almendras 25/27', purchaseCost: 20000 }),
  createProduct({ id: 'prod-7', categoryId: 'cat-2', name: 'Bicarbonato de Sodio', purchaseCost: 2697 }),
  createProduct({ id: 'prod-8', categoryId: 'cat-2', name: 'Pimienta Negra', purchaseCost: null }),
]

export const presentations = [
  createPresentation({ id: 'pres-1', productId: 'prod-1', label: '360g', grams: null, margin: 30, salePrice: 7990 }),
  createPresentation({ id: 'pres-2', productId: 'prod-2', label: 'Unidad', grams: null, margin: 50, salePrice: 8800 }),
  createPresentation({ id: 'pres-3', productId: 'prod-3', label: '50g', grams: 50, margin: 80, salePrice: 790 }),
  createPresentation({ id: 'pres-4', productId: 'prod-4', label: '50g', grams: 50, margin: 50, salePrice: 700 }),
  createPresentation({ id: 'pres-5', productId: 'prod-5', label: 'Unidad', grams: null, margin: 70, salePrice: 950 }),
  createPresentation({ id: 'pres-6', productId: 'prod-6', label: '100g', grams: 100, margin: 60, salePrice: 3700 }),
  createPresentation({ id: 'pres-7', productId: 'prod-7', label: '200g', grams: 200, margin: null, salePrice: null }),
  createPresentation({ id: 'pres-8', productId: 'prod-7', label: '500g', grams: 500, margin: 70, salePrice: 1500 }),
  createPresentation({ id: 'pres-9', productId: 'prod-8', label: '50g', grams: 50, margin: 90, salePrice: 1900 }),
  createPresentation({ id: 'pres-10', productId: 'prod-8', label: '100g', grams: 100, margin: 80, salePrice: 3500 }),
]

export { createCategory, createProduct, createPresentation } from './entities.js'
