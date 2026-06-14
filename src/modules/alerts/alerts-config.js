export const ALERTS = {
  'no-cost': {
    title: 'Productos sin costo',
    filter: (products) => products.filter((p) => p.purchaseCost == null),
    emptyMsg: 'Todos los productos tienen costo cargado',
  },
  'no-margin': {
    title: 'Productos sin margen',
    filter: (products) => products.filter((p) => p.margin == null),
    emptyMsg: 'Todos los productos tienen margen cargado',
  },
  'no-sale-price': {
    title: 'Productos sin precio de venta',
    filter: (products, presentations) =>
      products.filter((p) => {
        const pres = presentations.filter((pr) => pr.productId === p._id)
        return pres.length > 0 && pres.every((pr) => pr.salePrice == null)
      }),
    emptyMsg: 'Todos los productos tienen precio de venta cargado',
  },
  'no-presentations': {
    title: 'Productos sin presentaciones',
    filter: (products, presentations) =>
      products.filter((p) => !presentations.some((pr) => pr.productId === p._id)),
    emptyMsg: 'Todos los productos tienen presentaciones cargadas',
  },
}
