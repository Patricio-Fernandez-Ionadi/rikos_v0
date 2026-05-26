import { DashboardCards } from '../modules/dashboard/dashboard-cards.jsx'
import { NoCostProducts } from '../modules/dashboard/no-cost-products.jsx'
import { LowStockTable } from '../modules/dashboard/low-stock-table.jsx'
import { ActiveShiftSummary } from '../modules/dashboard/active-shift-summary.jsx'

/**
 * Main dashboard — shows summary cards, low-stock warnings, recent shifts.
 */
export const Dashboard = () => {
	return (
		<div className='dashboard'>
			<h2 className='dashboard__title'>Dashboard</h2>

			<DashboardCards />
			<NoCostProducts />
			<LowStockTable />
			<ActiveShiftSummary />
		</div>
	)
}
