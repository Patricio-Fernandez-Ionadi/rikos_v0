import { useTickets } from './ticket-manager.js'
import { DottedMenu } from '../../components/dotted-menu.jsx'

const STATUS_LABELS = {
	resolved: 'Finalizada',
}

export const TicketCard = ({ ticket }) => {
	const { handleStatusChange, handleDelete } = useTickets()

	const actions = []
	if (ticket.status === 'active') {
		actions.push(
			{ label: 'Finalizar', onClick: () => handleStatusChange(ticket._id, 'resolved') },
			{ label: 'Eliminar', onClick: () => handleDelete(ticket._id), danger: true },
		)
	} else {
		actions.push(
			{ label: 'Reabrir', onClick: () => handleStatusChange(ticket._id, 'active') },
			{ label: 'Eliminar', onClick: () => handleDelete(ticket._id), danger: true },
		)
	}

	return (
		<div className={`ticket-card ticket-card--${ticket.type} ticket-card--${ticket.status || 'active'}`}>
			<div className='ticket-card__header'>
				<span className={`ticket-card__badge ticket-card__badge--${ticket.type}`}>
					{ticket.type === 'bug' ? 'Error' : ticket.type === 'sugerencia' ? 'Sugerencia' : 'Otro'}
				</span>
				{ticket.status && ticket.status !== 'active' && (
					<span className={`ticket-card__status ticket-card__status--${ticket.status}`}>
						{STATUS_LABELS[ticket.status] || ticket.status}
					</span>
				)}
				<span className='ticket-card__date'>
					{ticket.status === 'resolved' && ticket.resolvedAt
						? `Finalizado ${new Date(ticket.resolvedAt).toLocaleString()}`
						: new Date(ticket.createdAt).toLocaleString()
					}
				</span>
				<DottedMenu items={actions} />
			</div>
			<p className='ticket-card__text'>{ticket.text}</p>
		</div>
	)
}
