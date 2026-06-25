import type { Core } from '@strapi/strapi';
import { runMigrations } from './migrations';

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await runMigrations(strapi);
  },
};
