import { useTasksManager, TASK_GROUPS } from '../modules/tasks/tasks-manager.js'
import { TaskCard } from '../modules/tasks/task-card.jsx'
import { useData } from '../app/data-context.jsx'

export const TasksPage = () => {
	const { products } = useData()
	const {
		getTaskProducts,
		toggleProductTask,
		suggestedProducts,
		addSuggested,
		removeSuggested,
	} = useTasksManager()

	const hasAny = TASK_GROUPS.some((g) => {
		if (g.isNameType) return suggestedProducts.length > 0
		return getTaskProducts(g.key).length > 0
	})

	return (
		<div className='tasks-page'>
			<h2 className='tasks-page__title'>Tareas pendientes</h2>

			<div className='tasks__grid'>
				{TASK_GROUPS.map((group) => {
					const assignedProducts = group.isNameType
						? []
						: getTaskProducts(group.key)
					const suggestions = group.isNameType ? suggestedProducts : []

					return (
						<TaskCard
							key={group.key}
							group={group}
							products={assignedProducts}
							suggestions={suggestions}
							toggleProduct={(productId) => toggleProductTask(group.key, productId)}
							addSuggested={addSuggested}
							removeSuggested={removeSuggested}
							allProducts={products}
						/>
					)
				})}

				{!hasAny && (
					<p className='placeholder' style={{ textAlign: 'center', padding: 40, color: '#616161', gridColumn: '1 / -1' }}>
						No hay tareas pendientes
					</p>
				)}
			</div>
		</div>
	)
}
