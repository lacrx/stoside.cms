import type { Core } from '@strapi/strapi';

const SLUG = 'el-camino-mission-douglas';

const RENAMES: Record<string, string> = {
  '1: Mission btwn El Camino and Douglas': '1: Mission between El Camino and Douglas',
  '2: El Camino btwn Mission and MHP': '2: El Camino between Mission and MHP',
};

export const migration = {
  id: '013-fix-segment-names',
  description: 'Expand "btwn" to "between" in walk audit segment names',
  async run(strapi: Core.Strapi) {
    const audit = await strapi.db
      .query('api::walk-audit.walk-audit')
      .findOne({ where: { slug: SLUG }, populate: ['segments'] });

    if (!audit) return;

    let changed = false;
    const segments = (audit.segments || []).map((seg: { id: number; name: string }) => {
      const newName = RENAMES[seg.name];
      if (newName) {
        changed = true;
        return { ...seg, name: newName };
      }
      return seg;
    });

    if (!changed) {
      strapi.log.info(`[migration:013-fix-segment-names] segments already updated`);
      return;
    }

    await strapi.documents('api::walk-audit.walk-audit').update({
      documentId: audit.documentId,
      data: { segments },
      status: 'published',
    });
    strapi.log.info(`[migration:013-fix-segment-names] renamed "btwn" to "between" in ${SLUG}`);
  },
};
