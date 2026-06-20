const BASE = import.meta.env.VITE_API_URL || '/api'

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
export const updateStockGrams = (id, stockGrams) => request(`/products/${id}/stock-grams`, { method: 'PATCH', body: JSON.stringify({ stockGrams }) })

// ─── Presentations ─────────────────────────────────────────
export const getPresentations = (productId) => request(`/presentations${productId ? `?productId=${productId}` : ''}`)
export const createPresentation = (data) => request('/presentations', { method: 'POST', body: JSON.stringify(data) })
export const updatePresentation = (id, data) => request(`/presentations/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePresentation = (id) => request(`/presentations/${id}`, { method: 'DELETE' })
export const updateStock = (id, stock) => request(`/presentations/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) })
export const renumberPresentations = () => request('/presentations/renumber', { method: 'POST' })

// ─── Shifts ────────────────────────────────────────────────
export const getShifts = () => request('/shifts')
export const getActiveShift = () => request('/shifts/active')
export const openShift = (openingCash) => request('/shifts', { method: 'POST', body: JSON.stringify({ openingCash }) })
export const addSale = (shiftId, sale) => request(`/shifts/${shiftId}/sales`, { method: 'POST', body: JSON.stringify(sale) })
export const syncSales = (shiftId, sales) => request(`/shifts/${shiftId}/sync`, { method: 'POST', body: JSON.stringify({ sales }) })
export const recordTicket = (shiftId, data) =>
  request(`/shifts/${shiftId}/ticket`, { method: 'POST', body: JSON.stringify(data) })
export const closeShift = (shiftId, closingCash, notes = '') =>
  request(`/shifts/${shiftId}/close`, { method: 'POST', body: JSON.stringify({ closingCash, notes }) })
export const updateSale = (shiftId, saleId, data) =>
  request(`/shifts/${shiftId}/sales/${saleId}`, { method: 'PATCH', body: JSON.stringify(data) })
export const deleteSale = (shiftId, saleId) =>
  request(`/shifts/${shiftId}/sales/${saleId}`, { method: 'DELETE' })
export const addAdjustment = (shiftId, data) =>
  request(`/shifts/${shiftId}/adjustments`, { method: 'PATCH', body: JSON.stringify(data) })

// ─── Orders ────────────────────────────────────────────────
export const getOrders = (status) => request(`/orders${status ? `?status=${status}` : ''}`)
export const getOrder = (id) => request(`/orders/${id}`)
export const createOrder = (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) })
export const updateOrder = (id, data) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteOrder = (id) => request(`/orders/${id}`, { method: 'DELETE' })
export const addItemToOrder = (id, item) => request(`/orders/${id}/items`, { method: 'PATCH', body: JSON.stringify(item) })
export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

// ─── Tasks ─────────────────────────────────────────────────
export const getTasks = () => request('/tasks')
export const createTask = (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) })
export const updateTaskNote = (id, note) => request(`/tasks/${id}/note`, { method: 'PATCH', body: JSON.stringify({ note }) })
export const updateTaskStatus = (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' })

// ─── Tickets ───────────────────────────────────────────────
export const getTickets = (status) => request(`/tickets${status ? `?status=${status}` : ''}`)
export const createTicket = (data) => request('/tickets', { method: 'POST', body: JSON.stringify(data) })
export const updateTicketStatus = (id, status) => request(`/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const deleteTicket = (id) => request(`/tickets/${id}`, { method: 'DELETE' })

// ─── Suppliers ─────────────────────────────────────────────
export const getSuppliers = () => request('/suppliers')
export const getSupplier = (id) => request(`/suppliers/${id}`)
export const createSupplier = (data) => request('/suppliers', { method: 'POST', body: JSON.stringify(data) })
export const updateSupplier = (id, data) => request(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteSupplier = (id) => request(`/suppliers/${id}`, { method: 'DELETE' })

// ─── Product-Supplier links ────────────────────────────────
export const getProductSuppliers = (productId) => request(`/product-suppliers${productId ? `?productId=${productId}` : ''}`)
export const getProductSuppliersBySupplier = (supplierId) => request(`/product-suppliers?supplierId=${supplierId}`)
export const createProductSupplier = (data) => request('/product-suppliers', { method: 'POST', body: JSON.stringify(data) })
export const updateProductSupplier = (id, data) => request(`/product-suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProductSupplier = (id) => request(`/product-suppliers/${id}`, { method: 'DELETE' })

// ─── Promo Sets ──────────────────────────────────────────────
export const getPromoSets = (all) => request(`/promo-sets${all ? '?all=true' : ''}`)
export const getPromoSet = (id) => request(`/promo-sets/${id}`)
export const createPromoSet = (data) => request('/promo-sets', { method: 'POST', body: JSON.stringify(data) })
export const updatePromoSet = (id, data) => request(`/promo-sets/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePromoSet = (id) => request(`/promo-sets/${id}`, { method: 'DELETE' })

// ─── Backup ───────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_API_KEY || ''
const authHeaders = API_KEY ? { 'x-api-key': API_KEY } : {}

export const exportBackup = (scope) => request(`/backup/export?scope=${scope}`, { headers: authHeaders })
export const restoreBackup = (data) => request('/backup/restore', { method: 'POST', body: JSON.stringify(data), headers: authHeaders })
