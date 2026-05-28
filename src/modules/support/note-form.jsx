import { useSupport } from './support-manager.js'

export const NoteForm = () => {
	const { text, setText, type, setType, handleSubmit } = useSupport()

	return (
		<form className='soporte-form' onSubmit={handleSubmit}>
			<div className='soporte-form__row'>
				<select
					className='field-input soporte-form__select'
					value={type}
					onChange={(e) => setType(e.target.value)}
				>
					<option value='sugerencia'>Sugerencia</option>
					<option value='bug'>Reporte de error</option>
					<option value='otro'>Otro</option>
				</select>
			</div>
			<div className='soporte-form__row'>
				<textarea
					className='field-input soporte-form__textarea'
					placeholder='Describí el cambio o error...'
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={4}
				/>
			</div>
			<div className='soporte-form__row'>
				<button
					type='submit'
					className='shift-bar__btn shift-bar__btn--primary'
					disabled={!text.trim()}
				>
					Agregar nota
				</button>
			</div>
		</form>
	)
}
