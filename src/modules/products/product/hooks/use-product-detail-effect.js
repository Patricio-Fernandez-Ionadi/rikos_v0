import { useEffect } from 'react'
import * as productService from '../../services/product-services.js'
import * as supplierService from '../../../suppliers/services/supplier-services.js'

export function useProductDetailEffect({ product, setProductSuppliers, setProducts }) {
  useEffect(() => {
    if (product) {
      supplierService
        .getProductSuppliers(product._id)
        .then((pss) => {
          setProductSuppliers(pss)
          if (pss.length > 0) {
            const activePs = pss.find(
              (ps) => ps.purchaseCost === product.purchaseCost,
            )
            if (!activePs) {
              const random = pss[Math.floor(Math.random() * pss.length)]
              productService
                .updateProduct(product._id, {
                  name: product.name,
                  purchaseCost: random.purchaseCost,
                  saleType: product.saleType,
                  stockGrams: product.stockGrams,
                })
                .then((updated) => {
                  setProducts((prev) =>
                    prev.map((p) => (p._id === updated._id ? updated : p)),
                  )
                })
                .catch(console.error)
            }
          }
        })
        .catch(console.error)
    }
  }, [product, setProductSuppliers, setProducts])
}
