/**
 * Generate a temporary ID for local-only entities (cart items, sales, adjustments).
 * Uses timestamp + random string to avoid collisions.
 *
 * @param {Object}  [options]
 * @param {string}  [options.prefix='']  Prefix before the timestamp (e.g. 'temp_')
 * @param {number}  [options.length=6]   Length of the random suffix
 * @returns {string}
 */
export function generateTempId({ prefix = '', length = 6 } = {}) {
	const rand = Math.random().toString(36).slice(2, 2 + length)
	return `${prefix}${Date.now()}-${rand}`
}
