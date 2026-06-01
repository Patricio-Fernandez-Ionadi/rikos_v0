import * as taskService from './services/task-services.js'

const STORAGE_KEY = 'rikos_tasks_v3'

/**
 * A task from the server or local fallback.
 * @typedef {Object} TaskItem
 * @property {string}  _id        — server ID (or temp ID)
 * @property {string}  type       — task category key
 * @property {string|null} productId — product ObjectId, null for name-based
 * @property {string}  name       — suggested product name (for productos-sugeridos)
 */

/** @returns {TaskItem[]} */
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** @param {TaskItem[]} tasks */
function saveLocal(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch { /* quota exceeded */ }
}

let cached = null // in-memory cache

function getCache() {
  if (!cached) cached = loadLocal()
  return cached
}

function setCache(tasks) {
  cached = tasks
  saveLocal(tasks)
}

/**
 * Initialize data: try fetching from server, fall back to localStorage.
 * Call once on app mount.
 * @returns {Promise<TaskItem[]>}
 */
export async function init() {
  try {
    const serverTasks = await taskService.getTasks()
    const mapped = serverTasks.map((t) => ({
      _id: t._id,
      type: t.type,
      productId: t.productId ?? null,
      name: t.name ?? '',
    }))
    setCache(mapped)
    return mapped
  } catch {
    return getCache()
  }
}

/** @returns {TaskItem[]} */
export function getAll() {
  return [...getCache()]
}

/**
 * Get all product IDs for a product-based task type.
 * @param {string} type
 * @returns {string[]}
 */
export function getProductIdsByType(type) {
  return getCache()
    .filter((t) => t.type === type && t.productId)
    .map((t) => t.productId)
}

/**
 * Get all name-based suggestions (productos-sugeridos).
 * @returns {TaskItem[]}
 */
export function getNameSuggestions() {
  return getCache().filter((t) => t.type === 'productos-sugeridos' && !t.productId && t.name)
}

/**
 * Get all tasks for a given product.
 * @param {string} productId
 * @returns {string[]} task type keys
 */
export function getProductTaskTypes(productId) {
  return getCache()
    .filter((t) => t.productId === productId)
    .map((t) => t.type)
}

/**
 * Toggle a product in a task type. Creates or deletes the server task.
 * Updates local cache optimistically.
 * @param {string} type
 * @param {string} productId
 * @returns {Promise<boolean>} new state (true = added)
 */
export async function toggleProductTask(type, productId) {
  const tasks = getCache()
  const existing = tasks.find((t) => t.type === type && t.productId === productId)

  if (existing) {
    setCache(tasks.filter((t) => t !== existing))
    try {
      await taskService.deleteTask(existing._id)
    } catch { /* keep local removal */ }
    return false
  }

  const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const newTask = { _id: tempId, type, productId, name: '' }
  setCache([...tasks, newTask])

  try {
    const created = await taskService.createTask({ type, productId })
    setCache(getCache().map((t) => (t._id === tempId ? { ...t, _id: created._id } : t)))
  } catch { /* keep local task */ }

  return true
}

/**
 * Add a suggested product name.
 * @param {string} name
 * @returns {Promise<void>}
 */
export async function addSuggestion(name) {
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const newTask = { _id: tempId, type: 'productos-sugeridos', productId: null, name }
  setCache([...getCache(), newTask])

  try {
    const created = await taskService.createTask({ type: 'productos-sugeridos', name })
    setCache(getCache().map((t) => (t._id === tempId ? { ...t, _id: created._id } : t)))
  } catch { /* keep local */ }
}

/**
 * Remove a name-based suggestion by its _id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function removeSuggestion(id) {
  const tasks = getCache()
  const target = tasks.find((t) => t._id === id || (t._id === id))
  if (!target) return

  setCache(tasks.filter((t) => t._id !== id))
  // Only delete from server if it has a real server ID (not temp)
  if (!id.startsWith('temp_')) {
    try {
      await taskService.deleteTask(id)
    } catch { /* keep local removal */ }
  }
}

/**
 * Remove a product from a task type by its _id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function removeTaskById(id) {
  const tasks = getCache()
  setCache(tasks.filter((t) => t._id !== id))

  if (!id.startsWith('temp_')) {
    try {
      await taskService.deleteTask(id)
    } catch { /* keep local removal */ }
  }
}
