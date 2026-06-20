import { TicketProvider } from '../modules/tickets/ticket-manager.js'
import { TicketForm } from '../modules/tickets/ticket-form.jsx'
import { TicketList } from '../modules/tickets/ticket-list.jsx'

export const TicketsPage = () => {
	return (
		<TicketProvider>
			<div className='ticket-page'>
				<h2 className='ticket-page__title'>Tickets</h2>
				<p className='ticket-page__desc'>
					Anotá sugerencias de cambios o reportes de error para revisarlos después.
				</p>
				<TicketForm />
				<TicketList />
			</div>
		</TicketProvider>
	)
}
