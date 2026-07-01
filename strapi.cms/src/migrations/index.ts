import type { Core } from '@strapi/strapi';
import { migration as m001 } from './001-public-permissions';
import { migration as m002 } from './002-site-setting';
import { migration as m003 } from './003-author-thomas-lacroix';
import { migration as m004 } from './004-our-wealth-is-downtown';
import { migration as m005 } from './005-article-cover';
import { migration as m006 } from './006-authors';
import { migration as m007 } from './007-sb79-and-oceanside';
import { migration as m008 } from './008-fix-sb79-description';
import { migration as m009 } from './009-fix-article-titles-dates';
import { migration as m010 } from './010-downtown-isnt-perfect';

// Add new migrations in chronological order. Each migration is a
// check-then-mutate step against Strapi's Document Service API. Running
// them on every boot is safe (idempotent) because presence is always
// checked before any write.
//
// Convention:
//   src/migrations/NNN-slug.ts exports { migration: { id, description, run } }
//   id matches filename, description is one sentence, run takes strapi.
//
// Prefer this pattern over raw knex migrations under database/migrations/:
// content migrations need entity-service access to hit dynamic-zone joins,
// permissions, uploads, etc., which raw SQL can't express safely.
const migrations = [m001, m002, m003, m004, m005, m006, m007, m008, m009, m010];

export async function runMigrations(strapi: Core.Strapi) {
  for (const migration of migrations) {
    try {
      await migration.run(strapi);
    } catch (err) {
      strapi.log.warn(`[migration:${migration.id}] failed: ${(err as Error).message}`);
    }
  }
}

export { migrations };
