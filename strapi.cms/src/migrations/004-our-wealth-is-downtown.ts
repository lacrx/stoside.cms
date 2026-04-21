import type { Core } from '@strapi/strapi';

// Seed the "Our Wealth is Downtown" article. Idempotent on slug; also
// backfills the author link if the article existed before the author
// migration ran.
export const migration = {
  id: '004-our-wealth-is-downtown',
  description: 'Seed article "our-wealth-is-downtown" + link it to Thomas LaCroix',
  async run(strapi: Core.Strapi) {
    const slug = 'our-wealth-is-downtown';
    const author = await strapi
      .documents('api::author.author')
      .findFirst({ filters: { name: 'Thomas LaCroix' } });
    if (!author) {
      strapi.log.warn(`[migration:004-our-wealth-is-downtown] author not found, run 003 first`);
      return;
    }

    const existing = await strapi.documents('api::article.article').findFirst({
      filters: { slug },
      populate: ['author'],
      status: 'published',
    });

    if (!existing) {
      await strapi.documents('api::article.article').create({
        data: {
          title: 'Our Wealth is Downtown.',
          description: 'A value-per-acre map of every parcel in Oceanside.',
          slug,
          author: author.documentId,
          blocks: [
            {
              __component: 'shared.rich-text',
              body: "Downtown subsidizes the rest of Oceanside. We'd love to show you why with our interactive map. You're looking at the value-per-acre for every piece of land in Oceanside. Like a compressed gem, downtown's value is great despite its small footprint. This map shows us where Oceanside has made its best investments as a city, and who contributes most to its coffers.",
            },
            {
              __component: 'shared.visualization',
              vizId: 'oceanside-vpa-3d',
              caption:
                'Value per acre of every Oceanside parcel, 2023. Tilt/rotate with the controls or drag.',
              height: 560,
              align: 'inline',
            },
            {
              __component: 'shared.rich-text',
              body: "Suburban tax base is an oxymoron. We have spent generations laying intense infrastructure eastward to attract growth. But outward growth doesn't pay. And it's not sustainable. The city makes money from the coast and downtown. So we should treat them with respect. We need to begin making investments in our downtown again. Main Street Oceanside has never forgotten about our untapped yearning to be with each other downtown.",
            },
            {
              __component: 'shared.rich-text',
              body: "We need to make downtown a pleasant place to be outside of a car. A four-lane arterial is no way to treat ourselves. We can do better. By fixing sidewalks and building benches, we're doing it.",
            },
          ],
        },
        status: 'published',
      });
      strapi.log.info(`[migration:004-our-wealth-is-downtown] created article "${slug}"`);
    } else if (!(existing as { author?: unknown }).author) {
      await strapi.documents('api::article.article').update({
        documentId: existing.documentId,
        data: { author: author.documentId },
        status: 'published',
      });
      strapi.log.info(`[migration:004-our-wealth-is-downtown] linked author to existing article`);
    }
  },
};
