import { useState, useMemo } from 'react'

const MAX_VISIBLE = 3

export function useTaskCard({ group, allTasks = [], allProducts = [], allPresentations = [], toggleProduct, addSuggested, addTextTask, updateNote, markTaskStatus }) {
	const [searchTerm, setSearchTerm] = useState('')
	const [suggestionName, setSuggestionName] = useState('')
	const [showAdd, setShowAdd] = useState(false)
	const [editingNoteId, setEditingNoteId] = useState(null)
	const [noteValue, setNoteValue] = useState('')
	const [modalOpen, setModalOpen] = useState(false)
	const [modalTab, setModalTab] = useState('pending')

	const [otrosDesc, setOtrosDesc] = useState('')
	const [otrosSearch, setOtrosSearch] = useState('')
	const [otrosLinkedProduct, setOtrosLinkedProduct] = useState(null)

	const isNameType = group.isNameType
	const isTextBased = group.textBased

	const filtered = useMemo(() => {
		if (!searchTerm.trim()) return []
		const q = searchTerm.toLowerCase()
		return allProducts.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				(p.marca && p.marca.toLowerCase().includes(q)),
		)
	}, [searchTerm, allProducts])

	const otrosFiltered = useMemo(() => {
		if (!otrosSearch.trim()) return []
		const q = otrosSearch.toLowerCase()
		return allProducts.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				(p.marca && p.marca.toLowerCase().includes(q)),
		)
	}, [otrosSearch, allProducts])

	const displayItems = useMemo(() => {
		if (isNameType) return allTasks.filter((t) => !t.productId && t.name)
		if (isTextBased) return allTasks
		return allTasks.filter((t) => t.productId)
	}, [allTasks, isNameType, isTextBased])

	const pendingItems = useMemo(() => displayItems.filter((t) => t.status !== 'viewed'), [displayItems])
	const viewedItems = useMemo(() => displayItems.filter((t) => t.status === 'viewed'), [displayItems])
	const total = pendingItems.length
	const visibleItems = pendingItems.slice(0, MAX_VISIBLE)
	const hiddenCount = pendingItems.length - MAX_VISIBLE

	const handleToggleProduct = (productId) => {
		toggleProduct(productId)
		setSearchTerm('')
	}

	const handleAddSuggestion = () => {
		if (suggestionName.trim()) {
			addSuggested(suggestionName.trim())
			setSuggestionName('')
		}
	}

	const handleAddOtros = () => {
		if (otrosDesc.trim()) {
			addTextTask(group.key, otrosDesc.trim(), otrosLinkedProduct?._id ?? null)
			setOtrosDesc('')
			setOtrosLinkedProduct(null)
			setOtrosSearch('')
		}
	}

	const handleNoteClick = (taskId, currentNote) => {
		setEditingNoteId(taskId)
		setNoteValue(currentNote ?? '')
	}

	const handleNoteSave = (taskId) => {
		updateNote(taskId, noteValue)
		setEditingNoteId(null)
	}

	const handleNoteKeyDown = (e, taskId) => {
		if (e.key === 'Enter') handleNoteSave(taskId)
		if (e.key === 'Escape') setEditingNoteId(null)
	}

	const handleLinkOtrosProduct = (product) => {
		setOtrosLinkedProduct(product)
		setOtrosSearch('')
	}

	const getProduct = (productId) => allProducts.find((p) => p._id === productId)
	const getProductPresentations = (productId) => allPresentations.filter((p) => String(p.productId) === String(productId))

	const handleTogglePres = (taskId, presId) => {
		const task = allTasks.find((t) => t._id === taskId)
		if (!task) return
		let ids = []
		try { ids = JSON.parse(task.note || '[]') } catch { ids = [] }
		const idx = ids.indexOf(presId)
		if (idx === -1) {
			ids.push(presId)
		} else {
			ids.splice(idx, 1)
		}
		updateNote(taskId, JSON.stringify(ids))
	}

	return {
		showAdd, setShowAdd,
		editingNoteId, noteValue, setNoteValue,
		searchTerm, setSearchTerm,
		suggestionName, setSuggestionName,
		otrosDesc, setOtrosDesc,
		otrosSearch, setOtrosSearch,
		otrosLinkedProduct, setOtrosLinkedProduct,
		filtered, otrosFiltered, displayItems, total, visibleItems, hiddenCount,
		isNameType, isTextBased,
		modalOpen, setModalOpen, modalTab, setModalTab,
		pendingItems, viewedItems,
		handleToggleProduct,
		handleAddSuggestion,
		handleAddOtros,
		handleNoteClick,
		handleNoteSave,
		handleNoteKeyDown,
		handleLinkOtrosProduct,
		getProduct,
		getProductPresentations,
		handleTogglePres,
		markTaskStatus,
	}
}
