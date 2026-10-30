import type { Core } from '@strapi/strapi';

const UPDATES: Record<string, Record<string, unknown>> = {
  'oceanside-vpa-3d': {
    camera: {
      center: [-117.3795, 33.1965],
      zoom: 12.5,
      pitch: 60,
      bearing: -25,
    },
    color: {
      field: 'vpa',
      domain: [100000, 500000, 1500000, 3500000, 7000000],
      range: ['#2c1049', '#6a1b9a', '#bc3754', '#ed6925', '#f9b641', '#fcffa4'],
    },
    elevation: {
      field: 'vpa',
      divisor: 25,
    },
  },
  'san-clemente-vpa-3d': {
    camera: {
      center: [-117.623, 33.435],
      zoom: 13,
      pitch: 60,
      bearing: -25,
    },
    color: {
      field: 'vpa',
      domain: [100000, 500000, 1500000, 3500000, 7000000],
      range: ['#2c1049', '#6a1b9a', '#bc3754', '#ed6925', '#f9b641', '#fcffa4'],
    },
    elevation: {
      field: 'vpa',
      divisor: 25,
    },
  },
};

export const migration = {
  id: '020-choropleth-dark-theme',
  description:
    'Update choropleth palette to inferno-inspired spectral and camera to dramatic angle',
  async run(strapi: Core.Strapi) {
    for (const [vizId, overrides] of Object.entries(UPDATES)) {
      const existing = await strapi
        .documents('api::visualization.visualization')
        .findFirst({ filters: { vizId }, status: 'published' });

      if (!existing) {
        strapi.log.warn(`[migration:020] "${vizId}" not found, skipping`);
        continue;
      }

      const currentConfig =
        existing.config && typeof existing.config === 'object'
          ? (existing.config as Record<string, unknown>)
          : {};

      await strapi.documents('api::visualization.visualization').update({
        documentId: existing.documentId,
        data: {
          config: { ...currentConfig, ...overrides } as any,
        },
        status: 'published',
      });
      strapi.log.info(`[migration:020] updated "${vizId}" palette + camera`);
    }
  },
};
