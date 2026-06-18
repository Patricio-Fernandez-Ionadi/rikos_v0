import * as shiftService from './shift-services.js'

/**
 * Ensure a database shift record exists, returning its _id.
 * If dbId already exists, returns it. Otherwise tries to find an active
 * shift on the server or creates a new one.
 *
 * @param {string|null} dbId   Current _dbId from local state
 * @param {number}      openingCash  Opening cash for new shift if needed
 * @returns {Promise<string|null>} The database _id, or null on failure
 */
export async function ensureDbShift(dbId, openingCash) {
	if (dbId) return dbId
	try {
		const active = await shiftService.getActiveShift()
		if (active?._id) return active._id
		const dbShift = await shiftService.openShift(openingCash)
		return dbShift._id
	} catch {
		return null
	}
}

/**
 * Calculate adjusted totals for ticket items based on collected vs items total.
 * Returns items with adjusted `total` and the diff breakdown.
 *
 * @param {Array}  items          Ticket items with { total, ... }
 * @param {number} [collectedTotal]  Amount actually collected (may differ from items total)
 * @returns {Array} Items with adjusted totals
 */
export function prepareTicketItems(items, collectedTotal) {
	const itemsTotal = items.reduce((s, i) => s + (i.total ?? 0), 0)
	const diff = collectedTotal != null ? +(collectedTotal - itemsTotal).toFixed(2) : 0

	return items.map((item) => {
		const ratio = itemsTotal > 0 ? (item.total ?? 0) / itemsTotal : 0
		const adjustedTotal = diff !== 0 && ratio > 0
			? +(item.total + diff * ratio).toFixed(2)
			: null
		return {
			...item,
			total: adjustedTotal ?? item.total,
			adjustedTotal,
		}
	})
}
