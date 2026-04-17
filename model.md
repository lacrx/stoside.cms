# Data Model

## Strapi Data Model

### Collection Type: Article

| Field         | Type                 | Notes                                             |
| ------------- | -------------------- | ------------------------------------------------- |
| `title`       | Text (string)        | Required                                          |
| `description` | Text (string)        | Short summary                                     |
| `slug`        | UID (string)         | URL-friendly identifier, likely linked to `title` |
| `cover`       | Media (single image) | Upload file relation                              |
| `blocks`      | Dynamic Zone         | Contains components (see below)                   |
| `author`      | Relation → Author    | Many-to-One                                       |
| `publishedAt` | DateTime             | Built-in Strapi publication field                 |

### Collection Type: Author

| Field  | Type          | Notes               |
| ------ | ------------- | ------------------- |
| `name` | Text (string) | Author display name |

### Component: shared.rich-text (ComponentSharedRichText)

| Field  | Type                        | Notes                                             |
| ------ | --------------------------- | ------------------------------------------------- |
| `body` | Rich Text (string/markdown) | Parsed with `marked` and sanitized with DOMPurify |

Used inside the `blocks` Dynamic Zone on Article.

## Non-Strapi Data Sources

### GeoJSON (analysis.geojson)

Static file in `src/assets/data/`. Each feature has a `vpa` (value-per-acre) property used for map visualization.

### Meetup Events

Queried from the Meetup Pro GraphQL API (not Strapi) for the group `strong-towns-oceanside`. Integration was still in-progress.

| Field              | Type     |
| ------------------ | -------- |
| `title`            | String   |
| `eventUrl`         | String   |
| `description`      | String   |
| `howToFindUs`      | String   |
| `venue.name`       | String   |
| `venue.address`    | String   |
| `venue.city`       | String   |
| `venue.state`      | String   |
| `venue.postalCode` | String   |
| `images[].baseUrl` | String   |
| `images[].source`  | String   |
| `dateTime`         | DateTime |
| `duration`         | Duration |

## Strapi GraphQL Endpoint

`http://localhost:1337/graphql`
