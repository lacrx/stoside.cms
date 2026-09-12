import type { Core } from '@strapi/strapi';

function requireEnv(env: Core.Config.Shared.ConfigParams['env'], key: string): string {
  const val = env(key);
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

const adminConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: requireEnv(env, 'ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: requireEnv(env, 'API_TOKEN_SALT'),
  },
  secrets: {
    encryptionKey: requireEnv(env, 'ENCRYPTION_KEY'),
  },
  transfer: {
    token: {
      salt: requireEnv(env, 'TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

export default adminConfig;
