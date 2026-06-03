import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { NavItem } from './app-nav-item'

const LINKS = [
	{ to: '/products', label: 'Productos' },
	{ to: '/suppliers', label: 'Proveedores' },
	{ to: '/orders', label: 'Pedidos' },
	{ to: '/stock', label: 'Stock' },
	{ to: '/shifts', label: 'Turnos' },
	{ to: '/tasks', label: 'Tareas' },
	{ to: '/soporte', label: 'Soporte' },
]

const GROUPS = [
	{
		label: 'Gestión',
		links: [
			{ to: '/products', label: 'Productos' },
			{ to: '/suppliers', label: 'Proveedores' },
			{ to: '/orders', label: 'Pedidos' },
			{ to: '/stock', label: 'Stock' },
		],
	},
	{
		label: 'Ventas',
		links: [
			{ to: '/shifts', label: 'Turnos' },
			{ to: '/tasks', label: 'Tareas' },
		],
	},
	{
		label: 'Soporte',
		links: [
			{ to: '/soporte', label: 'Soporte' },
		],
	},
]

export const Navigation = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const location = useLocation()

	useEffect(() => {
		setMenuOpen(false)
	}, [location.pathname])

	return (
		<nav className='navigation__nav'>
			<NavItem to={'/'} label={"RIKO'S"} isLogo={true} />

			{/* Desktop: inline links */}
			<div className='navigation__desktop-links'>
				{LINKS.map((link) => (
					<NavItem key={link.to} to={link.to} label={link.label} />
				))}
			</div>

			{/* Mobile: hamburger */}
			<button
				className={`navigation__hamburger ${menuOpen ? 'navigation__hamburger--open' : ''}`}
				onClick={() => setMenuOpen((v) => !v)}
				aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
			>
				<span />
				<span />
				<span />
			</button>

			{/* Mobile: overlay + drawer */}
			{menuOpen && <div className='navigation__overlay' onClick={() => setMenuOpen(false)} />}
			<div className={`navigation__drawer ${menuOpen ? 'navigation__drawer--open' : ''}`}>
				{GROUPS.map((group) => (
					<div key={group.label} className='navigation__group'>
						<span className='navigation__group-label'>{group.label}</span>
						{group.links.map((link) => (
							<NavItem key={link.to} to={link.to} label={link.label} onClick={() => setMenuOpen(false)} />
						))}
					</div>
				))}
			</div>
		</nav>
	)
}
