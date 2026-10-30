import type { Core } from '@strapi/strapi';

export const migration = {
  id: '018-visualization-permissions',
  description: 'Public-role read permissions for visualizations',
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
      'api::visualization.visualization.find',
      'api::visualization.visualization.findOne',
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
