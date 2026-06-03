import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoriesSidebar } from '../../modules/categorias/categories-button-group'
import { ProductStats } from '../../modules/products/product-stats'
import { Button } from '../../components/button.jsx'

export const Sidebar = ({
	categories,
	filteredProducts,
	products,
	selectedCategoryIds,
	onSelectCategories,
	tags,
	selectedTags,
	onSelectTags,
}) => {
	const [tagsOpen, setTagsOpen] = useState(false)

	const handleSelectTag = (tag) => {
		if (selectedTags.includes(tag)) {
			onSelectTags(selectedTags.filter((t) => t !== tag))
		} else {
			onSelectTags([...selectedTags, tag])
		}
	}

	return (
		<>
			<div className='products-sidebar'>
				<ProductStats
					categories={categories}
					filteredProducts={filteredProducts}
					products={products}
				/>
				<Link to='/products/new' style={{ textDecoration: 'none' }}>
					<Button block style={{ marginBottom: 10 }}>+Nuevo producto</Button>
				</Link>
				<CategoriesSidebar
					selected={selectedCategoryIds}
					onEvent={onSelectCategories}
					categories={categories}
				/>

				<div className='cat-sidebar__categories'>
					<button
						className='cat-sidebar__categories-header'
						onClick={() => setTagsOpen((prev) => !prev)}
						type='button'
						aria-expanded={tagsOpen}
					>
						<span className='cat-sidebar__title'>
							<span className={`cat-sidebar__arrow${tagsOpen ? ' cat-sidebar__arrow--open' : ''}`}>
								▸
							</span>
							Etiquetas
						</span>
					</button>
					<div className={`cat-sidebar__buttons${!tagsOpen ? ' cat-sidebar__buttons--collapsed' : ''}`}>
						{tags.length === 0 ? (
							<span className='cat-sidebar__empty'>Sin etiquetas aún</span>
						) : tags.map((tag) => {
							const active = selectedTags.includes(tag)
							return (
								<button
									key={tag}
									className={'cat-sidebar__btn' + (active ? ' cat-sidebar__btn--active' : '')}
									onClick={() => handleSelectTag(tag)}
								>
									{tag}
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}
