import type { Core } from '@strapi/strapi';

// Ensure the single Site Settings document exists. Idempotent on presence;
// also backfills empty fields when new defaults are added to the schema.
export const migration = {
  id: '002-site-setting',
  description: 'Seed or backfill the single Site Settings document',
  async run(strapi: Core.Strapi) {
    const defaults = {
      instagramUrl: 'https://www.instagram.com/strongtowns.oceanside/',
      meetupUrl: 'https://www.meetup.com/north-county-urbanists/',
    };

    const existing = await strapi
      .documents('api::site-setting.site-setting')
      .findFirst({ status: 'published' });

    if (!existing) {
      await strapi.documents('api::site-setting.site-setting').create({
        data: defaults,
        status: 'published',
      });
      strapi.log.info(`[migration:002-site-setting] created site-setting document`);
      return;
    }

    const patches = Object.fromEntries(
      Object.entries(defaults).filter(([key]) => !(existing as Record<string, unknown>)[key])
    );
    if (Object.keys(patches).length > 0) {
      await strapi.documents('api::site-setting.site-setting').update({
        documentId: existing.documentId,
        data: patches,
        status: 'published',
      });
      strapi.log.info(
        `[migration:002-site-setting] backfilled: ${Object.keys(patches).join(', ')}`
      );
    }
  },
};
