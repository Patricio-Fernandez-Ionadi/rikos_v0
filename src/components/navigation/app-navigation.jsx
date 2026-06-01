import { useState } from 'react'
import { NavItem } from './app-nav-item'

const LINKS = [
	{ to: '/products', label: 'Productos' },
	{ to: '/suppliers', label: 'Proveedores' },
	{ to: '/stock', label: 'Stock' },
	{ to: '/tasks', label: 'Tareas' },
	{ to: '/shifts', label: 'Turnos' },
	{ to: '/soporte', label: 'Soporte' },
]

export const Navigation = () => {
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<nav className='navigation__nav'>
			<NavItem to={'/'} label={"RIKO'S"} isLogo={true} onClick={() => setMenuOpen(false)} />

			<button
				className={`navigation__hamburger ${menuOpen ? 'navigation__hamburger--open' : ''}`}
				onClick={() => setMenuOpen((v) => !v)}
				aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
			>
				<span />
				<span />
				<span />
			</button>

			<div className={`navigation__links ${menuOpen ? 'navigation__links--open' : ''}`}>
				{LINKS.map((link) => (
					<NavItem key={link.to} to={link.to} label={link.label} onClick={() => setMenuOpen(false)} />
				))}
			</div>
		</nav>
	)
}
