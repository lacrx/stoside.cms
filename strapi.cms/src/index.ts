export default {
  register() {},
  async bootstrap({ strapi }) {
    // Grant public role read access to articles, authors, uploads, and
    // site settings so the Gatsby frontend can query GraphQL without auth.
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const existing = await strapi
        .query('plugin::users-permissions.permission')
        .findMany({ where: { role: publicRole.id } });

      const existingActions = new Set(existing.map((p) => p.action));

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
    }

    // Seed the single Site Settings record on first boot so the Gatsby
    // build has something to fetch. Existing records are left untouched
    // so edits made through the admin UI are preserved across restarts.
    try {
      const existing = await strapi
        .documents('api::site-setting.site-setting')
        .findFirst({ status: 'published' });

      if (!existing) {
        await strapi.documents('api::site-setting.site-setting').create({
          data: { instagramUrl: 'https://www.instagram.com/strongtowns.oceanside/' },
          status: 'published',
        });
      }
    } catch (err) {
      strapi.log.warn(`[bootstrap] Could not seed site-setting: ${(err as Error).message}`);
    }
  },
};
