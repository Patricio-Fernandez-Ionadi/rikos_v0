import { useState } from 'react'
import { useCatalog } from '../../../app/catalog-context.jsx'
import { useShift } from '../../shift/shift-context.jsx'
import { calculate } from '../../../data/index.js'
import { useProductDetailData } from './hooks/use-product-detail-data.js'
import { useProductDetailEffect } from './hooks/use-product-detail-effect.js'
import { useProductDetailMutations } from './hooks/use-product-detail-mutations.js'
import { usePresentationActions } from './hooks/use-presentation-actions.js'
import { useSupplierActions } from './hooks/use-supplier-actions.js'

export function useProductDetail(productId) {
	const { products, presentations, categories, suppliers, productSuppliers, setProducts, setPresentations, setProductSuppliers } = useCatalog()
	const { shift, addSale } = useShift()

	const { product, productPres, category, isFraction, totalStock, assignedSupplierIds, activeSupplier, minSalePrice, activeSupplierName } =
		useProductDetailData(productId)

	// ── UI state ──────────────────────────────────────────
	const [editProductOpen, setEditProductOpen] = useState(false)
	const [presFormOpen, setPresFormOpen] = useState(false)
	const [editingPres, setEditingPres] = useState(null)
	const [salePresId, setSalePresId] = useState(null)
	const [stockGramsEdit, setStockGramsEdit] = useState(false)
	const [stockGramsValue, setStockGramsValue] = useState('')

	useProductDetailEffect({ product, setProductSuppliers, setProducts })

	const { handleEditProduct, handleDeleteProduct, handleStockGramsSave, handleSale } =
		useProductDetailMutations({
			product,
			productSuppliers,
			activeSupplier,
			stockGramsValue,
			setProducts,
			setPresentations,
			setProductSuppliers,
			setEditProductOpen,
			setStockGramsEdit,
			setSalePresId,
			addSale,
			presentations,
			products,
		})

	const { handleCreatePres, handleEditPres, handleDeletePres } =
		usePresentationActions({
			product,
			editingPres,
			productPres,
			isFraction,
			setPresentations,
			setProducts,
		})

	const { handleAddSupplier, handleRemoveSupplier, handleUseSupplierCost } =
		useSupplierActions({
			product,
			setProductSuppliers,
			setProducts,
		})

	return {
		product, productPres, categories, category, isFraction, totalStock,
		productSuppliers, assignedSupplierIds, activeSupplier, activeSupplierName,
		minSalePrice, suppliers, shift,
		calculate: (pres) => calculate(product, pres),
		editProductOpen, setEditProductOpen,
		presFormOpen, setPresFormOpen,
		editingPres, setEditingPres,
		salePresId, setSalePresId,
		stockGramsEdit, setStockGramsEdit,
		stockGramsValue, setStockGramsValue,
		handleEditProduct, handleDeleteProduct,
		handleCreatePres, handleEditPres, handleDeletePres,
		handleStockGramsSave, handleSale,
		handleAddSupplier, handleRemoveSupplier, handleUseSupplierCost,
	}
}
