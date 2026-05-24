# Rikos v0

Product browser and price calculator for a health food store. Built with React 19 + Vite 7 + SWC.

## Commands

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the Vite dev server (HMR)    |
| `npm run build`      | Production build                   |
| `npm run lint`       | ESLint (flat config: JSX, Hooks, Refresh) |
| `npm run preview`    | Preview the production build       |

No test runner, type checker, or formatter is configured.

## Data model

Three entities using `_id` (not `id`): `Category → Product → Presentation` (1:N).

- A **Product** has a `purchaseCost` shared by all its presentations
- A **Presentation** has `grams`, `margin`, `salePrice` — specific to each variant
- All derived fields (list price, cost per presentation, difference %) are calculated on read via pure functions in `src/data/calculations.js` — nothing is persisted

See `src/data/README.md` for the full schema, derived field formulas, and edge cases.

## Architecture

```
index.html → src/main.jsx → src/app/App.jsx → src/app/ProductBrowser.jsx
```

- Data source: `src/data/seed.json` (static, no backend)
- Calculations: `src/data/calculations.js` — called on render, idempotent
- Entity factories: `src/data/entities.js` (uses `crypto.randomUUID()`)
- Styling: SCSS via `src/theme/`, compiled by Vite's built-in Sass support
- No router, no state library, no tests

### Style system

Each component directory has a `style/` folder with SCSS partials:

- `_index.scss` forwards all partials in that directory
- `src/theme/index.scss` imports each component `style/` directory
- Use theme variables from `src/theme/values/` (`colors`, `sizes`, `mixins`, etc.)
- Inline styles are deprecated — use SCSS classes instead

### Component extraction status

`src/categorias/cat-sidebar-for-products.jsx`, `src/products/product-list.jsx`, and `src/products/product-presentation.jsx` are extracted components that are **not currently wired into** `ProductBrowser.jsx`. The browser inlines its own UI.

## Migration from Excel CSV

A Node script reads `src/data/productos-exel.csv` and writes `src/data/seed.json`:

```
node src/data/migrate.js
```

The migration detects presentation patterns in product names (`x200`, `50g`, etc.), splits them into separate Product + Presentation entities, and normalizes categories.

## Conventions

- JSX files use the `.jsx` extension; no TypeScript
- ESLint `no-unused-vars` ignores names matching `^[A-Z_]`
- Every function must have a JSDoc comment describing its purpose, params, and return
- Spanish UI labels; ARS prices (Argentine pesos)
