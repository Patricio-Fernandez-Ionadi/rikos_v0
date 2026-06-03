import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCatalog } from '../../app/catalog-context.jsx'
import { useOrders } from '../../modules/orders/order-manager.js'
import { Button } from '../../components/button.jsx'
import { FormActions } from '../../components/form-actions.jsx'
import * as orderService from '../../modules/orders/services/order-services.js'
import * as supplierService from '../../modules/suppliers/services/supplier-services.js'
import * as productService from '../../modules/products/services/product-services.js'

const NEW_SUPPLIER_VALUE = '__new__'

export const OrderFormPage = () => {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { suppliers, products, categories, setProducts, setSuppliers, setProductSuppliers } = useCatalog()
  const { createOrder, updateOrder } = useOrders()

  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(isEditing)

  const [supplierProducts, setSupplierProducts] = useState([])

  // ── Inline new supplier form ──────────────────────────────
  const [newSupName, setNewSupName] = useState('')
  const [newSupContact, setNewSupContact] = useState('')
  const [newSupPhone, setNewSupPhone] = useState('')
  const [newSupEmail, setNewSupEmail] = useState('')

  const handleCreateSupplier = useCallback(async () => {
    if (!newSupName.trim()) return
    const created = await supplierService.createSupplier({ name: newSupName.trim(), contactName: newSupContact.trim() || null, phone: newSupPhone.trim() || null, email: newSupEmail.trim() || null, notes: '' })
    setSuppliers((prev) => [...prev, created])
    setSupplierId(created._id)
    setNewSupName('')
    setNewSupContact('')
    setNewSupPhone('')
    setNewSupEmail('')
  }, [newSupName, newSupContact, newSupPhone, newSupEmail, setSuppliers])

  useEffect(() => {
    if (!supplierId || supplierId === NEW_SUPPLIER_VALUE) { setSupplierProducts([]); return }
    supplierService.getProductSuppliersBySupplier(supplierId)
      .then(setSupplierProducts)
      .catch(() => setSupplierProducts([]))
  }, [supplierId])

  useEffect(() => {
    if (!id) return
    orderService.getOrder(id)
      .then((order) => {
        setSupplierId(order.supplierId)
        setItems(order.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: i.quantity,
          unitCost: i.unitCost,
        })))
        setNotes(order.notes ?? '')
      })
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const supplierName = suppliers.find((s) => s._id === supplierId)?.name ?? ''

  const handleAddItem = useCallback((product, cost) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === product._id)) return prev
      return [...prev, {
        productId: product._id,
        productName: product.name,
        quantity: 1,
        unitCost: cost ?? product.purchaseCost ?? 0,
      }]
    })
  }, [])

  const handleRemoveItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const handleQuantityChange = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, parseInt(quantity) || 1) } : i,
      ),
    )
  }, [])

  const handleCostChange = useCallback((productId, cost) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, unitCost: parseFloat(cost) || 0 } : i,
      ),
    )
  }, [])

  const totalCost = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0),
    [items],
  )

  const addedProductIds = useMemo(() => new Set(items.map((i) => i.productId)), [items])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supplierId || items.length === 0) return

    const data = { supplierId, supplierName, items, notes }
    if (isEditing) {
      await updateOrder(id, data)
    } else {
      await createOrder(data)
    }
    navigate('/orders')
  }

  // ── "Todos los productos" search ──────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => !addedProductIds.has(p._id))
      .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [products, addedProductIds, searchQuery])

  const handleAddSearchedProduct = async () => {
    const prod = products.find((p) => p._id === selectedProductId)
    if (!prod) return

    const existingPS = supplierProducts.find((sp) => sp.productId === prod._id)
    if (existingPS) {
      handleAddItem(prod, existingPS.purchaseCost)
    } else {
      const costStr = window.prompt(`Costo de "${prod.name}" para ${supplierName}:`, prod.purchaseCost ?? '')
      if (costStr === null) { setSelectedProductId(''); return }
      const cost = parseFloat(costStr)
      if (isNaN(cost) || cost < 0) return

      try {
        const ps = await supplierService.createProductSupplier({
          productId: prod._id,
          supplierId,
          purchaseCost: cost,
        })
        setProductSuppliers((prev) => [...prev, ps])
        setSupplierProducts((prev) => [...prev, ps])
      } catch { /* already linked or error — add anyway */ }

      handleAddItem(prod, cost)
    }

    setSelectedProductId('')
    setSearchQuery('')
  }

  // ── Nuevo producto ────────────────────────────────────────
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCatId, setNewCatId] = useState(categories[0]?._id ?? '')
  const [newCost, setNewCost] = useState('')

  const handleCreateAndAdd = async () => {
    if (!newName.trim() || !newCatId || !newCost) return
    const cost = parseFloat(newCost)
    if (isNaN(cost) || cost < 0) return

    const created = await productService.createProduct({
      categoryId: newCatId,
      name: newName.trim(),
      purchaseCost: cost,
    })
    setProducts((prev) => [...prev, created])

    if (supplierId) {
      const ps = await supplierService.createProductSupplier({
        productId: created._id,
        supplierId,
        purchaseCost: cost,
      })
      setProductSuppliers((prev) => [...prev, ps])
      setSupplierProducts((prev) => [...prev, ps])
    }

    handleAddItem(created, cost)
    setShowNewForm(false)
    setNewName('')
    setNewCost('')
  }

  // ── Helpers ───────────────────────────────────────────────
  const productMap = useMemo(() => {
    const map = new Map()
    for (const p of products) map.set(p._id, p)
    return map
  }, [products])

  if (loading) {
    return (
      <div className='stock-page'>
        <p className='placeholder'>Cargando pedido...</p>
      </div>
    )
  }

  return (
    <div className='stock-page'>
      <div className='stock-page__title-row'>
        <button className='back-btn' onClick={() => navigate('/orders')}>
          <span className='material-icons'>arrow_back</span> Volver
        </button>
        <h2 className='stock-page__title'>
          {isEditing ? 'Editar pedido' : 'Nuevo pedido'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='surface-card p-16 mb-16'>
          <label className='field-label'>Proveedor</label>
          <select
            className='field-input'
            value={supplierId}
            onChange={(e) => {
              if (e.target.value === NEW_SUPPLIER_VALUE) {
                setSupplierId(NEW_SUPPLIER_VALUE)
                return
              }
              setSupplierId(e.target.value)
              setItems([])
            }}
            required
          >
            <option value=''>Seleccionar proveedor...</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
            <option value={NEW_SUPPLIER_VALUE}>+ Nuevo proveedor</option>
          </select>
        </div>

        {supplierId === NEW_SUPPLIER_VALUE ? (
          <div className='surface-card p-16 mb-16'>
            <h4 className='text-white mb-8'>Nuevo proveedor</h4>
            <label className='field-label'>Nombre *</label>
            <input className='field-input' type='text' value={newSupName} onChange={(e) => setNewSupName(e.target.value)} autoFocus required />
            <label className='field-label'>Nombre de contacto</label>
            <input className='field-input' type='text' value={newSupContact} onChange={(e) => setNewSupContact(e.target.value)} />
            <label className='field-label'>Teléfono</label>
            <input className='field-input' type='text' value={newSupPhone} onChange={(e) => setNewSupPhone(e.target.value)} />
            <label className='field-label'>Email</label>
            <input className='field-input' type='email' value={newSupEmail} onChange={(e) => setNewSupEmail(e.target.value)} />
            <div style={{ marginTop: 12 }}>
              <FormActions
                hideCancel
                submitLabel='Crear proveedor'
                onSubmit={handleCreateSupplier}
                submitDisabled={!newSupName.trim()}
              />
            </div>
          </div>
        ) : supplierId && (
          <>
            {/* Productos del proveedor */}
            <div className='surface-card p-16 mb-16'>
              <div className='flex-row' style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 className='text-white m-0'>
                  Productos de {supplierName}
                  {supplierProducts.length > 0 && ` (${supplierProducts.length})`}
                </h4>
              </div>

              {supplierProducts.length === 0 ? (
                <p className='placeholder'>Este proveedor no tiene productos asignados</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {supplierProducts.map((sp) => {
                    const prod = productMap.get(sp.productId)
                    if (!prod || addedProductIds.has(sp.productId)) return null
                    return (
                      <div
                        key={sp._id}
                        className='flex-row'
                        style={{ justifyContent: 'space-between', alignItems: 'center', background: 'var(--black)', padding: '8px 12px', borderRadius: 6 }}
                      >
                        <span className='text-white'>{prod.name}</span>
                        <span style={{ color: 'var(--grey-light)', fontSize: '0.85em' }}>
                          ${sp.purchaseCost?.toLocaleString() ?? '\u2014'} u.
                        </span>
                        <Button size='xs' onClick={() => handleAddItem(prod, sp.purchaseCost)}>
                          + Agregar
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Buscar todos los productos */}
            <div className='surface-card p-16 mb-16'>
              <h4 className='text-white mb-8'>Buscar productos</h4>
              <div className='flex-row' style={{ gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label className='field-label'>Filtrar por nombre</label>
                  <input
                    className='field-input'
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Escribí para filtrar…'
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label className='field-label'>Producto</label>
                  <select
                    className='field-input'
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    <option value=''>Seleccionar producto…</option>
                    {filteredProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                        {p.marca ? ` — ${p.marca}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  size='sm'
                  onClick={handleAddSearchedProduct}
                  disabled={!selectedProductId}
                >
                  Agregar
                </Button>
              </div>
            </div>

            {/* Nuevo producto */}
            <div className='surface-card p-16 mb-16'>
              <div className='flex-row' style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: showNewForm ? 12 : 0 }}>
                <h4 className='text-white m-0'>Nuevo producto</h4>
                {!showNewForm && (
                  <Button size='sm' onClick={() => setShowNewForm(true)}>
                    + Crear producto
                  </Button>
                )}
              </div>

              {showNewForm && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className='flex-row' style={{ gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <label className='field-label'>Categoría</label>
                      <select
                        className='field-input'
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label className='field-label'>Nombre</label>
                      <input
                        className='field-input'
                        type='text'
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder='Nombre del producto'
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className='field-label'>Costo ($)</label>
                      <input
                        className='field-input'
                        type='number'
                        min='0'
                        step='0.01'
                        value={newCost}
                        onChange={(e) => setNewCost(e.target.value)}
                      />
                    </div>
                  </div>
                  <FormActions
                    cancelLabel='Cancelar'
                    submitLabel='Crear y agregar al pedido'
                    onCancel={() => setShowNewForm(false)}
                    onSubmit={handleCreateAndAdd}
                    submitDisabled={!newName.trim() || !newCatId || !newCost}
                    submitVariant='primary'
                  />
                </div>
              )}
            </div>

            {/* Items del pedido */}
            <div className='surface-card p-16 mb-16'>
              <h4 className='text-white mb-8'>
                Productos del pedido ({items.length})
              </h4>
              {items.length === 0 ? (
                <p className='placeholder'>Agregá productos al pedido</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'var(--black)',
                        padding: '8px 12px',
                        borderRadius: 6,
                      }}
                    >
                      <span className='text-white' style={{ flex: 1, minWidth: 0 }}>
                        {item.productName}
                      </span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85em' }}>
                        Cant:
                        <input
                          className='field-input field-input--sm'
                          type='number'
                          min='1'
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          style={{ width: 55 }}
                        />
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85em' }}>
                        Costo u.:
                        <input
                          className='field-input field-input--sm'
                          type='number'
                          min='0'
                          step='0.01'
                          value={item.unitCost}
                          onChange={(e) => handleCostChange(item.productId, e.target.value)}
                          style={{ width: 70 }}
                        />
                      </label>
                      <span style={{ color: 'var(--grey-light)', fontSize: '0.85em', whiteSpace: 'nowrap' }}>
                        ${(item.quantity * item.unitCost).toLocaleString()}
                      </span>
                      <button
                        type='button'
                        className='btn btn--xs btn--danger'
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notas */}
            <div className='surface-card p-16 mb-16'>
              <label className='field-label'>Notas (opcional)</label>
              <textarea
                className='field-input'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            {/* Footer with total */}
            <div className='flex-row' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className='text-white' style={{ margin: 0 }}>
                Costo total: ${totalCost.toLocaleString()}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type='button' onClick={() => navigate('/orders')}>
                  Cancelar
                </Button>
                <Button variant='primary' type='submit' disabled={items.length === 0}>
                  {isEditing ? 'Guardar cambios' : 'Crear pedido'}
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
