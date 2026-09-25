import type { Core } from '@strapi/strapi';

const ARTICLE_DATA = {
  title: "San Clemente's Wealth is Downtown.",
  description:
    "An Urban3-style 3D map of San Clemente's assessed property values, showing where the city's fiscal productivity concentrates.",
  slug: 'san-clemente-wealth-is-downtown',
  blocks: [
    {
      __component: 'shared.rich-text' as const,
      body: "Most people think of San Clemente as a quiet beach town. What they don't see is the fiscal engine underneath the surface. Using public data from the Orange County Treasurer-Tax Collector, we mapped the assessed value of every parcel in the city, normalized by acreage, and extruded the result into three dimensions.\n\nThe tallest spikes on this map are the most fiscally productive land in San Clemente: small lots generating enormous assessed value per acre. The flattest areas are the least productive, consuming the same roads, water, sewer, and emergency services while contributing far less.",
    },
    {
      __component: 'shared.visualization' as const,
      vizId: 'san-clemente-vpa-3d',
      caption:
        'Value per acre of San Clemente parcels, 2025. Taller = more assessed value per acre. Tilt/rotate with the controls or drag.',
      height: 600,
      align: 'full-bleed' as const,
    },
    {
      __component: 'shared.rich-text' as const,
      body: "## What the map shows\n\nSan Clemente has 9,591 parcels with a combined assessed value of $10.4 billion. The median value per acre is $6.5 million, driven by the city's small residential lots on expensive coastal land.\n\nThe pattern is consistent with what Urban3 finds everywhere: the traditional, walkable parts of a city, where lots are small and buildings sit close to the street, generate far more value per acre than auto-oriented development on larger lots.\n\nThe highest-value parcels cluster along the old downtown core near Avenida Del Mar, where small commercial and residential lots pack enormous assessed value into tiny footprints. Condos and townhomes (877 parcels, median $6.8M/acre) outperform single-family homes on a per-acre basis because they put more housing on less land.",
    },
    {
      __component: 'shared.rich-text' as const,
      body: "## What this means for San Clemente\n\nThis data tells a simple story. The most productive land in San Clemente is the land with the least infrastructure per unit of value: compact lots, shared walls, walkable streets. Every time the city approves development on large lots at the suburban fringe, it's choosing the fiscally weakest pattern over the strongest.\n\nSan Clemente's traditional neighborhoods weren't built this way by accident. They were built before zoning made this pattern illegal. The question for San Clemente today is whether it will allow more of the development pattern that already works, or continue mandating the one that doesn't.",
    },
    {
      __component: 'shared.rich-text' as const,
      body: "## Data and methodology\n\nParcel boundaries and assessed values from the Orange County Treasurer-Tax Collector's public ArcGIS service. Value per acre = total assessed value / parcel acreage. Assessed values reflect Prop 13 constraints; market values would be significantly higher for properties purchased before the recent cycle.\n\nThis visualization uses the same approach as our [Oceanside value-per-acre map](/articles/our-wealth-is-downtown). The color scale and height mapping are identical, making the two cities directly comparable.",
    },
  ],
};

export const migration = {
  id: '014-san-clemente-wealth',
  description: 'Seed article "san-clemente-wealth-is-downtown"',
  async run(strapi: Core.Strapi) {
    const author = await strapi
      .documents('api::author.author')
      .findFirst({ filters: { name: 'Thomas LaCroix' } });
    if (!author) {
      strapi.log.warn(`[migration:014-san-clemente-wealth] author not found, run 003 first`);
      return;
    }
    const authors = [author.documentId];

    const existing = await strapi
      .documents('api::article.article')
      .findFirst({ filters: { slug: ARTICLE_DATA.slug }, status: 'published' });

    if (!existing) {
      await strapi.documents('api::article.article').create({
        data: { ...ARTICLE_DATA, authors },
        status: 'published',
      });
      strapi.log.info(`[migration:014-san-clemente-wealth] created article "${ARTICLE_DATA.slug}"`);
      return;
    }

    await strapi.documents('api::article.article').update({
      documentId: existing.documentId,
      data: { ...ARTICLE_DATA, authors },
      status: 'published',
    });
    strapi.log.info(`[migration:014-san-clemente-wealth] refreshed article "${ARTICLE_DATA.slug}"`);
  },
};
