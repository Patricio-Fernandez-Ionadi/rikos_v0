/**
 * Unified button component.
 * Variants: 'default' | 'primary' | 'danger'
 * Sizes: 'md' | 'sm' | 'xs'
 * Additional props: block (full width), active (active state)
 */
export const Button = ({
	variant = 'default',
	size = 'md',
	block = false,
	active = false,
	className = '',
	children,
	...props
}) => {
	const classes = [
		'btn',
		variant !== 'default' && `btn--${variant}`,
		size !== 'md' && `btn--${size}`,
		block && 'btn--block',
		active && 'btn--active',
		className,
	]
		.filter(Boolean)
		.join(' ')

	return (
		<button className={classes} {...props}>
			{children}
		</button>
	)
}
