'use strict';

/**
 * Migration: Create initial schema for Article, Author, and shared.rich-text component.
 *
 * Strapi auto-creates tables from content-type schemas on first boot, but these
 * migrations serve as an explicit, version-controlled record of your data structure
 * for deployment pipelines where you want deterministic schema changes.
 *
 * This migration is idempotent — it only creates tables/columns if they don't exist.
 */

async function up(knex) {
  // ---------------------------------------------------------------
  // Authors table
  // ---------------------------------------------------------------
  const hasAuthors = await knex.schema.hasTable('authors');
  if (!hasAuthors) {
    await knex.schema.createTable('authors', (table) => {
      table.increments('id').primary();
      table.string('document_id');
      table.string('name').notNullable();
      table.string('locale');
      table.string('published_at');
      table.timestamps(true, true); // created_at, updated_at
      table.string('created_by_id');
      table.string('updated_by_id');
    });
  }

  // ---------------------------------------------------------------
  // Articles table
  // ---------------------------------------------------------------
  const hasArticles = await knex.schema.hasTable('articles');
  if (!hasArticles) {
    await knex.schema.createTable('articles', (table) => {
      table.increments('id').primary();
      table.string('document_id');
      table.string('title').notNullable();
      table.text('description');
      table.string('slug');
      table.string('locale');
      table.string('published_at');
      table.timestamps(true, true);
      table.string('created_by_id');
      table.string('updated_by_id');
    });
  }

  // ---------------------------------------------------------------
  // Components: shared_rich_texts
  // ---------------------------------------------------------------
  const hasRichTexts = await knex.schema.hasTable('components_shared_rich_texts');
  if (!hasRichTexts) {
    await knex.schema.createTable('components_shared_rich_texts', (table) => {
      table.increments('id').primary();
      table.text('body');
    });
  }

  // ---------------------------------------------------------------
  // Dynamic zone link table: articles_components
  // (Strapi creates these automatically, but we define them for completeness)
  // ---------------------------------------------------------------
  const hasArticlesComponents = await knex.schema.hasTable('articles_components');
  if (!hasArticlesComponents) {
    await knex.schema.createTable('articles_components', (table) => {
      table.increments('id').primary();
      table.integer('entity_id').unsigned();
      table.integer('component_id').unsigned();
      table.string('component_type');
      table.string('field').defaultTo('blocks');
      table.integer('order').unsigned().defaultTo(0);
    });
  }

  // ---------------------------------------------------------------
  // Relation link table: articles_authors_lnk
  // (Many articles ↔ many authors)
  // ---------------------------------------------------------------
  const hasArticlesAuthorsLnk = await knex.schema.hasTable('articles_authors_lnk');
  if (!hasArticlesAuthorsLnk) {
    await knex.schema.createTable('articles_authors_lnk', (table) => {
      table.increments('id').primary();
      table.integer('article_id').unsigned();
      table.integer('author_id').unsigned();
      table.integer('article_ord').unsigned();
      table.integer('author_ord').unsigned();
    });
  }
}

async function down(knex) {
  await knex.schema.dropTableIfExists('articles_authors_lnk');
  await knex.schema.dropTableIfExists('articles_components');
  await knex.schema.dropTableIfExists('components_shared_rich_texts');
  await knex.schema.dropTableIfExists('articles');
  await knex.schema.dropTableIfExists('authors');
}

module.exports = { up, down };
