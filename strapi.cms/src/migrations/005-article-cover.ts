import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Core } from '@strapi/strapi';

// Upload the desktop poster JPG as a Strapi media file and link it to
// the Our-Wealth-is-Downtown article as its cover. Idempotent on file
// name (reuses the existing upload if present) and on cover link (skips
// the update when the article already points at this file).
//
// The frontend still carries the same poster as a fallback import for
// cases where the Strapi cover isn't available, but when Strapi serves
// the article, this cover is the authoritative one.
export const migration = {
  id: '005-article-cover',
  description: 'Upload poster + link as Our-Wealth-is-Downtown cover',
  async run(strapi: Core.Strapi) {
    const fileName = 'oceanside-wealth-poster-desktop.jpg';
    // Resolve against strapi.dirs.app.src so we always read from the
    // source tree, not the compiled dist directory where assets don't
    // get copied by default.
    const filePath = path.join(strapi.dirs.app.src, 'migrations', 'assets', fileName);

    if (!fs.existsSync(filePath)) {
      strapi.log.warn(`[migration:005-article-cover] missing asset ${filePath}`);
      return;
    }

    // 1. Reuse or (re)upload. We re-upload when the file content has
    //    changed vs what Strapi already has, detected via a SHA-256 of
    //    the first 16 KB stored in the media's caption field. This lets
    //    frontend-side poster regenerations propagate to the Strapi-
    //    managed cover without needing a new filename per version.
    const stats = fs.statSync(filePath);
    const diskSizeKb = Math.round(stats.size / 1024);
    const headBuf = fs.readFileSync(filePath).subarray(0, 16 * 1024);
    const diskHash = crypto.createHash('sha256').update(headBuf).digest('hex').slice(0, 16);
    const freshTag = `h:${diskHash}`;

    let media = await strapi.query('plugin::upload.file').findOne({ where: { name: fileName } });
    const storedTag = media?.caption ?? null;

    if (media && storedTag === freshTag && media.size === diskSizeKb) {
      // No drift; reuse existing media.
    } else {
      if (media) {
        await strapi.plugin('upload').service('upload').remove(media);
        strapi.log.info(`[migration:005-article-cover] removed stale ${fileName}`);
      }
      const uploaded = (await strapi
        .plugin('upload')
        .service('upload')
        .upload({
          data: {
            fileInfo: {
              name: fileName,
              alternativeText:
                'Value per acre map of Oceanside parcels, rendered as 3D extrusions over streets and water.',
              // Stash the content hash in caption so the next migration
              // run can cheaply detect drift. Not user-facing.
              caption: freshTag,
            },
          },
          files: {
            path: filePath,
            name: fileName,
            type: 'image/jpeg',
            size: stats.size,
          },
        })) as Array<{ id: number }>;
      media = uploaded[0];
      strapi.log.info(`[migration:005-article-cover] uploaded ${fileName} (${freshTag})`);
    }

    // 2. Link to the article.
    const article = await strapi.documents('api::article.article').findFirst({
      filters: { slug: 'our-wealth-is-downtown' },
      populate: ['cover'],
      status: 'published',
    });

    if (!article) {
      strapi.log.warn(`[migration:005-article-cover] article not found, run 004 first`);
      return;
    }

    const currentCoverId = (article as { cover?: { id?: number } }).cover?.id;
    if (currentCoverId === media.id) return;

    await strapi.documents('api::article.article').update({
      documentId: article.documentId,
      data: { cover: media.id },
      status: 'published',
    });
    strapi.log.info(`[migration:005-article-cover] linked cover #${media.id} to article`);
  },
};
