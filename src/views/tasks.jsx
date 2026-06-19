import { useTasksManager, TASK_GROUPS } from '../modules/tasks/tasks-manager.js'
import { useTaskCard } from '../modules/tasks/task-card-manager.js'
import { TaskCard } from '../modules/tasks/task-card.jsx'
import { useCatalog } from '../app/catalog-context.jsx'

const TaskCardWrapper = ({ group, allTasks, toggleProduct, addSuggested, addTextTask, updateNote, removeTask, allProducts, allPresentations }) => {
	const props = useTaskCard({ group, allTasks, allProducts, allPresentations, toggleProduct, addSuggested, addTextTask, updateNote })
	return <TaskCard group={group} removeTask={removeTask} allPresentations={allPresentations} {...props} />
}

export const TasksPage = () => {
	const { products, presentations } = useCatalog()
	const {
		getTaskItems,
		toggleProductTask,
		suggestedProducts,
		addSuggested,
		addTextTask,
		updateTaskNote,
		removeTask,
	} = useTasksManager()

	const hasAny = TASK_GROUPS.some((g) => getTaskItems(g.key).length > 0)

	return (
		<div className='tasks-page'>
			<h2 className='tasks-page__title'>Tareas pendientes</h2>

			<div className='tasks__grid'>
				{TASK_GROUPS.map((group) => {
					const allTasks = group.isNameType
						? suggestedProducts
						: getTaskItems(group.key)

					return (
						<TaskCardWrapper
							key={group.key}
							group={group}
							allTasks={allTasks}
							toggleProduct={(productId) => toggleProductTask(group.key, productId)}
							addSuggested={addSuggested}
							addTextTask={addTextTask}
							updateNote={updateTaskNote}
							removeTask={removeTask}
							allProducts={products}
							allPresentations={presentations}
						/>
					)
				})}

				{!hasAny && (
					<p className='placeholder text-muted' style={{ gridColumn: '1 / -1' }}>
						No hay tareas pendientes
					</p>
				)}
			</div>
		</div>
	)
}
