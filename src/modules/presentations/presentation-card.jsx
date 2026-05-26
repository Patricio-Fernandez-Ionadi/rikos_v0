import { SaleForm } from '../../components/SaleForm.jsx'
import { useProductManager } from '../../modules/products/product-manager.js'

export const PresentationCard = ({ pres }) => {
	const {
		stockEdit,
		stockValue,
		changeStockValue,
		updateStock,
		cancelStockEdit,
		startStockEdit,
		shift,
		salePresId,
		startSale,
		cancelSale,
		openEditPres,
		deletePres,
		handleSale,
	} = useProductManager()

	return (
		<div className='pres-card'>
			<div className='pres-card__content'>
				<div>
					<div className='pres-card__label'>{pres.label}</div>
					<div className='pres-card__unit'>
						Stock: {pres.stock ?? 0}
						{stockEdit === pres._id ? (
							<span className='stock-edit-inline'>
								<input
									className='field-input field-input--xs'
									type='number'
									value={stockValue}
									onChange={(e) => changeStockValue(e.target.value)}
								/>
								<button
									className='sidebar__btn sidebar__btn--xs'
									onClick={() => updateStock(pres._id)}
								>
									OK
								</button>
								<button
									className='sidebar__btn sidebar__btn--xs'
									onClick={() => cancelStockEdit()}
								>
									X
								</button>
							</span>
						) : (
							<button
								className='sidebar__btn sidebar__btn--xs'
								onClick={() => startStockEdit(pres._id, pres.stock)}
							>
								Ajustar
							</button>
						)}
					</div>
				</div>
				<div className='pres-card__actions'>
					{shift && shift.status === 'open' && (
						<button
							className='shift-bar__btn shift-bar__btn--primary shift-bar__btn--sm'
							onClick={() =>
								salePresId === pres._id
									? cancelSale()
									: startSale(pres._id)
							}
						>
							Vender
						</button>
					)}
					<button
						className='sidebar__btn sidebar__btn--xs'
						onClick={() => openEditPres(pres)}
					>
						Editar
					</button>
					<button
						className='sidebar__btn sidebar__btn--xs sidebar__btn--danger'
						onClick={() => deletePres(pres._id)}
					>
						X
					</button>
				</div>
			</div>

			{salePresId === pres._id && (
				<SaleForm
					presentation={pres}
					onSubmit={handleSale}
					onCancel={() => cancelSale()}
				/>
			)}
		</div>
	)
}
