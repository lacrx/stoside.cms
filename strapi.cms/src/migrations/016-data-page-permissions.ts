import type { Core } from '@strapi/strapi';

export const migration = {
  id: '016-data-page-permissions',
  description: 'Public-role read permissions for data pages',
  async run(strapi: Core.Strapi) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });
    const existingActions = new Set(existing.map((p: { action: string }) => p.action));

    const requiredActions = ['api::data-page.data-page.find', 'api::data-page.data-page.findOne'];

    for (const action of requiredActions) {
      if (!existingActions.has(action)) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id },
        });
      }
    }
  },
};
