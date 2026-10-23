import type { Core } from '@strapi/strapi';

const DATA_PAGES = [
  {
    title: 'Permitted Units',
    slug: 'permitted-units',
    dashboardType: 'permitted-units' as const,
    description: 'Housing units approved by census tract, with RHNA pace tracking',
    sortOrder: 1,
    dataUpdatedAt: '2026-10-01',
  },
  {
    title: 'Affordable Units',
    slug: 'affordable-units',
    dashboardType: 'affordable-units' as const,
    description: 'Deed-restricted and market-rate units by income tier and census tract',
    sortOrder: 2,
    dataUpdatedAt: '2026-10-01',
  },
  {
    title: 'Affordability Map',
    slug: 'affordability-map',
    dashboardType: 'affordability-map' as const,
    description: 'Rent burden, home prices, and income ratios by census tract',
    sortOrder: 3,
    dataUpdatedAt: '2026-10-01',
  },
];

export const migration = {
  id: '017-seed-data-pages',
  description: 'Seed the three Data Page dashboard entries',
  async run(strapi: Core.Strapi) {
    for (const page of DATA_PAGES) {
      const existing = await strapi
        .documents('api::data-page.data-page')
        .findFirst({ filters: { slug: page.slug }, status: 'published' });

      if (existing) continue;

      await strapi.documents('api::data-page.data-page').create({
        data: page,
        status: 'published',
      });
      strapi.log.info(`[migration:017-seed-data-pages] created "${page.slug}"`);
    }
  },
};
