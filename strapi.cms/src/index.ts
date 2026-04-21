import { runMigrations } from './migrations';

export default {
  register() {},
  async bootstrap({ strapi }) {
    await runMigrations(strapi);
  },
};
