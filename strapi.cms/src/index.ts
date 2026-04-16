export default {
  register() {},
  async bootstrap({ strapi }) {
    // Grant public role read access to articles, authors, and uploads
    // so the Gatsby frontend can query the GraphQL API without auth.
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });

    const existingActions = new Set(existing.map((p) => p.action));

    const requiredActions = [
      'api::article.article.find',
      'api::article.article.findOne',
      'api::author.author.find',
      'api::author.author.findOne',
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
