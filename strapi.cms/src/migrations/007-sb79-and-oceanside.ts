import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { Core } from '@strapi/strapi';

const SLUG = 'sb79-and-oceanside';
const COVER_FILE = 'sb79-oceanside-transit-center.jpeg';

const IMG_BASE = 'https://substack-post-media.s3.amazonaws.com/public/images';

const blocks = [
  {
    __component: 'shared.rich-text' as const,
    body: `![Oceanside Transit Center; (Edwang2, CC BY-SA 4.0)](${IMG_BASE}/2875ba29-cc83-4424-bcc0-e7b6c9b533c1_4609x3470.jpeg)

SB 79 takes full effect statewide on July 1, 2026. The premise is straightforward: let people build multi-family homes, townhomes, and mixed-use apartments within a half-mile of high-capacity transit stations.

On June 3, the Oceanside City Council voted 4-0 (Council member Weiss was absent) to introduce an ordinance that explicitly seeks to "exempt and/or defer all sites that could potentially be exempted or deferred" and "reduce SB 79's impact to the greatest extent possible." The deferral runs until one year after the 7th Housing Element revision on June 15, 2032, which is six years from now.

It should be noted that the city says it's working on a TOD Alternative Plan, projected for late 2026 or early 2027, that could choose to unfreeze some deferred sites before 2032. But 2032 is the ordinance's stated default and nothing compels earlier action with no binding deadline. Trust is earned, and the rest of the ordinance reads as a wink and a nod to maximum temporal deferment, which is a hair's breadth away from the maximum, illegal, geographical deferments and permanent exemptions already explicitly committed to. If we're already committing millions in public funds towards a legal loss, why would we think Council wouldn't commit a few million more?

Instead of using SB 79 to address the housing crisis that residents are living through right now, city leadership is building a bureaucratic wall to preserve the status quo. They were in such a rush to do so that they posted the SB 79 hearing date before the Planning Commission had even met to give their recommendation. A procedural error like that alone can deliver the city a loss in court.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### What Oceanside is Trying to Delay

SB 79 sets state-level zoning floors near transit. If an area is zoned commercial, mixed, or residential, the state says a city can't use restrictive height limits or low-density caps to kill an eligible housing project.

City Staff and the Council are exploiting a brief legal window to carve out exclusions. The proposed rollbacks are severe.

A city presentation slide titled "Capacity Reductions" lays it out:

- The Oceanside Transit Center (OTC) goes from a default SB 79 capacity of over 25,000 potential units to zero under the city's proposed exemptions.
- At Crouch Street, max capacity drops from nearly 30,000 units to around 3,500. El Camino Real's max goes from over 15,000 to next to nothing.
- Every tracked station (Coast Highway, Rancho Del Oro, College Blvd, Melrose Dr) gets its SB 79 housing capacity gutted by these carve-outs.

Mayor Esther Sanchez acknowledged the vote was a calculated legal maneuver to extract "local control" before the July deadline. But the data shows what "local control" actually means here: making sure housing never gets built where it makes the most sense.

![Presentation from staff to City Council, maps and conditions for exemptions and referrals](${IMG_BASE}/250f7994-c74e-4df5-837a-451934f1cfe1_474x234.jpeg)

![Presentation from staff to City Council, maps and conditions for exemptions and referrals](${IMG_BASE}/cd70d2f4-1413-44c3-a110-38c5e159a887_474x250.jpeg)

*Presentation from staff to City Council, maps and conditions for exemptions and referrals. June 3, 2026.*

The city is using its own disinvestment to justify exclusion. SB 79 lets cities exempt parcels without a "walking path" under one mile to a transit stop. The intent of this provision is to give a good-faith exemption for people cut off by freeways, rivers, etc. who have a meaningful obstruction to their nearest transit stop.

Oceanside, however, defined a "walking path" to require a continuous paved sidewalk with no gaps for the entire route. All 710 parcels they analyzed scored zero. But their own sidewalk inventory shows 71% of road segments in the study area near stations have sidewalks. Staff said at the May 18 Planning Commission hearing: "There is no definition of walking path in the statute, so the city created our own definition."

![Presentation from staff to City Council, sidewalk analysis](${IMG_BASE}/bb730686-8af7-4327-b8ae-9dd2dd108a39_474x250.jpeg)

![Presentation from staff to City Council, sidewalk analysis](${IMG_BASE}/de220878-dd2b-42d2-9e1a-d270587018bb_474x234.jpeg)

![Presentation from staff to City Council, sidewalk analysis](${IMG_BASE}/f98f74cc-8a65-408e-b333-79032506caef_474x234.jpeg)

*Presentation from staff to City Council, maps and conditions for exemptions and referrals. June 3, 2026.*

The most brazen piece to this ordinance is the train miscount at OTC. The station handles 68 Sprinter, 30 Coaster, 26 Pacific Surfliner, and 6 Metrolink trains per day for a total of 130. State law classifies any station serving over 72 trains per day as Tier 1. The City of Oceanside, with Council's blessing, is trying to pretend that every train except the Sprinter doesn't exist. Add any of the other train lines to the Sprinter count and OTC clears Tier 1.

Why does the tier matter? If surrounding density is at or above 40% of the tier's target, the site may qualify for a low-resource deferral. Oceanside's zoning around OTC maxes out at 43 du/ac, which fails to exempt OTC at Tier 1 which would require 48 du/ac. But if we pretend it's Tier 2 the high end of local zoning barely ekes out the required 40 du/ac for a deferment.

So follow the city's logic: Coaster, Surfliner, and Metrolink trains are not trains. OTC becomes Tier 2. The surrounding area barely qualifies for a low-resource exemption, and the city can delay implementation until 2032.

![Presentation from staff to City Council, tier classification](${IMG_BASE}/73bffb3f-d437-495d-adc3-f11b6d0a4b4b_474x234.jpeg)

![Presentation from staff to City Council, train counts](${IMG_BASE}/5de1dd4c-64c2-40e1-ae9e-122d1e1a25ee_720x355.jpeg)

![Presentation from staff to City Council, tier analysis](${IMG_BASE}/84c65ffa-b716-444a-a2a6-2742abd9f61f_720x355.jpeg)

*Presentation from staff to City Council, maps and conditions for exemptions and referrals. June 3, 2026.*`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### A Legal Battle the City Will Lose

Oceanside's SB79 Deferral Ordinance is a waste of public funds. The Council is trying to end-run a state housing mandate, and that puts the city on a path toward litigation it will almost certainly lose.

Huntington Beach has spent over $10 million and four years fighting state housing law, is now paying $50,000 a month in AG fines with no end in sight, and a court has threatened to appoint a compliance receiver. La Cañada Flintridge burned $3.3 million fighting a single Builder's Remedy denial before dropping its appeal when the court required a $14 million bond the city couldn't post and they still had to pay CalHDF $1.26 million in plaintiff's attorney's fees.

HCD and the State Attorney General's Housing Strike Force have made the consequences clear: when cities pass ordinances designed to undermine state housing law, the state sues. And when that happens, Oceanside taxpayers foot the bill.

- Millions from the general fund get diverted from parks, road repairs, and public safety to pay attorneys defending an ordinance that won't survive court.
- California courts have struck down these attempts over and over, ordering cities to comply anyway.
- When the city loses it faces state fines and often has to pay the legal fees of the advocacy groups that brought the suit.

Spending public money on a symbolic legal fight to keep people from building housing near train stations is the opposite of fiscal responsibility. Oceanside is committing to spending money to protect empty lots on behalf of wealthy landowners.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### Why SB 79 is What Oceanside Needs

**It lowers the cost of housing.** Supply and demand doesn't stop at the city limits. By blocking multi-family housing near transit, the city inflates the price of what little exists. Citywide housing unit filings are on pace to fall from 3,197 in 2022 to 478 this year. **The number of affordable housing unit filings have dropped from 412 in 2025 to likely less than 50 by the end of this year. Downtown there were zero affordable filings in 2026** and zero market-rate filings.

![Number of housing units filed for Oceanside citywide](${IMG_BASE}/12eaa50f-f2f1-4805-87d7-d95c5e062001_2283x1545.jpeg)

![Number of housing units filed for Oceanside downtown](${IMG_BASE}/39fd0f86-ac05-4d88-80a2-ed7b4e16e7b5_2283x1546.jpeg)

*Number of housing units filed for Oceanside citywide and downtown, respectively.*

**It makes transit work.** A transit system needs riders. Sprinter stations surrounded by parking lots and single-story strip malls guarantee everyone drives. Housing next to transit, with SB 79's adjacency intensifiers allowing higher density within 200 feet of a platform, builds the ridership base that funds more frequent and reliable service.

**It builds a stronger city.** Clustering development where infrastructure already exists is basic fiscal sense. Oceanside already paid for the rail lines, water mains, and paved streets around its transit stations. Filling those areas with homes and storefronts generates tax revenue without taking on the maintenance liabilities of more sprawl.`,
  },
  {
    __component: 'shared.rich-text' as const,
    body: `### The Cost of Delays

During the same June 3 meeting, Deputy Mayor Eric Joyce acknowledged that similar delay tactics in coastal zones have already cost Oceanside "hundreds of affordable homes that we could have included."

Indeed, affordable housing filings have plummeted 9x citywide since the Coastal Commission finally certified in February the downtown density cap that Deputy Mayor Joyce and Council member Robinson voted to reintroduce. In downtown alone, the number of affordable unit filings went from a high of 201 in 2022, to 0 affordable or market-rate in 2026 so far.

Council has shown they're quite happy with this trend by voting to stack an SB79 deferral and exemption ordinance on top. When our leaders say they're fighting for local control, *this* is what that means. Hear their words, but watch closely *the outcome of their votes*.`,
  },
];

export const migration = {
  id: '007-sb79-and-oceanside',
  description: 'Seed article "SB79 And Oceanside" with cover image',
  async run(strapi: Core.Strapi) {
    // Upload cover image (non-fatal — article still gets created/refreshed without it)
    let coverId: number | undefined;
    try {
      let media = await strapi
        .query('plugin::upload.file')
        .findOne({ where: { name: COVER_FILE } });
      if (!media) {
        let filePath =
          [
            path.join(__dirname, 'assets', COVER_FILE),
            path.join(strapi.dirs.app.src, 'migrations', 'assets', COVER_FILE),
          ].find((p) => fs.existsSync(p)) ?? '';

        if (!filePath) {
          const tmpPath = path.join('/tmp', COVER_FILE);
          const res = await fetch(
            `${IMG_BASE}/2875ba29-cc83-4424-bcc0-e7b6c9b533c1_4609x3470.jpeg`
          );
          if (res.ok) {
            fs.writeFileSync(tmpPath, Buffer.from(await res.arrayBuffer()));
            filePath = tmpPath;
          }
        }

        if (filePath) {
          const stats = fs.statSync(filePath);
          const uploaded = (await strapi
            .plugin('upload')
            .service('upload')
            .upload({
              data: {
                fileInfo: {
                  name: COVER_FILE,
                  alternativeText: 'Oceanside Transit Center, photo by Edwang2 (CC BY-SA 4.0)',
                  caption: '',
                },
              },
              files: {
                path: filePath,
                name: COVER_FILE,
                type: 'image/jpeg',
                size: stats.size,
              },
            })) as Array<{ id: number }>;
          media = uploaded[0];
          strapi.log.info(`[migration:007-sb79-and-oceanside] uploaded ${COVER_FILE}`);
        }
      }
      if (media) coverId = media.id;
    } catch (err) {
      strapi.log.warn(
        `[migration:007-sb79-and-oceanside] cover upload failed: ${(err as Error).message}`
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
      strapi.log.info(`[migration:007-sb79-and-oceanside] refreshed existing article`);
      return;
    }

    const authorNames = ['Spencer Domingue-Sanford', 'Thomas LaCroix'];
    const authors: string[] = [];
    for (const name of authorNames) {
      const author = await strapi.documents('api::author.author').findFirst({ filters: { name } });
      if (!author) {
        strapi.log.warn(`[migration:007-sb79-and-oceanside] author "${name}" not found`);
        return;
      }
      authors.push(author.documentId);
    }

    await strapi.documents('api::article.article').create({
      data: {
        title: 'SB79 And Oceanside',
        description: "Oceanside's relentless effort to assert their right to block housing.",
        slug: SLUG,
        authors,
        blocks,
        ...(coverId ? { cover: coverId } : {}),
      },
      status: 'published',
    });
    strapi.log.info(`[migration:007-sb79-and-oceanside] created article "${SLUG}"`);
  },
};
