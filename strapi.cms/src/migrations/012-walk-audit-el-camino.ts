import type { Core } from '@strapi/strapi';

const SLUG = 'el-camino-mission-douglas';

export const migration = {
  id: '012-walk-audit-el-camino',
  description: 'Seed walk audit "El Camino, Mission, Douglas"',
  async run(strapi: Core.Strapi) {
    const existing = await strapi
      .documents('api::walk-audit.walk-audit')
      .findFirst({ filters: { slug: SLUG }, status: 'published' });

    if (existing) {
      strapi.log.info(`[migration:012-walk-audit-el-camino] already exists, skipping`);
      return;
    }

    await strapi.documents('api::walk-audit.walk-audit').create({
      data: {
        title: 'El Camino, Mission, Douglas',
        slug: SLUG,
        date: '2026-09-12',
        status: 'active',
        description:
          'Walk audit of El Camino Real corridor, Mission Ave, and Douglas Dr in Oceanside',
        mapUrl:
          'https://www.google.com/maps/d/viewer?mid=1FuU8sNqgb8aM1XqoUEZefaRdBAdDoMQ&usp=sharing',
        segments: [
          { name: '1: Mission btwn El Camino and Douglas' },
          { name: '2: El Camino btwn Mission and MHP' },
          { name: '3: Mission and El Camino to 76' },
        ],
      },
      status: 'published',
    });
    strapi.log.info(`[migration:012-walk-audit-el-camino] created walk audit "${SLUG}"`);

    await strapi.db.query('api::walk-audit.walk-audit').updateMany({
      where: { slug: SLUG },
      data: { publishedAt: '2026-09-12T12:00:00.000Z' },
    });
  },
};
