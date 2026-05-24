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

Three entities using `_id` (not `id`): `Category → Product → Presentation` (1:N).

- A **Product** has a `purchaseCost` shared by all its presentations
- A **Presentation** has `grams`, `margin`, `salePrice`, `stock` — specific to each variant
- All derived fields (list price, cost per presentation, difference %) are calculated on read via pure functions in `src/data/calculations.js` — nothing is persisted
- **Shift** has embedded `SaleItem` sub-documents with product, quantity, unit price, total

See `src/data/README.md` for the full schema, derived field formulas, and edge cases.

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
- Models in `server/models/`: `Category`, `Product`, `Presentation` (with `stock`), `Shift`
- REST routes in `server/routes/`: full CRUD for categories/products/presentations + shift management
- Run `npm run seed` to populate MongoDB from existing `seed.json`

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

Each component directory has a `style/` folder with SCSS partials:
- `_index.scss` forwards all partials in that directory
- `src/theme/index.scss` imports each component `style/` directory
- Use theme variables from `src/theme/values/` (`colors`, `sizes`, `mixins`, etc.)
- Inline styles are deprecated — use SCSS classes instead

## Migration from Excel CSV

```
npm run migrate   # or: node src/data/migrate.js
```

Reads `src/data/productos-exel.csv` and writes `src/data/seed.json`. Detects presentation patterns in product names (`x200`, `50g`, etc.), splits into separate Product + Presentation entities, and normalizes categories.

## Conventions

- JSX files use the `.jsx` extension; no TypeScript
- ESLint `no-unused-vars` ignores names matching `^[A-Z_]`; `server/` excluded via `globalIgnores`
- Every function must have a JSDoc comment describing its purpose, params, and return
- Spanish UI labels; ARS prices (Argentine pesos)
