'use strict';

/**
 * Migration: Switch article–author relation from manyToOne to manyToMany.
 *
 * Strapi auto-creates the new link table on boot, but this migration
 * cleans up the old one so the schema stays tidy.
 */

async function up(knex) {
  await knex.schema.dropTableIfExists('articles_author_lnk');
}

async function down(knex) {
  const has = await knex.schema.hasTable('articles_author_lnk');
  if (!has) {
    await knex.schema.createTable('articles_author_lnk', (table) => {
      table.increments('id').primary();
      table.integer('article_id').unsigned();
      table.integer('author_id').unsigned();
      table.integer('article_ord').unsigned();
    });
  }
}

module.exports = { up, down };
