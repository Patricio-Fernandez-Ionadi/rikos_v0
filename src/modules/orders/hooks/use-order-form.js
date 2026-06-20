import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCatalog } from '../../../app/catalog-context.jsx'
import { useOrders } from '../order-manager.js'
import * as orderService from '../services/order-services.js'
import * as supplierService from '../../suppliers/services/supplier-services.js'
import * as productService from '../../products/services/product-services.js'

const NEW_SUPPLIER_VALUE = '__new__'

function itemKey(item) {
  return item.presentationId ? `${item.productId}-${item.presentationId}` : item.productId
}

export function useOrderForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { suppliers, products, presentations, categories, setProducts, setSuppliers, setProductSuppliers } = useCatalog()
  const { createOrder, updateOrder } = useOrders()

  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(isEditing)
  const [supplierProducts, setSupplierProducts] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')

  const handleCreateSupplier = useCallback(async (name, contact, phone, email) => {
    const created = await supplierService.createSupplier({
      name: name.trim(), contactName: contact.trim() || null,
      phone: phone.trim() || null, email: email.trim() || null, notes: '',
    })
    setSuppliers((prev) => [...prev, created])
    setSupplierId(created._id)
  }, [setSuppliers])

  useEffect(() => {
    if (!supplierId || supplierId === NEW_SUPPLIER_VALUE) { setSupplierProducts([]); return }
    supplierService.getProductSuppliersBySupplier(supplierId)
      .then(setSupplierProducts)
      .catch(() => setSupplierProducts([]))
  }, [supplierId])

  useEffect(() => {
    if (!id) return
    orderService.getOrder(id).then((order) => {
      setSupplierId(order.supplierId)
      setItems(order.items.map((i) => ({
        productId: i.productId, productName: i.productName,
        presentationId: i.presentationId ?? null,
        presentationLabel: i.presentationLabel ?? null,
        presentationCode: i.presentationCode ?? null,
        quantity: i.quantity, unitCost: i.unitCost,
      })))
      setNotes(order.notes ?? '')
    }).catch(() => navigate('/orders')).finally(() => setLoading(false))
  }, [id, navigate])

  const supplierName = useMemo(
    () => suppliers.find((s) => s._id === supplierId)?.name ?? '',
    [suppliers, supplierId],
  )

  const productMap = useMemo(() => {
    const map = new Map()
    for (const p of products) map.set(p._id, p)
    return map
  }, [products])

  const filteredProducts = useMemo(() => {
    const addedKeys = new Set(items.map(itemKey))
    return products
      .filter((p) => !addedKeys.has(p._id))
      .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [products, items, searchQuery])

  const totalCost = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0),
    [items],
  )

  const addedProductIds = useMemo(() => new Set(items.map(itemKey)), [items])

  const handleAddItem = useCallback((product, cost, unitLabel, presentation) => {
    setItems((prev) => {
      const key = presentation ? `${product._id}-${presentation._id}` : product._id
      if (prev.some((i) => itemKey(i) === key)) return prev
      return [...prev, {
        productId: product._id,
        productName: product.name,
        presentationId: presentation?._id ?? null,
        presentationLabel: presentation?.label ?? null,
        presentationCode: presentation?.code ?? null,
        quantity: 1,
        unitCost: cost ?? product.purchaseCost ?? 0,
        unitLabel: unitLabel ?? '',
      }]
    })
  }, [])

  const handleRemoveItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key))
  }, [])

  const handleQuantityChange = useCallback((key, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i) === key ? { ...i, quantity: Math.max(1, parseInt(quantity) || 1) } : i,
      ),
    )
  }, [])

  const handleCostChange = useCallback((key, cost) => {
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i) === key ? { ...i, unitCost: parseFloat(cost) || 0 } : i,
      ),
    )
  }, [])

  const handleAddSearchedProduct = useCallback(async () => {
    const prod = products.find((p) => p._id === selectedProductId)
    if (!prod) return

    const existingPS = supplierProducts.find((sp) => sp.productId === prod._id)
    const isFraction = prod?.saleType === 'fraction'
    const unitLabel = isFraction ? 'kg' : 'Unidad'
    if (existingPS) {
      handleAddItem(prod, existingPS.purchaseCost, unitLabel)
    } else {
      const costStr = window.prompt(`Costo de "${prod.name}" para ${supplierName}:`, prod.purchaseCost ?? '')
      if (costStr === null) { setSelectedProductId(''); return }
      const cost = parseFloat(costStr)
      if (isNaN(cost) || cost < 0) return

      try {
        const ps = await supplierService.createProductSupplier({
          productId: prod._id, supplierId, purchaseCost: cost,
          bultoUnits: isFraction ? null : 1,
          bultoKg: isFraction ? 1 : null,
        })
        setProductSuppliers((prev) => [...prev, ps])
        setSupplierProducts((prev) => [...prev, ps])
      } catch { /* ignore */ }

      handleAddItem(prod, cost, unitLabel)
    }
    setSelectedProductId('')
    setSearchQuery('')
  }, [products, supplierProducts, handleAddItem, supplierId, supplierName, selectedProductId, setProductSuppliers])

  const presentationMap = useMemo(() => {
    const map = new Map()
    for (const p of presentations) {
      if (!map.has(p.productId)) map.set(p.productId, [])
      map.get(p.productId).push(p)
    }
    return map
  }, [presentations])

  const handleCreateAndAdd = useCallback(async (name, catId, cost) => {
    const created = await productService.createProduct({
      categoryId: catId, name: name.trim(), purchaseCost: parseFloat(cost),
    })
    setProducts((prev) => [...prev, created])

    if (supplierId) {
      const ps = await supplierService.createProductSupplier({
        productId: created._id, supplierId, purchaseCost: parseFloat(cost),
        bultoUnits: 1, bultoKg: null,
      })
      setProductSuppliers((prev) => [...prev, ps])
      setSupplierProducts((prev) => [...prev, ps])
    }

    handleAddItem(created, parseFloat(cost), 'Unidad')
  }, [supplierId, setProducts, setProductSuppliers, handleAddItem])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!supplierId || items.length === 0) return
    const data = { supplierId, supplierName, items, notes }
    if (isEditing) {
      await updateOrder(id, data)
    } else {
      await createOrder(data)
    }
    navigate('/orders')
  }, [supplierId, supplierName, items, notes, isEditing, id, createOrder, updateOrder, navigate])

  const handleSupplierChange = useCallback((e) => {
    if (e.target.value === NEW_SUPPLIER_VALUE) {
      setSupplierId(NEW_SUPPLIER_VALUE)
      return
    }
    setSupplierId(e.target.value)
    setItems([])
  }, [])

  return {
    isEditing, loading, navigate,
    supplierId, supplierName, supplierProducts, items, notes, setNotes, totalCost,
    searchQuery, setSearchQuery,
    selectedProductId, setSelectedProductId,
    filteredProducts, addedProductIds, productMap,
    categories, suppliers, products, presentations,
    presentationMap,
    handleSupplierChange,
    handleAddItem,
    handleRemoveItem,
    handleQuantityChange,
    handleCostChange,
    handleAddSearchedProduct,
    handleCreateAndAdd,
    handleCreateSupplier,
    handleSubmit,
  }
}
