import { useState, useRef, useEffect } from 'react'

/**
 * A dotted menu (⋮) that opens a dropdown with action items.
 * Closes on click outside or when an item is selected.
 * Handles overflow and positioning automatically.
 *
 * @param {Object}   props
 * @param {Array}    props.items      Array of { label, onClick } objects
 * @param {string}   [props.className]  Extra class on wrapper
 */
export const DottedMenu = ({ items, className = '' }) => {
	const [open, setOpen] = useState(false)
	const ref = useRef(null)

	useEffect(() => {
		if (!open) return

		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [open])

	const handleItemClick = (item) => {
		setOpen(false)
		item.onClick?.()
	}

	return (
		<div
			ref={ref}
			className={`dotted-menu${open ? ' dotted-menu--open' : ''}${className ? ` ${className}` : ''}`}
		>
			<button
				className='dotted-menu__trigger'
				onClick={() => setOpen((prev) => !prev)}
				type='button'
				aria-label='Más opciones'
				aria-expanded={open}
			>
				⋮
			</button>

			{open && (
				<div className='dotted-menu__dropdown'>
					{items.map((item, i) => (
						<button
							key={i}
							className={`dotted-menu__item${item.danger ? ' dotted-menu__item--danger' : ''}`}
							onClick={() => handleItemClick(item)}
							type='button'
						>
							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
