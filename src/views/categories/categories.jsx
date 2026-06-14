import { useCategoryManager } from '../../modules/categories/category-manager.js'
import { Button } from '../../components/button.jsx'
import { DataTable } from '../../components/data-table.jsx'
import { Modal } from '../../components/Modal.jsx'
import { CategoryForm } from '../../modules/categories/category-form.jsx'
import { DottedMenu } from '../../components/dotted-menu.jsx'

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
					{ key: 'actions', label: '' },
				]}
				rows={categories}
				emptyMessage='No hay categorias registradas'
				renderRow={(c) => (
					<tr key={c._id}>
						<td>
							<span className='text-truncate'>{c.name}</span>
						</td>
						<td>
							<DottedMenu items={[
								{ label: 'Editar', onClick: () => openForm(c) },
								{ label: 'Eliminar', onClick: () => deleteCategory(c._id), danger: true },
							]} />
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
