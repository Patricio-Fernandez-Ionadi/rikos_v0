# Modelo de Datos — Rikos

## Entidades

```
┌─────────────┐       ┌───────────────┐       ┌───────────────────────┐
│  Category   │       │   Product     │       │ ProductPresentation   │
│─────────────│       │───────────────│       │───────────────────────│
│ id          │──1:N──│ categoryId    │       │ id                    │
│ name        │       │ id            │       │ productId             │
└─────────────┘       │ name          │──1:N──│ label (opcional)      │
                      │ purchaseCost  │       │ grams                 │
                      └───────────────┘       │ margin                │
                                              │ salePrice             │
                                              └───────────────────────┘
```

### Category

| Campo  | Tipo            | Descripción            |
| ------ | --------------- | ---------------------- |
| `id`   | `string` (UUID) | Identificador único    |
| `name` | `string`        | Nombre de la categoría |

### Product

| Campo          | Tipo            | Descripción                                 |
| -------------- | --------------- | ------------------------------------------- |
| `id`           | `string` (UUID) | Identificador único                         |
| `categoryId`   | `string` (UUID) | `→ Category.id`                             |
| `name`         | `string`        | Nombre del producto base (sin presentación) |
| `marca`        | `string`        | Marca del producto (opcional, para filtrar) |
| `purchaseCost` | `number│null`   | Costo de compra del producto base (ARS)     |

### ProductPresentation

| Campo       | Tipo            | Descripción                                          |
| ----------- | --------------- | ---------------------------------------------------- |
| `id`        | `string` (UUID) | Identificador único                                  |
| `productId` | `string` (UUID) | `→ Product.id`                                       |
| `label`     | `string│null`   | Etiqueta visible (ej: `"x200"`, `"50g"`, `"unidad"`) |
| `grams`     | `number│null`   | Gramos de la presentación. `null` = unidad completa  |
| `margin`    | `number│null`   | Margen de ganancia en porcentaje (ej: 50 = 50%)      |
| `salePrice` | `number│null`   | Precio de venta real fijado manualmente              |

---

## Qué se persiste vs qué se calcula

### SOLO se persiste:

- `Category.id`, `Category.name`
- `Product.id`, `Product.categoryId`, `Product.name`, `Product.purchaseCost`
- `Presentation.id`, `Presentation.productId`, `Presentation.label`
- `Presentation.grams`, `Presentation.margin`, `Presentation.salePrice`

### NUNCA se persiste (se calcula dinámicamente):

| Campo derivado           | Fórmula                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `unitsPerKg`             | `grams ? 1000 / grams : null`                                                   |
| `costPerPresentation`    | `grams ? purchaseCost / unitsPerKg : purchaseCost` (o `null` si no hay costo)   |
| `listPrice`              | `costPerPres + (margin * costPerPres) / 100` (o `costPerPres` si no hay margen) |
| `equivalentPerKg`        | `grams ? (listPrice / grams) * 1000 : null`                                     |
| `priceDifferencePercent` | `((salePrice * 100) / listPrice) - 100`                                         |
| `priceDifference`        | `salePrice - listPrice`                                                         |

---

## Ejemplos completos

### 1. Producto entero (sin gramos) — "Aceite de Coco"

```json
{
	"category": { "id": "cat-1", "name": "Aceites y Vinagres" },
	"product": {
		"id": "prod-1",
		"categoryId": "cat-1",
		"name": "Aceite de Coco Entrenuts",
		"purchaseCost": 5578
	},
	"presentation": {
		"id": "pres-1",
		"productId": "prod-1",
		"label": "360g",
		"grams": null,
		"margin": 30,
		"salePrice": 7990
	}
}
```

**Cálculos derivados:**

```
unitsPerKg:          null
costPerPresentation: 5578
listPrice:           7251.4   → 5578 + (30 * 5578 / 100)
equivalentPerKg:     null
diff %:              10.2     → ((7990 * 100) / 7251.4) - 100
diff $:              738.6    → 7990 - 7251.4
```

### 2. Producto fraccionado — "Ají 50g"

```json
{
	"category": { "id": "cat-2", "name": "Condimentos y Especias" },
	"product": {
		"id": "prod-3",
		"categoryId": "cat-2",
		"name": "Ají",
		"purchaseCost": 6077
	},
	"presentation": {
		"id": "pres-3",
		"productId": "prod-3",
		"label": "50g",
		"grams": 50,
		"margin": 80,
		"salePrice": 790
	}
}
```

**Cálculos derivados:**

```
unitsPerKg:          20           → 1000 / 50
costPerPresentation: 303.85       → 6077 / 20
listPrice:           546.93       → 303.85 + (80 * 303.85 / 100)
equivalentPerKg:     10938.6      → (546.93 / 50) * 1000
diff %:              44.4         → ((790 * 100) / 546.93) - 100
diff $:              243.07       → 790 - 546.93
```

### 3. Sin costo — "Alfajor Abuela Mecha"

```json
{
	"category": { "id": "cat-7", "name": "Galletas / Alfajores / Dulces" },
	"product": {
		"id": "prod-5",
		"categoryId": "cat-7",
		"name": "Alfajor Abuela Mecha",
		"purchaseCost": null
	},
	"presentation": {
		"id": "pres-5",
		"productId": "prod-5",
		"label": "Unidad",
		"grams": null,
		"margin": 70,
		"salePrice": 950
	}
}
```

**Cálculos derivados:**

```
unitsPerKg:          null
costPerPresentation: null         → no hay costo
listPrice:           null         → no se puede calcular
equivalentPerKg:     null
diff %:              null         → division por cero, no se calcula
diff $:              null         → no hay listPrice para restar
```

### 4. Múltiples presentaciones — "Bicarbonato de Sodio"

```json
{
	"product": {
		"id": "prod-7",
		"name": "Bicarbonato de Sodio",
		"purchaseCost": 2697
	},

	"presentation A (200g)": {
		"label": "200g",
		"grams": 200,
		"margin": null,
		"salePrice": null
	},
	"presentation B (500g)": {
		"label": "500g",
		"grams": 500,
		"margin": 70,
		"salePrice": 1500
	}
}
```

**Pres A — sin margen ni precio:**

```
costPerPresentation: 539.4    → 2697 / (1000/200)
listPrice:           539.4    → sin margen, = costPerPres
```

**Pres B — con todo:**

```
costPerPresentation: 1348.5   → 2697 / (1000/500)
listPrice:           2292.45  → 1348.5 + (70 * 1348.5 / 100)
diff %:              -34.56   → ((1500 * 100) / 2292.45) - 100
diff $:              -792.45  → 1500 - 2292.45
```

---

## Problemas detectados en el Excel original

| Problema                                                                                                             | Impacto                                            | Solución en el modelo                                                  |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------- |
| **Nombres de producto incluyen presentación** (`bicarbonato x200` vs `bicarbonato x500`)                             | Impide agrupar presentaciones del mismo producto   | Separar `name` en Product (sin presentación) y `label` en Presentation |
| **Costo de compra repetido** (bicarbonato 200g y 500g comparten el mismo costo x kg pero están como filas separadas) | Datos duplicados, riesgo de inconsistencia         | El costo vive en Product, todas las presentaciones lo heredan          |
| **Categorías como strings** (`"Aceites y Vinagres"` escrito igual en cada fila)                                      | Tipos, espacio desperdiciado, errores al renombrar | Categorías normalizadas en tabla `categories`                          |
| **Equivalente x Kg = 0** cuando no hay gramos (ej: `aceite oliva`)                                                   | Confuso, no representa nada real                   | No se persiste; se devuelve `null` porque no aplica                    |
| **Margen sin costo** (`alfajor abuela mecha`: margen 70%, costo vacío)                                               | `listPrice = 0`, diff % rompe                      | `listPrice = null`, UI muestra "sin costo"                             |
| **ID de categoría vacío** (varios productos al final del Excel)                                                      | Huérfanos                                          | `categoryId` requerido; migración debe asignar categoría               |
| **Precio de venta sin costo cargado**                                                                                | Cálculos de diferencia inválidos                   | `diff %` y `diff $` = `null` cuando no hay costo                       |

---

## Escalabilidad futura

### MongoDB

Las entidades mapean directamente a colecciones:

```
db.categories.insertOne({ _id: "...", name: "Aceites" })
db.products.insertOne({ _id: "...", categoryId: "...", name: "...", purchaseCost: 5578 })
db.presentations.insertOne({ _id: "...", productId: "...", label: "50g", grams: 50, margin: 80, salePrice: 790 })
```

En MongoDB podrías embeber presentations dentro de products si queries anidadas son más comunes que consultas aisladas. Pero para máxima flexibilidad y siguiendo el principio de normalización, el diseño separado es mejor.

### Backend API

```
GET   /api/categories
GET   /api/products?categoryId=cat-1
GET   /api/products/:id/presentations
GET   /api/presentations/:id/calculations   → devuelve solo los derivados
```

Los cálculos son **puramente funciones del lado del servidor** (o del cliente en React). Son idempotentes: mismo input → mismo output.

### SQL (si migras después)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  purchase_cost NUMERIC(10,2)
);

CREATE TABLE product_presentations (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id),
  label TEXT,
  grams NUMERIC(10,2),
  margin NUMERIC(5,2),
  sale_price NUMERIC(10,2)
);
```

### React — Store / State

La store debería mantener solo las entidades. Los cálculos se ejecutan **on read** mediante selectors/memos:

```js
// Ejemplo con React state plano
import { calculate } from './data/calculations.js'

function usePresentationWithCalculations(product, presentation) {
	return useMemo(
		() => calculate(product, presentation),
		[product, presentation],
	)
}
```

---

## Migración desde Excel

El paso más delicado es **desambiguar names de productos** en el Excel actual:

1. Exportar CSV del Excel
2. Pasar por un script que:
   - Extrae categorías únicas de la columna "Categoria" (con el ID)
   - Por cada fila, intenta detectar si el nombre incluye una presentación
     - Patrones: `x\d+`, `\d+g`, `\d+gr`
     - Si detecta: separa en product name + presentation label
     - Si no detecta: product name completo, label = "Unidad"
   - Si dos filas tienen el mismo product name y categoría → son el mismo Product con diferentes Presentation
   - Si `Gr` = vacío y no se detectó presentación en el nombre → `grams: null, label: "Unidad"`
   - Si `Gr` > 0 → `grams: Gr, label: Gr+"g"`
3. Generar JSON de categories, products, presentations

---

## Reglas de negocios clave

1. **Un Product** `──1:N──` **ProductPresentation** (un producto puede tener 1 o N presentaciones)
2. **Un ProductPresentation** pertenece exactamente a **1 Product**
3. **Un Product** pertenece exactamente a **1 Category**
4. `purchaseCost` es del Product y se **comparte** entre todas sus presentaciones
5. `grams`, `margin`, `salePrice` son de cada **ProductPresentation**
6. Todo lo demás se **calcula** y **no se guarda**
7. Si `purchaseCost = null` → `costPerPresentation = listPrice = null` (no rompe, muestra estado "sin costo")
8. Si `margin = null` → `listPrice = costPerPresentation` (se vende a costo)
9. Si `salePrice = null` → `diff %` y `diff $` = `null` (no se puede calcular diferencia)
