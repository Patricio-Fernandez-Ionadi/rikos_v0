import { useState, useRef, useEffect } from 'react'

/**
 * Reusable collapsible/accordion panel.
 * Click the header to toggle content visibility.
 * Handles overflow-x internally to prevent layout breakage.
 *
 * @param {Object}    props
 * @param {string}    props.title       Header text
 * @param {ReactNode} props.children    Collapsible content
 * @param {boolean}   [props.defaultOpen=false]  Start expanded
 * @param {string}    [props.className] Extra class on wrapper
 */
export const Collapsible = ({
	title,
	children,
	defaultOpen = false,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(defaultOpen)
	const contentRef = useRef(null)
	const [contentHeight, setContentHeight] = useState(0)

	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight)
		}
	}, [children])

	return (
		<div className={`collapsible${isOpen ? ' collapsible--open' : ''}${className ? ` ${className}` : ''}`}>
			<button
				className='collapsible__header'
				onClick={() => setIsOpen((prev) => !prev)}
				type='button'
				aria-expanded={isOpen}
			>
				<span className='collapsible__title'>{title}</span>
				<span className={`collapsible__arrow${isOpen ? ' collapsible__arrow--open' : ''}`}>
					▸
				</span>
			</button>
			<div
				className='collapsible__content'
				style={{
					maxHeight: isOpen ? `${contentHeight}px` : '0',
					opacity: isOpen ? 1 : 0,
				}}
			>
				<div ref={contentRef} className='collapsible__inner'>
					{children}
				</div>
			</div>
		</div>
	)
}
