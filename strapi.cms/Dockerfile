FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ------- dependencies -------
FROM base AS deps

COPY package.json package-lock.json* yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
  elif [ -f package-lock.json ]; then npm ci --omit=dev; \
  else npm install --omit=dev; fi

# ------- build -------
FROM base AS build

COPY package.json package-lock.json* yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; fi

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=1536
RUN npm run build

# ------- production -------
FROM base AS runner

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=768

RUN addgroup --system --gid 1001 strapi && \
    adduser  --system --uid 1001 strapi

WORKDIR /app

COPY --from=deps  --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=build --chown=strapi:strapi /app/dist         ./dist
COPY --from=build --chown=strapi:strapi /app/public        ./public
COPY --from=build --chown=strapi:strapi /app/src/migrations/assets ./dist/src/migrations/assets
COPY --chown=strapi:strapi package.json ./
RUN echo '{"compilerOptions":{"outDir":"dist"},"include":["_placeholder.ts"]}' > tsconfig.json && \
    echo 'export {}' > _placeholder.ts && \
    chown strapi:strapi tsconfig.json _placeholder.ts

# .tmp holds SQLite DB (mount as Docker volume for persistence)
RUN mkdir -p .tmp public/uploads database/migrations && chown -R strapi:strapi .tmp public/uploads database

VOLUME /app/.tmp

USER strapi

EXPOSE 1337

CMD ["npm", "run", "start"]
