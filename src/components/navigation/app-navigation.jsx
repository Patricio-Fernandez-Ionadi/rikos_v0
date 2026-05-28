import { NavItem } from './app-nav-item'

export const Navigation = () => {
	return (
		<nav className='navigation__nav'>
			<NavItem to={'/'} label={"RIKO'S"} isLogo={true} />
			<NavItem to={'/products'} label={'Productos'} />
			<NavItem to={'/suppliers'} label={'Proveedores'} />
			<NavItem to={'/stock'} label={'Stock'} />
			<NavItem to={'/shifts'} label={'Turnos'} />
			<NavItem to={'/soporte'} label={'Soporte'} />
		</nav>
	)
}
