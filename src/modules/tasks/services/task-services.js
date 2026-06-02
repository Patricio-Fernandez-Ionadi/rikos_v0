import * as api from '../../../data/api.js'

export const getTasks = () => api.getTasks()
export const createTask = (data) => api.createTask(data)
export const updateNote = (id, note) => api.updateTaskNote(id, note)
export const deleteTask = (id) => api.deleteTask(id)
