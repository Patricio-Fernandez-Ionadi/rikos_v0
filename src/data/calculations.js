export function getUnitsPerKg(grams) {
  if (grams == null || grams <= 0) return null
  return 1000 / grams
}

export function getCostPerPresentation(purchaseCost, grams) {
  if (purchaseCost == null) return null
  if (grams == null || grams <= 0) return purchaseCost
  const unitsPerKg = getUnitsPerKg(grams)
  return +(purchaseCost / unitsPerKg).toFixed(2)
}

export function getListPrice(costPerPresentation, margin) {
  if (costPerPresentation == null) return null
  if (margin == null) return costPerPresentation
  return +(costPerPresentation + (margin * costPerPresentation) / 100).toFixed(2)
}

export function getEquivalentPerKg(listPrice, grams) {
  if (listPrice == null || grams == null || grams <= 0) return null
  return +((listPrice / grams) * 1000).toFixed(2)
}

export function getPriceDifferencePercent(salePrice, listPrice) {
  if (salePrice == null || listPrice == null || listPrice === 0) return null
  return +(((salePrice * 100) / listPrice) - 100).toFixed(2)
}

export function getPriceDifference(salePrice, listPrice) {
  if (salePrice == null || listPrice == null) return null
  return +(salePrice - listPrice).toFixed(2)
}

export function calculate(product, presentation) {
  const unitsPerKg = getUnitsPerKg(presentation.grams)
  const costPerPresentation = getCostPerPresentation(product.purchaseCost, presentation.grams)
  const listPrice = getListPrice(costPerPresentation, presentation.margin)
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

export function calculateAll(products, presentations) {
  const map = new Map(products.map((p) => [p.id, p]))
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
