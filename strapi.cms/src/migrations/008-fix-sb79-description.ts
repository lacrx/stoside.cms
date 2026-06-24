import type { Core } from '@strapi/strapi';

const SLUG = 'sb79-and-oceanside';
const CORRECT_DESCRIPTION = "Oceanside's relentless fight for their right to block housing.";

export const migration = {
  id: '008-fix-sb79-description',
  description: 'Fix SB79 article description wording',
  async run(strapi: Core.Strapi) {
    const article = await strapi
      .documents('api::article.article')
      .findFirst({ filters: { slug: SLUG } });

    if (!article) return;
    if (article.description === CORRECT_DESCRIPTION) return;

    await strapi.documents('api::article.article').update({
      documentId: article.documentId,
      data: { description: CORRECT_DESCRIPTION },
      status: 'published',
    });
    strapi.log.info(`[migration:008-fix-sb79-description] updated description for "${SLUG}"`);
  },
};
