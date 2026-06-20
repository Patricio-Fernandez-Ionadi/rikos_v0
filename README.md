# Rikos v0

Product browser, price calculator, stock manager, and shift-based point-of-sale system for a health food store. Built with React 19 + Vite 7 + SWC (frontend) and Express + Mongoose (backend).

## Commands

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start the Vite dev server (HMR)               |
| `npm run build`      | Production build                              |
| `npm run lint`       | ESLint (flat config: JSX, Hooks, Refresh)     |
| `npm run preview`    | Preview the production build                  |
| `npm run dev:server` | Start Express backend (nodemon via `--watch`) |
| `npm run seed`       | Seed MongoDB from `src/data/seed.json`        |

No test runner, type checker, or formatter is configured.

## Data model

Core entities using `_id` (ObjectId): `Category → Product → Presentation` (1:N:1:N).  
Additional entities: `ProductSupplier` (links products ↔ suppliers), `Order` (purchase orders), `Supplier`.

### Core entities

```
┌─────────────┐       ┌───────────────────┐       ┌───────────────────────┐
│  Category   │       │     Product       │       │ ProductPresentation   │
│─────────────│       │───────────────────│       │───────────────────────│
│ id          │──1:N──│ categoryId        │       │ id                    │
│ name        │       │ id                │       │ productId             │
└─────────────┘       │ name              │──1:N──│ label (opcional)      │
                      │ marca (opcional)  │       │ grams                 │
                      │ purchaseCost      │       │ salePrice             │
                      │ margin            │       │ stock                 │
                      │ saleType          │       └───────────────────────┘
                      │ stockGrams        │
                      │ createdAt         │
                      └───────────────────┘
```

### Category

| Campo  | Tipo            | Descripción            |
| ------ | --------------- | ---------------------- |
| `id`   | `string` (UUID) | Identificador único    |
| `name` | `string`        | Nombre de la categoría |

### Product

| Campo          | Tipo            | Descripción                                            |
| -------------- | --------------- | ------------------------------------------------------ |
| `id`           | `string` (UUID) | Identificador único                                    |
| `categoryId`   | `string` (UUID) | `→ Category.id`                                        |
| `name`         | `string`        | Nombre del producto base (sin presentación)            |
| `marca`        | `string`        | Marca del producto (opcional, para filtrar)            |
| `purchaseCost` | `number│null`   | Costo de compra del producto base (ARS)                |
| `margin`       | `number│null`   | Margen de ganancia en porcentaje (ej: 50 = 50%)        |
| `saleType`     | `string`        | `"unit"` o `"fraction"`                                |
| `stockGrams`   | `number│null`   | Stock en gramos para productos fraccionables           |
| `createdAt`    | `string` (ISO)  | Fecha de creación (útil para detectar duplicados)      |

### ProductPresentation

| Campo       | Tipo            | Descripción                                          |
| ----------- | --------------- | ---------------------------------------------------- |
| `id`        | `string` (UUID) | Identificador único                                  |
| `productId` | `string` (UUID) | `→ Product.id`                                       |
| `label`     | `string│null`   | Etiqueta visible (ej: `"x200"`, `"50g"`, `"unidad"`) |
| `grams`     | `number│null`   | Gramos de la presentación. `null` = unidad completa  |
| `salePrice` | `number│null`   | Precio de venta real fijado manualmente              |
| `stock`     | `number`        | Stock en unidades (default 0)                        |

**Cambio importante:** El `margin` ahora vive en `Product` (no en `Presentation`). Todas las presentaciones de un producto comparten el mismo margen.

---

### ProductSupplier

| Campo               | Tipo            | Descripción                                                    |
| ------------------- | --------------- | -------------------------------------------------------------- |
| `_id`               | `ObjectId`      | Identificador único                                            |
| `productId`         | `ObjectId`      | `→ Product._id`                                                |
| `supplierId`        | `ObjectId`      | `→ Supplier._id`                                               |
| `purchaseCost`      | `number`        | Costo por empaque del proveedor (ARS)                          |
| `supplierUnitLabel` | `string`        | Cómo empaqueta el proveedor, ej: `"Caja x24"`, `"Bolsa 5kg"` (default `"Unidad"`) |
| `supplierUnitQty`   | `number`        | Cuántas unidades de consumo por empaque (default 1)            |

`Product.purchaseCost` se deriva: `ps.purchaseCost / ps.supplierUnitQty`.

### Order

| Campo         | Tipo            | Descripción                                                    |
| ------------- | --------------- | -------------------------------------------------------------- |
| `_id`         | `ObjectId`      | Identificador único                                            |
| `supplierId`  | `ObjectId`      | `→ Supplier._id`                                               |
| `supplierName`| `string`        | Snapshot del nombre del proveedor                              |
| `status`      | `string`        | `"open"` (en curso) o `"placed"` (cerrado), default `"open"`  |
| `items`       | `[OrderItem]`   | Subdocumentos con los productos pedidos                        |
| `totalCost`   | `number`        | Suma de `item.total`                                           |
| `notes`       | `string`        | Notas del pedido                                               |
| timestamps    | `Date`          | `createdAt`, `updatedAt`                                       |

#### OrderItem (subdocumento)

| Campo         | Tipo            | Descripción                                                    |
| ------------- | --------------- | -------------------------------------------------------------- |
| `productId`   | `ObjectId`      | `→ Product._id`                                                |
| `productName` | `string`        | Snapshot del nombre del producto                               |
| `quantity`    | `number`        | Cantidad pedida                                                |
| `unitCost`    | `number`        | Costo por unidad                                               |
| `total`       | `number`        | `quantity × unitCost`                                          |
| `unitLabel`   | `string`        | Snapshot del `supplierUnitLabel` al momento del pedido         |

---

### Qué se persiste vs qué se calcula

#### SOLO se persiste:

- `Category._id`, `Category.name`
- `Product._id`, `Product.categoryId`, `Product.name`, `Product.marca`, `Product.purchaseCost`
- `Product.margin`, `Product.saleType`, `Product.stockGrams`, `Product.createdAt`
- `Presentation._id`, `Presentation.productId`, `Presentation.label`
- `Presentation.grams`, `Presentation.salePrice`, `Presentation.stock`
- `Supplier._id`, `Supplier.name`, `Supplier.contactName`, `Supplier.phone`, `Supplier.email`, `Supplier.notes`
- `ProductSupplier._id`, `ProductSupplier.productId`, `ProductSupplier.supplierId`, `ProductSupplier.purchaseCost`, `ProductSupplier.supplierUnitLabel`, `ProductSupplier.supplierUnitQty`
- `Order._id`, `Order.supplierId`, `Order.supplierName`, `Order.status`, `Order.items[]`, `Order.totalCost`, `Order.notes`, `Order.createdAt`, `Order.updatedAt`

#### NUNCA se persiste (se calcula dinámicamente):

| Campo derivado           | Fórmula                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `unitsPerKg`             | `grams ? 1000 / grams : null`                                                   |
| `costPerPresentation`    | `grams ? purchaseCost / unitsPerKg : purchaseCost` (o `null` si no hay costo)   |
| `listPrice`              | `costPerPres + (margin * costPerPres) / 100` (o `costPerPres` si no hay margen) |
| `equivalentPerKg`        | `grams ? (listPrice / grams) * 1000 : null`                                     |
| `priceDifferencePercent` | `((salePrice * 100) / listPrice) - 100`                                         |
| `priceDifference`        | `salePrice - listPrice`                                                         |

---

### Reglas de negocios clave

1. **Un Product** `──1:N──` **ProductPresentation** (un producto puede tener 1 o N presentaciones)
2. **Un ProductPresentation** pertenece exactamente a **1 Product**
3. **Un Product** pertenece exactamente a **1 Category**
4. `purchaseCost` y `margin` son del Product y se **comparten** entre todas sus presentaciones
5. `grams`, `salePrice`, `stock` son de cada **ProductPresentation**
6. Todo lo demás se **calcula** y **no se guarda**
7. Si `purchaseCost = null` → `costPerPresentation = listPrice = null` (no rompe, muestra estado "sin costo")
8. Si `margin = null` → `listPrice = costPerPresentation` (se vende a costo)
9. Si `salePrice = null` → `diff %` y `diff $` = `null` (no se puede calcular diferencia)
10. **Un Product** `──1:N──` **ProductSupplier** `──N:1──` **Supplier** (un producto puede tener múltiples proveedores, cada uno con su costo y empaque propio)
11. **Una Order** pertenece a **1 Supplier** y tiene **N OrderItem** (subdocumentos)
12. Una orden tiene `status: 'open'` (editable) o `'placed'` (cerrada, solo lectura)

## Architecture

### Frontend (Vite + React 19)
```
index.html → src/main.jsx → [DataProvider] → [ShiftProvider] → App → ProductBrowser
                                                                   └→ ShiftBar
```
- **DataContext** loads from Express API or falls back to `seed.json` when server is unreachable
- **ShiftContext** manages active shift with localStorage persistence + optional DB sync
- Calculations are pure functions — called on render, idempotent
- Entity factories use `crypto.randomUUID()` with fallback

### Backend (Express + Mongoose)
- `server/index.js` — Express app on port 3001, connects to MongoDB via `MONGODB_URI`
- Models in `server/models/`: `Category`, `Product`, `Presentation` (with `stock`), `Shift`, `Supplier`, `ProductSupplier`, `Order`, `Task`, `Ticket`
- REST routes in `server/routes/`: full CRUD for all entities + special endpoints:
  - `PATCH /orders/:id/items` — Add item to an open order (sums quantity if product exists)
  - `PATCH /orders/:id/status` — Change order status (`open` ↔ `placed`)
  - `GET /orders?status=` — Filter orders by status
  - `POST/PUT /product-suppliers` — Accepts `supplierUnitLabel` and `supplierUnitQty`
  - `GET /backup/export?scope=completo|productos|transacciones|tickets-tareas` — JSON backup filtered by scope, uses Mongoose `Model.insertMany()` on restore to preserve ObjectId
- Run `npm run seed` to populate MongoDB from existing `seed.json`

### Quick Order from Product
A "Pedir" button in the product detail view opens a `QuickOrderModal` that:

1. Lists all suppliers assigned to the product
2. Pre-selects the supplier if there's only one, shows a dropdown for multiple
3. Shows the supplier's presentation info (e.g. "Caja x24 (×24 uds.)")
4. Inputs for quantity, unit cost (pre-filled from ProductSupplier), calculated total
5. On confirm: searches for an open order (`status: 'open'`) for that supplier
   - If found → `PATCH /orders/:id/items` (adds or sums quantity)
   - If not → `POST /orders` with `status: 'open'`
6. Navigates to `/orders` filtered by "Abiertos"

The unit label from the supplier's presentation is snapshotted in `OrderItem.unitLabel`.

### Shift system
- localStorage is the source of truth during an open shift (resilient to disconnects)
- On shift open: creates a DB record if server is reachable
- On sale: records locally, posts to DB (deducts stock), stores in localStorage
- Sync button pushes unsynced sales to the DB
- On close: syncs remaining sales, records closing cash, computes expected balance & difference

## Setup

1. Copy `.env.example` to `.env` and configure your MongoDB connection
2. Run `npm install` in both root and `server/`
3. `npm run seed` to populate the database
4. `npm run dev:server` and `npm run dev` in separate terminals

## Style system

- Each component in its own folder with co-located SCSS
- SCSS barrel `_index.scss` per component folder
- `src/theme/index.scss` imports all module/component barrels via `@use`
- Theme variables: `src/theme/values/` (`colors`, `sizes`, `mixins`, etc.)
- BEM naming: `.block__element--modifier`
- Dark theme only (`$background: #121212`)

## Migration from Excel CSV

```
npm run migrate   # or: node src/data/migrate.js
```

Reads `src/data/productos-exel.csv` and writes `src/data/seed.json`. Detects presentation patterns in product names (`x200`, `50g`, etc.), splits into separate Product + Presentation entities, and normalizes categories.

## Conventions

- JSX files use the `.jsx` extension; no TypeScript
- ESLint `no-unused-vars` ignores names matching `^[A-Z_]`; `server/` excluded via `globalIgnores`
- UI labels in Spanish; ARS prices (Argentine pesos)
