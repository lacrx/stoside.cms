import type { Core } from '@strapi/strapi';

// Grant the public role read access to the content types the Gatsby frontend
// queries at build time. Idempotent: each action is only added if missing.
export const migration = {
  id: '001-public-permissions',
  description: 'Public-role read permissions for articles, authors, site-settings, uploads',
  async run(strapi: Core.Strapi) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });
    const existingActions = new Set(existing.map((p: { action: string }) => p.action));

    const requiredActions = [
      'api::article.article.find',
      'api::article.article.findOne',
      'api::author.author.find',
      'api::author.author.findOne',
      'api::site-setting.site-setting.find',
      'plugin::upload.content-api.find',
      'plugin::upload.content-api.findOne',
    ];

    for (const action of requiredActions) {
      if (!existingActions.has(action)) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }
  },
};
