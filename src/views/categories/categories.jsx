import { useCategoryManager } from '../../modules/categorias/category-manager.js'
import { Button } from '../../components/button.jsx'
import { DataTable } from '../../components/data-table.jsx'
import { Modal } from '../../components/Modal.jsx'
import { CategoryForm } from '../../modules/categorias/category-form.jsx'

export const CategoriesPage = () => {
	const { categories, editingCategory, formOpen, openForm, closeForm, createCategory, updateCategory, deleteCategory } = useCategoryManager()

	return (
		<div className='stock-page'>
			<div className='stock-page__title-row'>
				<h2 className='stock-page__title'>Categorias</h2>
				<Button block onClick={() => openForm()}>+ Nueva categoria</Button>
			</div>

			<DataTable
				variant='stock-page'
				columns={[
					{ key: 'name', label: 'Nombre' },
					{ key: 'actions', label: 'Acciones' },
				]}
				rows={categories}
				emptyMessage='No hay categorias registradas'
				renderRow={(c) => (
					<tr key={c._id}>
						<td className='text-white'>{c.name}</td>
						<td>
							<div style={{ display: 'flex', gap: 4 }}>
								<Button size='xs' onClick={() => openForm(c)}>Editar</Button>
								<Button size='xs' variant='danger' onClick={() => deleteCategory(c._id)}>Eliminar</Button>
							</div>
						</td>
					</tr>
				)}
			/>

			<Modal open={formOpen} onClose={closeForm} title={editingCategory ? 'Editar categoria' : 'Nueva categoria'}>
				<CategoryForm initial={editingCategory}
					onSubmit={editingCategory ? (name) => updateCategory(editingCategory._id, name) : createCategory}
					onCancel={closeForm} />
			</Modal>
		</div>
	)
}
