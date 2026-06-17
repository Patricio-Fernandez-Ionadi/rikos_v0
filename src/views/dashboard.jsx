import { DashboardCards } from '../modules/dashboard/dashboard-cards.jsx'
import { NoCostProducts } from '../modules/dashboard/no-cost-products.jsx'
import { NoMarginProducts } from '../modules/dashboard/no-margin-products.jsx'
import { NoSalePriceProducts } from '../modules/dashboard/no-sale-price-products.jsx'
import { NoPresentationsProducts } from '../modules/dashboard/no-presentations-products.jsx'
import { LowStockTable } from '../modules/dashboard/low-stock-table.jsx'
import { RecentEntries } from '../modules/dashboard/recent-entries.jsx'
import { BackupSection } from '../modules/dashboard/backup-section.jsx'

/**
 * Main dashboard — shows summary cards, warnings, recent entries.
 */
export const Dashboard = () => {
	return (
		<div className='dashboard'>
			<h2 className='dashboard__title'>Dashboard</h2>

			<DashboardCards />
			<BackupSection />
			<RecentEntries />
			<NoCostProducts />
			<NoMarginProducts />
			<NoSalePriceProducts />
			<NoPresentationsProducts />
			<LowStockTable />
		</div>
	)
}
