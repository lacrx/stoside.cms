# Database Migrations

Strapi runs migration files from `database/migrations/` automatically on startup,
in alphabetical order. Each file must export `up(knex)` and optionally `down(knex)`.

## Naming Convention

Files are named with a timestamp prefix for ordering:

```
YYYY.MM.DDT00.00.00.description.js
```

## How It Works

- **`up(knex)`** — Runs when the migration has not been applied yet. Strapi tracks
  which migrations have run in an internal `strapi_migrations` table.
- **`down(knex)`** — Rollback logic. Not called automatically by Strapi, but useful
  if you need to manually revert via a script.

## Initial Migration

`2026.04.14T00.00.00.create-initial-schema.js` creates:

| Table                          | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| `authors`                      | Author collection type                             |
| `articles`                     | Article collection type (with draft/publish)       |
| `components_shared_rich_texts` | `shared.rich-text` component                       |
| `articles_components`          | Dynamic zone link table for Article `blocks` field |
| `articles_author_lnk`          | Relation link table (Article → Author)             |

## Adding New Migrations

When you change the data model, create a new migration file:

```bash
# Example: adding a "category" field to articles
touch database/migrations/2026.05.01T00.00.00.add-category-to-articles.js
```

```js
async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('articles', 'category');
  if (!hasColumn) {
    await knex.schema.alterTable('articles', (table) => {
      table.string('category');
    });
  }
}

async function down(knex) {
  await knex.schema.alterTable('articles', (table) => {
    table.dropColumn('category');
  });
}

module.exports = { up, down };
```

## Notes

- Strapi also auto-syncs schemas from `src/api/*/content-types/*/schema.json` on boot,
  so migrations are complementary — they give you explicit control for production deployments.
- Always make migrations idempotent (check `hasTable`/`hasColumn` before creating).
- The `knex` object follows the [Knex.js](https://knexjs.org/) API.
