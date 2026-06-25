import type { Core } from '@strapi/strapi';

const FIXES = [
  {
    slug: 'our-wealth-is-downtown',
    title: 'Our Wealth is Downtown',
    publishedAt: '2026-04-22T00:00:00.000Z',
  },
  {
    slug: 'sb79-and-oceanside',
    publishedAt: '2026-06-23T00:00:00.000Z',
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

      const data: Record<string, string> = {};

      if ('title' in fix && article.title !== fix.title) {
        data.title = fix.title;
      }
      if (!String(article.publishedAt ?? '').startsWith(fix.publishedAt.slice(0, 10))) {
        data.publishedAt = fix.publishedAt;
      }

      if (Object.keys(data).length === 0) continue;

      await strapi.documents('api::article.article').update({
        documentId: article.documentId,
        data,
        status: 'published',
      });
      strapi.log.info(
        `[migration:009-fix-article-titles-dates] updated "${fix.slug}": ${Object.keys(data).join(', ')}`
      );
    }
  },
};
