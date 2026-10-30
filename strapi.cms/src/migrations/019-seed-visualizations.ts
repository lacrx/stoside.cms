import type { Core } from '@strapi/strapi';

const VISUALIZATIONS = [
  {
    vizId: 'oceanside-vpa-3d',
    type: 'choropleth-3d-maplibre',
    title: 'Oceanside Value per Acre',
    source: 'San Diego County Assessor, 2023',
    config: {
      featuresTilesUrl: '/tiles/oceanside-parcels.pmtiles',
      tilesLayer: 'features',
      camera: {
        center: [-117.3795, 33.1965],
        zoom: 12.5,
        pitch: 45,
        bearing: 0,
      },
      color: {
        field: 'vpa',
        domain: [100000, 500000, 1500000, 3500000, 7000000],
        range: ['#f0f4f7', '#b3d4e8', '#6baed6', '#2171b5', '#08519c', '#042f6b'],
      },
      elevation: {
        field: 'vpa',
        divisor: 50,
      },
      fallback2d: {
        maxViewportWidth: 360,
      },
    },
  },
  {
    vizId: 'san-clemente-vpa-3d',
    type: 'choropleth-3d-maplibre',
    title: 'San Clemente Value per Acre',
    source: 'Orange County Treasurer-Tax Collector, 2025',
    config: {
      featuresTilesUrl: '/tiles/san-clemente-parcels.pmtiles',
      tilesLayer: 'features',
      camera: {
        center: [-117.623, 33.435],
        zoom: 13,
        pitch: 45,
        bearing: 0,
      },
      color: {
        field: 'vpa',
        domain: [100000, 500000, 1500000, 3500000, 7000000],
        range: ['#f0f4f7', '#b3d4e8', '#6baed6', '#2171b5', '#08519c', '#042f6b'],
      },
      elevation: {
        field: 'vpa',
        divisor: 50,
      },
      fallback2d: {
        maxViewportWidth: 360,
      },
    },
  },
];

export const migration = {
  id: '019-seed-visualizations',
  description: 'Seed choropleth visualization entries for Oceanside and San Clemente',
  async run(strapi: Core.Strapi) {
    for (const viz of VISUALIZATIONS) {
      const existing = await strapi
        .documents('api::visualization.visualization')
        .findFirst({ filters: { vizId: viz.vizId }, status: 'published' });

      if (existing) {
        await strapi.documents('api::visualization.visualization').update({
          documentId: existing.documentId,
          data: viz,
          status: 'published',
        });
        strapi.log.info(`[migration:019-seed-visualizations] refreshed "${viz.vizId}"`);
        continue;
      }

      await strapi.documents('api::visualization.visualization').create({
        data: viz,
        status: 'published',
      });
      strapi.log.info(`[migration:019-seed-visualizations] created "${viz.vizId}"`);
    }
  },
};
