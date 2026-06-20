import { useContext } from 'react'
import { TicketContext } from './ticket-context.jsx'

export { TicketProvider } from './ticket-context.jsx'

export function useTickets() {
	const ctx = useContext(TicketContext)
	if (!ctx) throw new Error('useTickets must be used within <TicketProvider>')
	return ctx
}
