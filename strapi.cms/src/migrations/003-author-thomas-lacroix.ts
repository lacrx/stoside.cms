import type { Core } from '@strapi/strapi';

// Ensure the "Thomas LaCroix" author exists so the first article has a byline.
// Idempotent on name.
export const migration = {
  id: '003-author-thomas-lacroix',
  description: 'Seed author Thomas LaCroix',
  async run(strapi: Core.Strapi) {
    const name = 'Thomas LaCroix';
    const existing = await strapi.documents('api::author.author').findFirst({ filters: { name } });
    if (existing) return;

    await strapi.documents('api::author.author').create({ data: { name } });
    strapi.log.info(`[migration:003-author-thomas-lacroix] created author "${name}"`);
  },
};
