export const MenuPreview = ({ title, menuData, showPrices }) => {
  return (
    <div className='menu-preview'>
      <div className='menu-preview__paper'>
        <h1 className='menu-preview__title'>{title}</h1>

        {menuData.map((section) => (
          <div key={section.categoryName} className='menu-preview__section'>
            <h2 className='menu-preview__cat'>{section.categoryName}</h2>
            <div className='menu-preview__items'>
              {section.items.map((item) => (
                <div key={item._id} className='menu-preview__item'>
                  <span className='menu-preview__item-name'>
                    {item.code != null && <span className='menu-preview__code'>{item.code}</span>}
                    <span className='menu-preview__item-text'>{item.productName}</span>
                    {item.label && item.label !== 'Unidad' && (
                      <span className='menu-preview__item-label'> — {item.label}</span>
                    )}
                  </span>
                  <span className='menu-preview__dots' />
                  {showPrices && (
                    <span className='menu-preview__item-price'>${item.price.toLocaleString()}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {menuData.length === 0 && (
          <p className='placeholder'>Buscá y seleccioná productos para armar el menú</p>
        )}
      </div>
    </div>
  )
}
