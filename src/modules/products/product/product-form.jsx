import { useState } from 'react'
import { FormActions } from '../../../components/form-actions.jsx'
import { CategorySelect } from '../../../components/category-select.jsx'
import { TagInput } from '../../../components/tag-input.jsx'
import { useCatalog } from '../../../app/catalog-context.jsx'

export const ProductForm = ({ initial, categories, suppliers = [], onSubmit, onCancel }) => {
  const { tags: allTags } = useCatalog()
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?._id ?? '')
  const [name, setName] = useState(initial?.name ?? '')
  const [marca, setMarca] = useState(initial?.marca ?? '')
  const [productTags, setProductTags] = useState(initial?.tags ?? [])
  const [cost, setCost] = useState(initial?.purchaseCost ?? '')
  const [margin, setMargin] = useState(initial?.margin ?? '')
  const [saleType, setSaleType] = useState(initial?.saleType ?? 'unit')
  const [stockGrams, setStockGrams] = useState(initial?.stockGrams ?? '')
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState(initial?.etiquetasDisponibles ?? '')
  const [supplierId, setSupplierId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      categoryId,
      name: name.trim(),
      marca: marca.trim(),
      tags: productTags,
      purchaseCost: cost === '' ? null : parseFloat(cost),
      margin: margin === '' ? null : parseInt(margin),
      saleType,
      stockGrams: saleType === 'fraction' ? (stockGrams === '' ? 0 : parseInt(stockGrams)) : null,
      etiquetasDisponibles: etiquetasDisponibles === '' ? null : parseInt(etiquetasDisponibles),
      supplierId: supplierId || undefined,
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label className="field-label">Categoría</label>
      <CategorySelect categories={categories} value={categoryId} onChange={setCategoryId} allowEmpty={false} />

      <label className="field-label">Nombre del producto</label>
      <input className="field-input" type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />

      <label className="field-label">Marca</label>
      <input className="field-input" type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />

      <label className="field-label">Etiquetas</label>
      <TagInput
        tags={productTags}
        allTags={allTags}
        onAdd={(tag) => setProductTags((prev) => [...prev, tag])}
        onRemove={(tag) => setProductTags((prev) => prev.filter((t) => t !== tag))}
        onCreate={(tag) => setProductTags((prev) => [...prev, tag])}
      />

      {!initial && (
        <>
          <label className="field-label">Proveedor</label>
          <select className="field-input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
            <option value=''>Sin proveedor</option>
            {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </>
      )}

      <label className="field-label">Tipo de venta</label>
      <select className="field-input" value={saleType} onChange={(e) => setSaleType(e.target.value)}>
        <option value="unit">Por unidad</option>
        <option value="fraction">Fraccionable (por gramos)</option>
      </select>

      {saleType === 'fraction' && (
        <>
          <label className="field-label">Stock total (gramos)</label>
          <input className="field-input" type="number" value={stockGrams} onChange={(e) => setStockGrams(e.target.value)} />
          <label className="field-label mt-4">Etiquetas disponibles</label>
          <input className="field-input" type="number" value={etiquetasDisponibles} onChange={(e) => setEtiquetasDisponibles(e.target.value)} />
        </>
      )}

      <label className="field-label">Costo de compra ($)</label>
      <input className="field-input" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />

      <label className="field-label">Margen de ganancia (%)</label>
      <input className="field-input" type="number" value={margin} onChange={(e) => setMargin(e.target.value)} />

      <FormActions
        onCancel={onCancel}
        submitLabel={initial ? 'Guardar cambios' : 'Crear producto'}
      />
    </form>
  )
}
