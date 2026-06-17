import * as api from '../../../data/api.js'

export function getPromoSets(all = false) {
  return api.getPromoSets(all)
}

export function getPromoSet(id) {
  return api.getPromoSet(id)
}

export function createPromoSet(data) {
  return api.createPromoSet(data)
}

export function updatePromoSet(id, data) {
  return api.updatePromoSet(id, data)
}

export function deletePromoSet(id) {
  return api.deletePromoSet(id)
}
