import { DashboardCards } from '../modules/dashboard/dashboard-cards.jsx'
import { NoCostProducts } from '../modules/dashboard/no-cost-products.jsx'
import { LowStockTable } from '../modules/dashboard/low-stock-table.jsx'
import { RecentEntries } from '../modules/dashboard/recent-entries.jsx'

/**
 * Main dashboard — shows summary cards, low-stock warnings, recent shifts.
 */
export const Dashboard = () => {
	return (
		<div className='dashboard'>
			<h2 className='dashboard__title'>Dashboard</h2>

			<DashboardCards />
			<RecentEntries />
			<NoCostProducts />
			<LowStockTable />
		</div>
	)
}
