import type { Core } from '@strapi/strapi';

const SLUG = 'sb79-and-oceanside';
const CORRECT_DESCRIPTION = "Oceanside's relentless fight for their right to block housing.";
const CORRECT_DATE = '2026-06-23';

export const migration = {
  id: '008-fix-sb79-description',
  description: 'Fix SB79 article description and publish date',
  async run(strapi: Core.Strapi) {
    const article = await strapi
      .documents('api::article.article')
      .findFirst({ filters: { slug: SLUG } });

    if (!article) return;

    const needsDesc = article.description !== CORRECT_DESCRIPTION;
    const needsDate = !String(article.publishedAt ?? '').startsWith(CORRECT_DATE);
    if (!needsDesc && !needsDate) return;

    await strapi.documents('api::article.article').update({
      documentId: article.documentId,
      data: {
        ...(needsDesc ? { description: CORRECT_DESCRIPTION } : {}),
        ...(needsDate ? { publishedAt: `${CORRECT_DATE}T00:00:00.000Z` } : {}),
      },
      status: 'published',
    });
    strapi.log.info(`[migration:008-fix-sb79-description] updated article "${SLUG}"`);
  },
};
