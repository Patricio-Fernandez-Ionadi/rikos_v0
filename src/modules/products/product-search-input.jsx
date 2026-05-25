export const SearchProduct = ({ changeEvent, value }) => {
	return (
		<div className='sidebar__search'>
			<input
				className='sidebar__search-input'
				type='text'
				placeholder='Buscar producto…'
				value={value}
				onChange={(e) => changeEvent(e.target.value)}
			/>
		</div>
	)
}
