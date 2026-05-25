export const ButtonNewProduct = ({ onEvent }) => {
	return (
		<button className='sidebar__btn' onClick={() => onEvent(true)}>
			+Nuevo
		</button>
	)
}
