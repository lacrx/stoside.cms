import type { Core } from '@strapi/strapi';

export const migration = {
  id: '011-walk-audit-permissions',
  description: 'Public-role read permissions for walk audits',
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
      'api::walk-audit.walk-audit.find',
      'api::walk-audit.walk-audit.findOne',
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
