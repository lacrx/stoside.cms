'use strict';

const crypto = require('crypto');

function generateDocumentId() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const bytes = crypto.randomBytes(24);
  let id = '';
  for (let i = 0; i < 24; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return id;
}

const DATA_PAGES = [
  {
    title: 'Permitted Units',
    slug: 'permitted-units',
    dashboard_type: 'permitted-units',
    description: 'Housing units approved by census tract, with RHNA pace tracking',
    sort_order: 1,
    data_updated_at: '2026-10-01',
  },
  {
    title: 'Affordable Units',
    slug: 'affordable-units',
    dashboard_type: 'affordable-units',
    description: 'Deed-restricted and market-rate units by income tier and census tract',
    sort_order: 2,
    data_updated_at: '2026-10-01',
  },
  {
    title: 'Affordability Map',
    slug: 'affordability-map',
    dashboard_type: 'affordability-map',
    description: 'Rent burden, home prices, and income ratios by census tract',
    sort_order: 3,
    data_updated_at: '2026-10-01',
  },
];

async function up(knex) {
  const now = Date.now();

  for (const page of DATA_PAGES) {
    const documentId = generateDocumentId();

    const row = {
      document_id: documentId,
      title: page.title,
      slug: page.slug,
      dashboard_type: page.dashboard_type,
      description: page.description,
      sort_order: page.sort_order,
      data_updated_at: page.data_updated_at,
      created_at: now,
      updated_at: now,
      locale: null,
    };

    // Draft row
    await knex('data_pages').insert({ ...row, published_at: null });

    // Published row
    await knex('data_pages').insert({ ...row, published_at: now });
  }
}

async function down(knex) {
  await knex('data_pages')
    .whereIn('slug', ['permitted-units', 'affordable-units', 'affordability-map'])
    .del();
}

module.exports = { up, down };
