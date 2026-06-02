import { useTasksManager, TASK_GROUPS } from '../modules/tasks/tasks-manager.js'
import { TaskCard } from '../modules/tasks/task-card.jsx'
import { useData } from '../app/data-context.jsx'

export const TasksPage = () => {
	const { products } = useData()
	const {
		getTaskItems,
		toggleProductTask,
		suggestedProducts,
		addSuggested,
		addTextTask,
		updateTaskNote,
		removeTask,
	} = useTasksManager()

	const hasAny = TASK_GROUPS.some((g) => {
		return getTaskItems(g.key).length > 0
	})

	return (
		<div className='tasks-page'>
			<h2 className='tasks-page__title'>Tareas pendientes</h2>

			<div className='tasks__grid'>
				{TASK_GROUPS.map((group) => {
					const allTasks = group.isNameType
						? suggestedProducts
						: getTaskItems(group.key)

					return (
						<TaskCard
							key={group.key}
							group={group}
							allTasks={allTasks}
							toggleProduct={(productId) => toggleProductTask(group.key, productId)}
							addSuggested={addSuggested}
							addTextTask={addTextTask}
							updateNote={updateTaskNote}
							removeTask={removeTask}
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
