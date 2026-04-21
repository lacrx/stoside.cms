# Strapi CMS, Backend App Context

> Reference document for AWS architecture planning.

## Overview

**Strapi** is the headless CMS backend for the Strong Towns Oceanside website. It provides the content management API (REST + GraphQL) that the Gatsby frontend consumes at build time. The workspace is a **Lerna monorepo** containing both the upstream Strapi framework source and the user's production application in `my-strapi-app/`.

| Attribute                 | Value                                                   |
| ------------------------- | ------------------------------------------------------- |
| **Runtime**               | Node.js 18–22                                           |
| **Framework**             | Strapi ^5.42.0 (published npm packages)                 |
| **Database (dev)**        | SQLite (`better-sqlite3` 12.8) at `.tmp/data.db`        |
| **Database (prod-ready)** | PostgreSQL or MySQL (config supports both via env vars) |
| **Default port**          | 1337                                                    |
| **Default host**          | 0.0.0.0                                                 |
| **Admin panel**           | React 18 SPA served from the same Node process          |

## Application Location

The deployable app lives at `my-strapi-app/`. Everything else in this repo is upstream Strapi framework source. Only `my-strapi-app/` needs to be deployed.

**Production dependencies** have been rewritten from `workspace:*` to published npm versions (`^5.42.0`).

## Content Types

### Article (collection, draft & publish enabled)

| Field         | Type         | Notes                                  |
| ------------- | ------------ | -------------------------------------- |
| `title`       | String       | Required                               |
| `description` | Text         | Optional summary                       |
| `slug`        | UID          | Auto-generated from title              |
| `cover`       | Media        | Single image only                      |
| `blocks`      | Dynamic Zone | Contains `shared.rich-text` components |
| `author`      | Relation     | Many-to-one → Author                   |

### Author (collection, no draft/publish)

| Field      | Type     | Notes                                |
| ---------- | -------- | ------------------------------------ |
| `name`     | String   | Required                             |
| `articles` | Relation | One-to-many → Article (inverse side) |

### Shared Component: `shared.rich-text`

| Field  | Type      |
| ------ | --------- |
| `body` | Rich Text |

## Database Schema

```
authors
  id, document_id, name, locale, published_at,
  created_at, updated_at, created_by_id, updated_by_id

articles
  id, document_id, title, description, slug, locale, published_at,
  created_at, updated_at, created_by_id, updated_by_id

components_shared_rich_texts
  id, body

articles_components          (dynamic zone junction)
  entity_id, component_id, field, type, order

articles_author_lnk          (relation junction)
  article_id, author_id, article_ord
```

## Enabled Plugins

| Plugin                             | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| `@strapi/plugin-graphql`           | GraphQL API endpoint at `/graphql`                      |
| `@strapi/plugin-users-permissions` | Auth, roles, and public/authenticated permissions       |
| `@strapi/provider-upload-aws-s3`   | Media uploads to S3 (configured in `config/plugins.ts`) |

## API Surface

All controllers, services, and routes use **default Strapi core factories**, no custom logic.

| Method | Endpoint            | Notes                                       |
| ------ | ------------------- | ------------------------------------------- |
| GET    | `/api/articles`     | List (paginated, default limit 25, max 100) |
| GET    | `/api/articles/:id` | Single article                              |
| POST   | `/api/articles`     | Create (authenticated)                      |
| PUT    | `/api/articles/:id` | Update (authenticated)                      |
| DELETE | `/api/articles/:id` | Delete (authenticated)                      |
| GET    | `/api/authors`      | List                                        |
| GET    | `/api/authors/:id`  | Single author                               |
| POST   | `/graphql`          | GraphQL endpoint (queries + mutations)      |

REST defaults (from `config/api.ts`): `limit: 25`, `maxLimit: 100`, `withCount: true`.

## Middleware Stack

Standard Strapi defaults (from `config/middlewares.ts`):

1. `strapi::logger`
2. `strapi::errors`
3. `strapi::security`
4. `strapi::cors`
5. `strapi::poweredBy`
6. `strapi::query`
7. `strapi::body`
8. `strapi::session`
9. `strapi::favicon`
10. `strapi::public`

## Configuration & Environment Variables

### Current `.env` (development, all values are placeholders)

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
ADMIN_JWT_SECRET=example-token
API_TOKEN_SALT=example-salt
ENCRYPTION_KEY=example-key
TRANSFER_TOKEN_SALT=example-salt
JWT_SECRET=example-jwt-secret
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### Database Config (`config/database.ts`)

Supports three clients via `DATABASE_CLIENT` env var:

| Client     | Env Vars Required                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sqlite`   | `DATABASE_FILENAME`                                                                                                                                               |
| `postgres` | `DATABASE_HOST`, `DATABASE_PORT` (5432), `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_SSL` (bool), `DATABASE_SSL_CA` (optional cert path) |
| `mysql`    | Same as postgres but port default 3306                                                                                                                            |

Connection pool: `min: 2`, `max: 10` (configurable via `DATABASE_POOL_MIN` / `DATABASE_POOL_MAX`).

### Secrets Requiring Secure Storage

| Variable              | Purpose                                |
| --------------------- | -------------------------------------- |
| `APP_KEYS`            | Request signing (comma-separated list) |
| `ADMIN_JWT_SECRET`    | Admin panel JWT signing                |
| `API_TOKEN_SALT`      | API token generation                   |
| `ENCRYPTION_KEY`      | Sensitive data encryption              |
| `TRANSFER_TOKEN_SALT` | Data transfer token signing            |
| `JWT_SECRET`          | Users & Permissions plugin JWT signing |

### File Upload

Configured to use **AWS S3** via `@strapi/provider-upload-aws-s3` in `config/plugins.ts`.

| Env Var         | Purpose                       |
| --------------- | ----------------------------- |
| `AWS_REGION`    | S3 bucket region              |
| `AWS_S3_BUCKET` | Bucket name for media uploads |

On ECS Fargate, authentication uses the **task IAM role**, no access key env vars needed.

The security middleware (`config/middlewares.ts`) has been updated to allow `*.amazonaws.com` in CSP `img-src` and `media-src` directives.

### Email

No email provider configured. Available in the monorepo:

- `@strapi/provider-email-amazon-ses`
- `@strapi/provider-email-sendgrid`
- `@strapi/provider-email-mailgun`
- `@strapi/provider-email-nodemailer`

## Docker Support

### Dockerfile (my-strapi-app/Dockerfile)

Multi-stage build:

1. **deps**, production `node_modules` only
2. **build**, full install + `strapi build` (compiles admin panel)
3. **runner**, copies built assets, runs as non-root `strapi` user on port 1337

Base image: `node:22-alpine`

### .dockerignore (my-strapi-app/.dockerignore)

Excludes `node_modules`, `.tmp`, `.env`, `.git`, etc.

### docker-compose.dev.yml

- **PostgreSQL** (latest) on port 5432, volume `pgdata`
- **MySQL 8** on port 3306, volume `mysqldata`

### docker-compose.test.yml

- Same services with separate test databases (`strapi_test`)

**No Dockerfile exists**, the app runs directly in Node.js, not yet containerized.

## Domain

Target domain: **stoside.org**

- CMS: `cms.stoside.org`
- Frontend: `stoside.org` / `www.stoside.org`
- Media CDN: `media.stoside.org` (CloudFront → S3)

## Integration with Frontend

```
Gatsby frontend (build-time)
      │
      │  GraphQL query to /graphql
      ▼
Strapi (:1337)
      │
      ├── Articles (content + cover images)
      ├── Authors
      └── Rich text blocks
```

The frontend fetches all data at **build time only**, Strapi does not serve end-user traffic directly.

## AWS Architecture Considerations

### Compute

- **ECS Fargate** (recommended) or **App Runner** for containerized deployment.
- Node.js 18–22 runtime, single process serves both API and admin panel.
- **Dockerfile created** at `my-strapi-app/Dockerfile` (multi-stage, non-root, alpine).
- Health check endpoint: `/` or `/_health`.

### Database

- **RDS PostgreSQL** (recommended over MySQL for Strapi).
- Set `DATABASE_CLIENT=postgres` and provide RDS connection env vars.
- Connection pooling: min 2, max 10 aligns with Fargate task sizing.
- Enable SSL with RDS CA certificate.

### File / Media Storage

- Configure `@strapi/provider-upload-aws-s3` for media uploads (article cover images). **(Done, configured in `config/plugins.ts`)**
- **S3 bucket** for uploads + **CloudFront** distribution for serving media (`media.stoside.org`).
- ECS task IAM role grants S3 access, no access key env vars needed.

### Secrets Management

- **AWS Secrets Manager** or **SSM Parameter Store** for all secrets listed above.
- Inject into ECS task definition as environment variables or via `valueFrom`.
- 7 secrets to manage: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `ENCRYPTION_KEY`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, plus DB credentials.
- 2 config vars: `AWS_REGION`, `AWS_S3_BUCKET`.

### Networking

- **ALB** in front of ECS Fargate, targeting port 1337.
- Place in a **private subnet**; only ALB is public-facing.
- The Gatsby frontend build pipeline needs network access to Strapi's `/graphql` endpoint, either via ALB or VPC-internal service discovery.
- CORS middleware may need configuration if admin panel is accessed on a different domain.

### Build Pipeline Trigger

- When content is published in Strapi, a **webhook** should trigger a Gatsby rebuild:
  - Strapi webhook → API Gateway → Lambda → CodeBuild (or GitHub Actions dispatch).
- This ensures the static frontend reflects new/updated content.

### DNS & TLS

- **Route 53** for `cms.stoside.org`.
- **ACM** certificate on the ALB.
- Admin panel accessed at `https://cms.stoside.org/admin`.

### Scaling & Availability

- Strapi is stateful (admin sessions, file uploads), with S3 for uploads and RDS for data, it becomes stateless enough for horizontal scaling.
- **Auto Scaling** on ECS tasks (CPU/memory target tracking).
- RDS Multi-AZ for high availability.

### Cost Optimization

- Fargate Spot for non-critical environments (dev/staging).
- RDS `db.t4g.micro` sufficient for low-traffic CMS.
- S3 Intelligent-Tiering for media if volume grows.
- The CMS only needs to handle admin users + build-time fetches, very low traffic.
