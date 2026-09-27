/**
 * All site copy. Final per the design handoff and the client's notes of
 * September 2026 — do not rewrite. Typographic characters (em dashes, curly
 * quotes, nbsp) are intentional.
 */

export type ScopeItem = { title: string; body: string };
export type TrackItem = { k: string; v: string };
export type PressItem = { source: string; title: string; href: string };

/** Contact. The roster is shared on request, by email. */
export const CONTACT = {
  founder: 'stephanie@piza.global',
  inbox: 'inbox@piza.global',
  instagram: 'https://instagram.com/piza.global',
  instagramHandle: '@piza.global',
} as const;

export const ROSTER_REQUEST_HREF =
  `mailto:${CONTACT.founder}?subject=${encodeURIComponent('Roster request')}`;

/** About — client copy, September 2026. */
export const about = {
  headline: ['More than a management company.', 'More than an incubator.', 'More than a fund.'],
  body: [
    'PIZA is a next-gen talent venture studio and creative IP accelerator designed to help digital creators, entertainers, and storytellers build, co-own, and scale media empires across formats: content, tech, product, and brand.',
    'PIZA is led by women of color who know both the boardroom and the timeline.',
  ],
};

export const scope: ScopeItem[] = [
  {
    title: 'Equity & IP retention',
    body: 'Clients own what they build — equity participation and IP that compounds.',
  },
  {
    title: 'Creator-led incubation',
    body: 'Venture incubation and brand co-builds that turn influence into companies.',
  },
  {
    title: 'Cultural positioning',
    body: 'Long-term strategy across creative development, ventures, IP, and platforms.',
  },
];

export const values: string[] = [
  'Defiant',
  'Future-focused',
  'Culturally fluent',
  'Ownership-driven',
];

/** Founder — client bio, September 2026. First paragraph leads on the page. */
export const founderBio: string[] = [
  'Named to Variety’s “New Leaders” list in 2021, Stephanie Piza has established herself as one of the most forward-thinking executives shaping the future of the creator economy. Proudly 100% Colombiana, her career has been defined by a singular mission: to champion underrepresented voices while building scalable, future-facing businesses around talent.',
  'Piza began her career at Creative Artists Agency (CAA), where she worked across digital talent and brand partnerships at a time when the creator economy was still in its early stages. Recognizing the cultural and commercial power of digital-native talent before it became mainstream, she quickly distinguished herself as one of the first Latina dealmakers to make a meaningful impact in the digital and new media landscape. Her ability to bridge culture, commerce, and storytelling positioned her as a trusted architect behind some of the most innovative partnerships in the space.',
  'In 2019, she founded UNCMMN in partnership with Charles King and MACRO, with the intention of redefining what representation could look like for a new generation of talent. UNCMMN was built to amplify diverse voices and operate with a holistic, 360-degree approach, integrating brand partnerships, content development, and applying long-term business strategies. Under her leadership, the company became a platform for cultural storytellers and creators whose influence extended far beyond social media. Following the success of UNCMMN, Piza went on to join M88, also co-founded by Charles King, a firm rooted in the mission of representing historically excluded talent and building generational equity. As Head of Emerging and Interactive Talent, she led the division with a focus on innovation at the intersection of technology, media, and culture, continuing to push the boundaries of how talent is positioned, monetized, and scaled.',
  'Now, Piza enters her most ambitious chapter yet as the founder of PIZA, a next-generation representation company built on the belief that talent should not only participate in culture, but own it. Designed as representation 2.0, PIZA reimagines the traditional management model by prioritizing ownership, equity, and long-term value creation over transactional deal-making. The company is focused on building enduring businesses, intellectual property, and legacy platforms that extend far beyond a single moment, campaign, or platform.',
  'With over 15 years of experience, Piza has collaborated with some of the most influential voices shaping culture today, spanning creators, artists, entrepreneurs, and tastemakers who are redefining modern influence. Known for her instinct for talent, sharp deal-making, and future-focused strategy, she continues to operate at the forefront of a rapidly evolving industry.',
  'At its core, Piza’s work is driven by a deeper philosophy: that representation should be a vehicle for power, access, and long-term impact. Through PIZA, she is not only building a company, she is building a new standard for what representation can and should be in the modern era.',
];

export const track: TrackItem[] = [
  { k: 'CAA', v: 'Digital talent & brand partnerships' },
  { k: 'UNCMMN', v: 'Founded with Charles King & MACRO' },
  { k: 'M88', v: 'Head of Emerging & Interactive Talent' },
];

/** The interview, embedded at the top of Press. */
export const interview = {
  id: 'OxynGjQiUYQ',
  href: 'https://www.youtube.com/watch?v=OxynGjQiUYQ',
  source: 'SpringHill · Call My People',
  title:
    'Stephanie Piza talks talent management and the importance of creating your own path',
  poster: '/assets/interview-poster.jpg',
};

export const press: PressItem[] = [
  {
    source: 'Deadline / Feb 2026',
    title:
      'Stephanie Piza Launches Management Company Piza Focused On Digital-First Entrepreneurs',
    href: 'https://deadline.com/2026/02/stephanie-piza-launches-piza-management-company-1236728610/',
  },
  {
    source: 'Variety',
    title: 'Named to Variety’s New Leaders list',
    href: 'https://variety.com/',
  },
];

/**
 * Scroll distance per scene, in `svh` units.
 *
 * One scene used to occupy a full viewport (100), which made getting through
 * the page slow. Lower is faster; the crossfade maths is expressed in scene
 * units so it rescales automatically. ScrollStage measures the rendered spacer
 * rather than assuming this value, so the two can never drift apart.
 */
export const SCENE_STRIDE_SVH = 60;

/** Scroll spacer ids, in scene order. Index maps 1:1 to the scene index. */
export const SECTION_IDS = [
  'top',
  'manifesto',
  'essence',
  'roster',
  'founder',
  'press',
  'contact',
] as const;
