import { useTickets } from './ticket-manager.js'
import { TicketCard } from './ticket-card.jsx'

const TABS = [
	{ key: 'active', label: 'Activas' },
	{ key: 'resolved', label: 'Finalizadas' },
]

export const TicketList = () => {
	const { tickets, filter, setFilter, filteredTickets } = useTickets()

	const counts = {}
	for (const tab of TABS) {
		counts[tab.key] = tickets.filter((t) => t.status === tab.key || (!t.status && tab.key === 'active')).length
	}

	return (
		<>
			<div className='ticket-tabs'>
				{TABS.map((tab) => (
					<button
						key={tab.key}
						className={`ticket-tabs__tab${filter === tab.key ? ' ticket-tabs__tab--active' : ''}`}
						onClick={() => setFilter(tab.key)}
						type='button'
					>
						{tab.label}
						<span className='ticket-tabs__count'>{counts[tab.key]}</span>
					</button>
				))}
			</div>

			{filteredTickets.length === 0 ? (
				<p className='placeholder text-muted'>
					No hay tickets {filter === 'active' ? 'activos' : 'finalizados'}
				</p>
			) : (
				<div className='ticket-list'>
					{filteredTickets.map((ticket) => (
						<TicketCard key={ticket._id} ticket={ticket} />
					))}
				</div>
			)}
		</>
	)
}
