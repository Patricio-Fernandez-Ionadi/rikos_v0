import { Link } from 'react-router-dom'

export const NavItem = ({ to, label, isLogo, onClick }) => {
	return (
		<Link
			to={to}
			className={`${isLogo ? 'navigation__logo' : 'navigation__link'}`}
			onClick={onClick}
		>
			{label}
		</Link>
	)
}
