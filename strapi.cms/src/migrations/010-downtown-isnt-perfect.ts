import type { Core } from '@strapi/strapi';

const SLUG = 'downtown-isnt-perfect';
const COVER_FILE = 'downtown-isnt-perfect-cover.jpeg';
const COVER_URL =
  'https://substackcdn.com/image/fetch/w_2100,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F99c47e3f-4507-404e-9685-5e80fc172d34_700x466.jpeg';

const IMG_CDN =
  'https://substackcdn.com/image/fetch/w_600,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F';

const blocks = [
  {
    __component: 'shared.rich-text' as const,
    body: `As we all know, summertime is the best time of the year, and there's no better place to enjoy summer than in Oceanside, especially our Downtown and Townsite area. In a walk audit conducted in January 2026, we identified numerous areas of improvement the City of Oceanside can take to improve pedestrian safety and economic opportunity.

Currently, our downtown is hindered by "stroad" infrastructure, streets attempting to function as both high-speed arterials and local destination roads, resulting in a compromised experience for all users.

To build a truly resilient urban core, we must prioritize the safety and mobility of the human individual over the high-speed throughput of the motor vehicle. Transitioning away from a car-dependent downtown is not merely an aesthetic preference; it is a financial necessity. Municipalities that prioritize walkability see a significant increase in property values and local tax revenue per acre.

Here is a blueprint for reclaiming the public right-of-way for the citizens of Oceanside.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### The Economic Imperative of Walkability

Replacing surface parking lots with high-density, mixed-use environments and activated public parks generates a more sustainable revenue stream through ground leases and increased economic activity.

- Households in walkable neighborhoods spend approximately 16% less on transportation than suburban counterparts, increasing the discretionary income available for local businesses.
- Regional transportation improvements, such as those proposed for the Oceanside Transit Center (OTC), are projected to contribute an average of $13.4 billion in Gross Regional Product (GRP) to the San Diego economy annually until 2050.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### Activating Public Space with SB 969

California Senate Bill 969 (effective January 1st, 2025) provides an unprecedented opportunity to redefine our downtown sidewalks and plazas through the creation of "Entertainment Zones".

- These designated social districts allow patrons to consume alcoholic beverages in public rights-of-way during specified hours and events.
- The primary site identified for Oceanside's first zone is the Tremont Street corridor between Pier View Way and Mission Avenue, home to a burgeoning culinary scene including Craft Coast and Odie's.
- An immediate "quick build" intervention can convert the loading zone at Odie's and Craft Coast into permanent outdoor social seating, using paint, planters, and bollards to reclaim asphalt for human use.

![Area outside of Odie's Pizza identified as prime seating potential](${IMG_CDN}23d98274-c992-45f8-9c93-c4876e696b75_2048x1536.jpeg)

*Area outside of Odie's Pizza identified as prime seating potential.*`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### Rethinking the Oceanside Transit Center (OTC)

The OTC Redevelopment Project is the cornerstone of the city's densification strategy, transforming 10.5 acres of underutilized surface parking into 547 residential units, a 170-room boutique hotel, and a new North County Transit District (NCTD) headquarters. Relocating the NCTD headquarters from 810 Mission Avenue will also free up a prime downtown site for future mixed-income housing.

- **Lot 27 Linear Park:** Pay Lot 27, a current "dead zone" of asphalt west of the transit center, must be transformed into a linear park. This park would serve as an environmental buffer against train emissions, manage stormwater runoff, and provide a high-quality, shaded active-transportation link.

![Rendering of Lot 27 as a linear park](${IMG_CDN}b8badaf3-23f3-4bc5-b321-52aa60ac9b6d_1024x283.png)

*Rendering of Lot 27 as a linear park.*

- **Rail Safety and Connections:** The circuitous routes from the Metrolink and Amtrak platforms to Mission Avenue must be replaced with direct, widened pathways. Furthermore, automatic pedestrian gates are critically needed at the Mission Avenue rail grade crossing to provide a physical barrier and prevent fatal "near-miss" incidents.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### Safer Intersections and Traffic Calming

The standard three-phase cycle of our downtown intersections leads to dangerous conflicts between turning vehicles and pedestrians.

- **Pedestrian Scrambles:** We recommend implementing "pedestrian scrambles" (Barnes Dance junctions) at Mission & Cleveland and Mission & North Myers. This design stops all vehicular traffic, allowing pedestrians to cross diagonally and eliminating the risk of turning vehicles.
- **Fixing Mission & PCH:** The intersection of Mission Avenue and Pacific Coast Highway (PCH) is a primary hazard zone due to long crossing distances and high vehicle speeds. This intersection requires a pedestrian scramble phase and the construction of a raised intersection to ensure safety for all modes of transit.
- **PCH Road Diet:** PCH currently acts as a high-speed arterial and a barrier between inland neighborhoods and the coast. A "Road Diet" is recommended to reduce travel lanes and reallocate space for a center median, bike lanes, and wider sidewalks, which will naturally slow traffic.
- **Wisconsin Ave & Coastal Rail Trail:** A Rectangular Rapid Flashing Beacon (RRFB) and a raised crosswalk are essential at this high-volume intersection to provide high-visibility warnings to motorists.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### Securing The Strand and Pacific Street

The Strand and North Pacific Street represent our most highly-trafficked coastal corridors, but they require physical design changes to enforce safety.

- **Automatic Bollards:** To secure The Strand as a true pedestrian-priority, car-free zone, we must install automatic retractable bollards. These crash-rated systems provide a physical barrier against vehicle intrusion while allowing sensors to lower them for emergency and service access.
- **Lane Narrowing:** The vehicle travel lane on The Strand should be narrowed from 10 feet to 9 feet to discourage high speeds, allowing space for a wider pedestrian lane and a "Class-IV" protected, directional bikeway.
- **Curb Extensions:** The excessively wide 20-foot travel lane on North Pacific Street should be narrowed using "quick build" bulb-outs and curb extensions to shorten crossing distances to the beach.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `The transformation of downtown Oceanside into a "Strong Town" requires a departure from the status quo of car-centric planning. By prioritizing the human experience, leveraging legislative tools like SB 969, and committing to high-quality public infrastructure, the city can build a resilient urban core that serves as a model for coastal communities nationwide.

Find a link to our full walk audit report [here](https://docs.google.com/document/d/1IhWRGhQxhywvfA_TTrRN-81OF_sa5pW1Eppni6je_5E/edit?usp=sharing).`,
  },
];

export const migration = {
  id: '010-downtown-isnt-perfect',
  description: 'Seed article "Downtown Isn\'t Perfect"',
  async run(strapi: Core.Strapi) {
    let coverId: number | undefined;
    try {
      let media = await strapi
        .query('plugin::upload.file')
        .findOne({ where: { name: COVER_FILE } });
      if (!media) {
        media = await strapi.query('plugin::upload.file').create({
          data: {
            name: COVER_FILE,
            alternativeText: 'Oceanside Scavenger Hunt: Downtown Oside Odyssey, 2020',
            url: COVER_URL,
            mime: 'image/jpeg',
            ext: '.jpeg',
            size: 120,
            width: 700,
            height: 466,
            provider: 'external',
          },
        });
        strapi.log.info(`[migration:010-downtown-isnt-perfect] registered cover ${COVER_FILE}`);
      }
      if (media) coverId = media.id;
    } catch (err) {
      strapi.log.warn(
        `[migration:010-downtown-isnt-perfect] cover failed: ${(err as Error).message}`
      );
    }

    const existing = await strapi
      .documents('api::article.article')
      .findFirst({ filters: { slug: SLUG }, populate: ['cover'], status: 'published' });

    if (existing) {
      await strapi.documents('api::article.article').update({
        documentId: existing.documentId,
        data: {
          blocks,
          ...(coverId ? { cover: coverId } : {}),
        },
        status: 'published',
      });
      await strapi.db.query('api::article.article').updateMany({
        where: { slug: SLUG },
        data: { publishedAt: '2026-06-30T12:00:00.000Z' },
      });
      strapi.log.info(`[migration:010-downtown-isnt-perfect] refreshed existing article`);
      return;
    }

    const author = await strapi
      .documents('api::author.author')
      .findFirst({ filters: { name: 'Spencer Domingue-Sanford' } });
    if (!author) {
      strapi.log.warn(`[migration:010-downtown-isnt-perfect] author not found`);
      return;
    }

    await strapi.documents('api::article.article').create({
      data: {
        title: "Downtown Isn't Perfect",
        description: 'Steps for a walkable, resilient downtown.',
        slug: SLUG,
        authors: [author.documentId],
        blocks,
        ...(coverId ? { cover: coverId } : {}),
      },
      status: 'published',
    });
    strapi.log.info(`[migration:010-downtown-isnt-perfect] created article "${SLUG}"`);

    // Document service overrides publishedAt with NOW() on publish,
    // so set it via the query engine which writes directly.
    await strapi.db.query('api::article.article').updateMany({
      where: { slug: SLUG },
      data: { publishedAt: '2026-06-30T12:00:00.000Z' },
    });
  },
};
