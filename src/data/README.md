# Modelo de Datos — Rikos

## Entidades

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

## Qué se persiste vs qué se calcula

### SOLO se persiste:

- `Category.id`, `Category.name`
- `Product.id`, `Product.categoryId`, `Product.name`, `Product.marca`, `Product.purchaseCost`
- `Product.margin`, `Product.saleType`, `Product.stockGrams`, `Product.createdAt`
- `Presentation.id`, `Presentation.productId`, `Presentation.label`
- `Presentation.grams`, `Presentation.salePrice`, `Presentation.stock`

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

## Reglas de negocios clave

1. **Un Product** `──1:N──` **ProductPresentation** (un producto puede tener 1 o N presentaciones)
2. **Un ProductPresentation** pertenece exactamente a **1 Product**
3. **Un Product** pertenece exactamente a **1 Category**
4. `purchaseCost` y `margin` son del Product y se **comparten** entre todas sus presentaciones
5. `grams`, `salePrice`, `stock` son de cada **ProductPresentation**
6. Todo lo demás se **calcula** y **no se guarda**
7. Si `purchaseCost = null` → `costPerPresentation = listPrice = null` (no rompe, muestra estado "sin costo")
8. Si `margin = null` → `listPrice = costPerPresentation` (se vende a costo)
9. Si `salePrice = null` → `diff %` y `diff $` = `null` (no se puede calcular diferencia)
