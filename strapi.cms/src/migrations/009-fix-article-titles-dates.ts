import type { Core } from '@strapi/strapi';

const FIXES = [
  {
    slug: 'our-wealth-is-downtown',
    title: 'Our Wealth is Downtown',
    publishedAt: '2026-04-22T12:00:00.000Z',
  },
  {
    slug: 'sb79-and-oceanside',
    publishedAt: '2026-06-23T12:00:00.000Z',
  },
] as const;

export const migration = {
  id: '009-fix-article-titles-dates',
  description: 'Fix Our Wealth title period and article publish dates',
  async run(strapi: Core.Strapi) {
    for (const fix of FIXES) {
      const article = await strapi
        .documents('api::article.article')
        .findFirst({ filters: { slug: fix.slug } });

      if (!article) continue;

      const updates: string[] = [];

      if ('title' in fix && article.title !== fix.title) {
        await strapi.documents('api::article.article').update({
          documentId: article.documentId,
          data: { title: fix.title },
          status: 'published',
        });
        updates.push('title');
      }

      // Document service overrides publishedAt with NOW() on publish,
      // so set it via the query engine which writes directly.
      const needsDate = !String(article.publishedAt ?? '').startsWith(fix.publishedAt.slice(0, 10));
      if (needsDate) {
        await strapi.db.query('api::article.article').updateMany({
          where: { documentId: article.documentId },
          data: { publishedAt: fix.publishedAt },
        });
        updates.push('publishedAt');
      }

      if (updates.length > 0) {
        strapi.log.info(
          `[migration:009-fix-article-titles-dates] updated "${fix.slug}": ${updates.join(', ')}`
        );
      }
    }
  },
};
