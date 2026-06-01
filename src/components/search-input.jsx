import { forwardRef } from 'react'

export const SearchInput = forwardRef(({ className = '', style, ...props }, ref) => {
	return (
		<input
			ref={ref}
			className={`field-input${className ? ` ${className}` : ''}`}
			type='text'
			style={style}
			{...props}
		/>
	)
})
SearchInput.displayName = 'SearchInput'
