import type { Core } from '@strapi/strapi';

const serverConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => {
  const keys = env.array('APP_KEYS');
  if (!keys || keys.length === 0) throw new Error('Missing required env var: APP_KEYS');
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: { keys },
  };
};

export default serverConfig;
