import { useNavigate } from 'react-router-dom'

export const BackButton = ({ to, onClick, children = 'Volver' }) => {
	const navigate = useNavigate()

	const handleClick = () => {
		if (onClick) {
			onClick()
		} else if (to) {
			navigate(to)
		} else {
			navigate(-1)
		}
	}

	return (
		<button className='back-btn' onClick={handleClick} type='button'>
			<span className='material-icons'>arrow_back</span>
			{children}
		</button>
	)
}