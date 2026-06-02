import * as taskService from './services/task-services.js'

const STORAGE_KEY = 'rikos_tasks_v3'

/**
 * A task from the server or local fallback.
 * @typedef {Object} TaskItem
 * @property {string}  _id        — server ID (or temp ID)
 * @property {string}  type       — task category key
 * @property {string|null} productId — product ObjectId, null for name-based
 * @property {string}  name       — suggested product name / description
 * @property {string}  note       — additional detail (quantity, instruction, etc.)
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

let cached = null

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
      note: t.note ?? '',
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
 * Get all tasks for a given type (includes both product and text-based items).
 * @param {string} type
 * @returns {TaskItem[]}
 */
export function getTasksByType(type) {
  return getCache().filter((t) => t.type === type)
}

/**
 * Get all name-based suggestions (productos-sugeridos).
 * @returns {TaskItem[]}
 */
export function getNameSuggestions() {
  return getCache().filter((t) => t.type === 'productos-sugeridos' && !t.productId && t.name)
}

/**
 * Get all task types for a given product.
 * @param {string} productId
 * @returns {string[]}
 */
export function getProductTaskTypes(productId) {
  return getCache()
    .filter((t) => t.productId === productId)
    .map((t) => t.type)
}

/**
 * Toggle a product in a task type. Creates or deletes the server task.
 * @param {string} type
 * @param {string} productId
 * @param {string} [note]
 * @returns {Promise<boolean>} new state (true = added)
 */
export async function toggleProductTask(type, productId, note = '') {
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
  const newTask = { _id: tempId, type, productId, name: '', note }
  setCache([...tasks, newTask])

  try {
    const created = await taskService.createTask({ type, productId, note })
    setCache(getCache().map((t) => (t._id === tempId ? { ...t, _id: created._id } : t)))
  } catch { /* keep local task */ }

  return true
}

/**
 * Add a suggested product name (productos-sugeridos).
 * @param {string} name
 * @param {string} [note]
 * @returns {Promise<void>}
 */
export async function addSuggestion(name, note = '') {
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const newTask = { _id: tempId, type: 'productos-sugeridos', productId: null, name, note }
  setCache([...getCache(), newTask])

  try {
    const created = await taskService.createTask({ type: 'productos-sugeridos', name, note })
    setCache(getCache().map((t) => (t._id === tempId ? { ...t, _id: created._id } : t)))
  } catch { /* keep local */ }
}

/**
 * Add a text-based task item (for "Otros" and other categories that need descriptions).
 * @param {string} type
 * @param {string} description
 * @param {string|null} [productId]
 * @param {string} [note]
 * @returns {Promise<void>}
 */
export async function addTextTask(type, description, productId = null, note = '') {
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  const newTask = { _id: tempId, type, productId, name: description, note }
  setCache([...getCache(), newTask])

  try {
    const created = await taskService.createTask({ type, productId, name: description, note })
    setCache(getCache().map((t) => (t._id === tempId ? { ...t, _id: created._id } : t)))
  } catch { /* keep local */ }
}

/**
 * Update a task's note.
 * @param {string} id
 * @param {string} note
 * @returns {Promise<void>}
 */
export async function updateNote(id, note) {
  setCache(getCache().map((t) => (t._id === id ? { ...t, note } : t)))

  if (!id.startsWith('temp_')) {
    try {
      await taskService.updateNote(id, note)
    } catch { /* keep local update */ }
  }
}

/**
 * Remove a suggestion by its _id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function removeSuggestion(id) {
  const tasks = getCache()
  const target = tasks.find((t) => t._id === id)
  if (!target) return

  setCache(tasks.filter((t) => t._id !== id))
  if (!id.startsWith('temp_')) {
    try {
      await taskService.deleteTask(id)
    } catch { /* keep local removal */ }
  }
}

/**
 * Remove a task by its _id.
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
