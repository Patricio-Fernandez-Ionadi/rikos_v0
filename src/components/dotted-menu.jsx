import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export const DottedMenu = ({ items, className = '' }) => {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, right: 0 })
	const triggerRef = useRef(null)
	const menuRef = useRef(null)

	const close = useCallback(() => setOpen(false), [])

	useEffect(() => {
		if (!open) return

		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target) &&
				triggerRef.current && !triggerRef.current.contains(e.target)) {
				close()
			}
		}

		const handleScroll = () => close()

		document.addEventListener('mousedown', handleClickOutside)
		window.addEventListener('scroll', handleScroll, true)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('scroll', handleScroll, true)
		}
	}, [open, close])

	const handleOpen = () => {
		if (!triggerRef.current) return
		const rect = triggerRef.current.getBoundingClientRect()
		setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
		setOpen(true)
	}

	return (
		<>
			<button
				ref={triggerRef}
				className={`dotted-menu__trigger${className ? ` ${className}` : ''}`}
				onClick={handleOpen}
				type='button'
				aria-label='Más opciones'
				aria-expanded={open}
			>
				⋮
			</button>
			{open && createPortal(
				<div ref={menuRef} className='dotted-menu__dropdown' style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 1000 }}>
					{items.map((item, i) => (
						<button
							key={i}
							className={`dotted-menu__item${item.danger ? ' dotted-menu__item--danger' : ''}`}
							onClick={() => {
								close()
								item.onClick?.()
							}}
							type='button'
						>
							{item.label}
						</button>
					))}
				</div>,
				document.body,
			)}
		</>
	)
}
