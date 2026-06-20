import { useTickets } from './ticket-manager.js'

export const TicketForm = () => {
	const { text, setText, type, setType, handleSubmit } = useTickets()

	return (
		<form className='ticket-form' onSubmit={handleSubmit}>
			<div className='ticket-form__row'>
				<select className='ticket-form__select' value={type} onChange={(e) => setType(e.target.value)}>
					<option value='sugerencia'>Sugerencia</option>
					<option value='bug'>Error</option>
					<option value='otro'>Otro</option>
				</select>
			</div>
			<div className='ticket-form__row'>
				<textarea
					className='ticket-form__textarea'
					placeholder='Describí el ticket…'
					rows={3}
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
			</div>
			<div className='ticket-form__row'>
				<button className='btn btn--primary' type='submit' disabled={!text.trim()}>
					Agregar ticket
				</button>
			</div>
		</form>
	)
}
