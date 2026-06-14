import { useMemo } from 'react'
import { useCatalog } from '../../../../app/catalog-context.jsx'

export function useProductDetailData(productId) {
  const { categories, products, presentations, suppliers, productSuppliers } = useCatalog()

  const product = useMemo(
    () => products.find((p) => p._id === productId),
    [products, productId],
  )
  const productPres = useMemo(
    () => presentations.filter((p) => p.productId === productId),
    [presentations, productId],
  )
  const category = useMemo(
    () => categories.find((c) => c._id === product?.categoryId),
    [categories, product],
  )
  const isFraction = product?.saleType === 'fraction'

  const totalStock = useMemo(() => {
    if (!product) return 0
    if (isFraction) return product.stockGrams ?? 0
    return productPres.reduce((sum, p) => sum + (p.stock ?? 0), 0)
  }, [product, isFraction, productPres])

  const assignedSupplierIds = useMemo(
    () => productSuppliers.map((ps) => ps.supplierId),
    [productSuppliers],
  )
  const activeSupplier = useMemo(
    () =>
      productSuppliers.find((ps) => ps.purchaseCost === product?.purchaseCost)
        ?.supplierId,
    [productSuppliers, product],
  )
  const minSalePrice = useMemo(() => {
    const prices = productPres
      .map((p) => p.salePrice)
      .filter((p) => p != null)
    return prices.length > 0 ? Math.min(...prices) : null
  }, [productPres])
  const activeSupplierName = useMemo(
    () => suppliers.find((s) => s._id === activeSupplier)?.name ?? null,
    [suppliers, activeSupplier],
  )

  return { product, productPres, category, isFraction, totalStock, assignedSupplierIds, activeSupplier, minSalePrice, activeSupplierName }
}
