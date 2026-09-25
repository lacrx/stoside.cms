import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Core } from '@strapi/strapi';

export const migration = {
  id: '015-san-clemente-cover',
  description: 'Upload poster + link as San Clemente Wealth cover',
  async run(strapi: Core.Strapi) {
    const fileName = 'san-clemente-wealth-poster-desktop.jpg';
    const filePath =
      [
        path.join(__dirname, 'assets', fileName),
        path.join(strapi.dirs.app.src, 'migrations', 'assets', fileName),
      ].find((p) => fs.existsSync(p)) ?? '';

    if (!fs.existsSync(filePath)) {
      strapi.log.warn(`[migration:015-san-clemente-cover] missing asset ${filePath}`);
      return;
    }

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
        strapi.log.info(`[migration:015-san-clemente-cover] removed stale ${fileName}`);
      }
      const uploaded = (await strapi
        .plugin('upload')
        .service('upload')
        .upload({
          data: {
            fileInfo: {
              name: fileName,
              alternativeText:
                'Value per acre map of San Clemente parcels, rendered as 3D extrusions over streets and water.',
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
      strapi.log.info(`[migration:015-san-clemente-cover] uploaded ${fileName} (${freshTag})`);
    }

    const article = await strapi.documents('api::article.article').findFirst({
      filters: { slug: 'san-clemente-wealth-is-downtown' },
      populate: ['cover'],
      status: 'published',
    });

    if (!article) {
      strapi.log.warn(`[migration:015-san-clemente-cover] article not found, run 014 first`);
      return;
    }

    const currentCoverId = (article as { cover?: { id?: number } }).cover?.id;
    if (currentCoverId === media.id) return;

    await strapi.documents('api::article.article').update({
      documentId: article.documentId,
      data: { cover: media.id },
      status: 'published',
    });
    strapi.log.info(`[migration:015-san-clemente-cover] linked cover #${media.id} to article`);
  },
};
