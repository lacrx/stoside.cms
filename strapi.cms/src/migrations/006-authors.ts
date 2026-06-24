import type { Core } from '@strapi/strapi';

export const migration = {
  id: '006-authors',
  description: 'Seed authors Spencer Domingue-Sanford and GT Wharton',
  async run(strapi: Core.Strapi) {
    const names = ['Spencer Domingue-Sanford', 'GT Wharton'];

    for (const name of names) {
      const existing = await strapi
        .documents('api::author.author')
        .findFirst({ filters: { name } });
      if (existing) continue;

      await strapi.documents('api::author.author').create({ data: { name } });
      strapi.log.info(`[migration:006-authors] created author "${name}"`);
    }
  },
};
