const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

/** Check whether the API server is reachable. */
export async function ping() {
  try {
    await request('/categories', { method: 'HEAD' })
    return true
  } catch {
    return false
  }
}

// ─── Categories ────────────────────────────────────────────
export const getCategories = () => request('/categories')
export const createCategory = (name) => request('/categories', { method: 'POST', body: JSON.stringify({ name }) })
export const updateCategory = (id, name) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name }) })
export const deleteCategory = (id) => request(`/categories/${id}`, { method: 'DELETE' })

// ─── Products ──────────────────────────────────────────────
export const getProducts = (categoryId) => request(`/products${categoryId ? `?categoryId=${categoryId}` : ''}`)
export const getProduct = (id) => request(`/products/${id}`)
export const createProduct = (data) => request('/products', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct = (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' })

// ─── Presentations ─────────────────────────────────────────
export const getPresentations = (productId) => request(`/presentations${productId ? `?productId=${productId}` : ''}`)
export const createPresentation = (data) => request('/presentations', { method: 'POST', body: JSON.stringify(data) })
export const updatePresentation = (id, data) => request(`/presentations/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePresentation = (id) => request(`/presentations/${id}`, { method: 'DELETE' })
export const updateStock = (id, stock) => request(`/presentations/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) })

// ─── Shifts ────────────────────────────────────────────────
export const getShifts = () => request('/shifts')
export const getActiveShift = () => request('/shifts/active')
export const openShift = (openingCash) => request('/shifts', { method: 'POST', body: JSON.stringify({ openingCash }) })
export const addSale = (shiftId, sale) => request(`/shifts/${shiftId}/sales`, { method: 'POST', body: JSON.stringify(sale) })
export const syncSales = (shiftId, sales) => request(`/shifts/${shiftId}/sync`, { method: 'POST', body: JSON.stringify({ sales }) })
export const closeShift = (shiftId, closingCash, notes = '') =>
  request(`/shifts/${shiftId}/close`, { method: 'POST', body: JSON.stringify({ closingCash, notes }) })
