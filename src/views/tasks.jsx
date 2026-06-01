import { useState, useMemo } from 'react'
import { useTasksManager } from '../modules/tasks/tasks-manager.js'
import { TaskCard } from '../modules/tasks/task-card.jsx'
import { SearchInput } from '../components/search-input.jsx'

export const TasksPage = () => {
	const { taskData, isInRestock, toggleRestock } = useTasksManager()
	const [searchTerm, setSearchTerm] = useState('')

	const filteredData = useMemo(() => {
		if (!searchTerm.trim()) return taskData
		const q = searchTerm.toLowerCase()
		return taskData.map((g) => ({
			...g,
			productItems: g.productItems.filter((p) =>
				p.name.toLowerCase().includes(q)
			),
			presProductItems: g.presProductItems.filter(({ pres, product }) =>
				product.name.toLowerCase().includes(q) ||
				(pres.label && pres.label.toLowerCase().includes(q))
			),
		})).filter((g) => g.productItems.length > 0 || g.presProductItems.length > 0)
	}, [taskData, searchTerm])

	return (
		<div className='tasks-page'>
			<h2 className='tasks-page__title'>Tareas pendientes</h2>

			<SearchInput
				placeholder='Buscar producto…'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				style={{ marginBottom: 16 }}
			/>

			<div className='tasks__grid'>
				{filteredData.length === 0 ? (
					<p className='placeholder' style={{ textAlign: 'center', padding: 40, color: '#616161' }}>
						{searchTerm.trim()
							? 'No hay tareas que coincidan con la búsqueda'
							: '¡Todo al día! No hay tareas pendientes.'
						}
					</p>
				) : (
					filteredData.map(({ group, productItems, presProductItems }) => (
						<TaskCard
							key={group.key}
							group={group}
							productItems={productItems}
							presProductItems={presProductItems}
							isInRestock={isInRestock}
							onToggleRestock={toggleRestock}
						/>
					))
				)}
			</div>
		</div>
	)
}
