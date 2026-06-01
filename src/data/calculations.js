/** Returns the number of units per kilogram, or null when grams are not set. */
export function getUnitsPerKg(grams) {
  if (grams == null || grams <= 0) return null
  return 1000 / grams
}

/**
 * Returns the cost for a single presentation, prorating by grams.
 * Returns null when purchaseCost is unknown.
 * When grams is null or zero, returns the full purchaseCost (whole product).
 */
export function getCostPerPresentation(purchaseCost, grams) {
  if (purchaseCost == null) return null
  if (grams == null || grams <= 0) return purchaseCost
  const unitsPerKg = getUnitsPerKg(grams)
  return +(purchaseCost / unitsPerKg).toFixed(2)
}

/**
 * Returns the suggested list price after applying margin.
 * Returns null when cost is unknown.
 * Returns cost when margin is not set (sell at cost).
 */
export function getListPrice(costPerPresentation, margin) {
  if (costPerPresentation == null) return null
  if (margin == null) return costPerPresentation
  return +(costPerPresentation + (margin * costPerPresentation) / 100).toFixed(2)
}

/** Returns the equivalent price per kg, or null when not applicable (whole product, no list price). */
export function getEquivalentPerKg(listPrice, grams) {
  if (listPrice == null || grams == null || grams <= 0) return null
  return +((listPrice / grams) * 1000).toFixed(2)
}

/**
 * Returns the percentage difference between salePrice and listPrice.
 * Positive means the product is sold above the suggested price.
 * Returns null when either price is missing or listPrice is zero.
 */
export function getPriceDifferencePercent(salePrice, listPrice) {
  if (salePrice == null || listPrice == null || listPrice === 0) return null
  return +(((salePrice * 100) / listPrice) - 100).toFixed(2)
}

/**
 * Returns the absolute difference between salePrice and listPrice.
 * Returns null when either price is missing.
 */
export function getPriceDifference(salePrice, listPrice) {
  if (salePrice == null || listPrice == null) return null
  return +(salePrice - listPrice).toFixed(2)
}

/**
 * Calculates all derived fields for a single product + presentation pair.
 * Nothing is persisted; every value is computed on read.
 */
export function calculate(product, presentation) {
  const unitsPerKg = getUnitsPerKg(presentation.grams)
  const costPerPresentation = getCostPerPresentation(product.purchaseCost, presentation.grams)
  const listPrice = getListPrice(costPerPresentation, product.margin)
  const equivalentPerKg = getEquivalentPerKg(listPrice, presentation.grams)
  const priceDifferencePercent = getPriceDifferencePercent(presentation.salePrice, listPrice)
  const priceDifference = getPriceDifference(presentation.salePrice, listPrice)

  return {
    unitsPerKg,
    costPerPresentation,
    listPrice,
    equivalentPerKg,
    priceDifferencePercent,
    priceDifference,
  }
}

/**
 * Maps over all presentations, looking up their parent product,
 * and returns an array of { presentation, product, calculations } objects.
 * When a product is not found, product and calculations are null.
 */
export function calculateAll(products, presentations) {
  const map = new Map(products.map((p) => [p._id, p]))
  return presentations.map((pres) => {
    const product = map.get(pres.productId)
    if (!product) return { presentation: pres, product: null, calculations: null }
    return {
      presentation: pres,
      product,
      calculations: calculate(product, pres),
    }
  })
}
