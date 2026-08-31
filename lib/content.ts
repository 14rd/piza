/**
 * All site copy. Final per the design handoff — do not rewrite.
 * Typographic characters (em dashes, curly quotes, nbsp) are intentional.
 */

export type ScopeItem = { title: string; body: string };
export type RosterItem = { name: string; discipline: string };
export type TrackItem = { k: string; v: string };
export type PressItem = { source: string; title: string; href: string };

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

/**
 * Two confirmed clients, repeated to fill the 3x2 grid as specified in the
 * handoff ("Data (x3 alternating)"). Replace with the full roster when the
 * client delivers it; portraits are also pending.
 */
export const roster: RosterItem[] = [
  { name: 'Vic Mensa', discipline: 'Music Artist' },
  { name: 'Edgar Esteves', discipline: 'Entrepreneur & Director' },
  { name: 'Vic Mensa', discipline: 'Music Artist' },
  { name: 'Edgar Esteves', discipline: 'Entrepreneur & Director' },
  { name: 'Vic Mensa', discipline: 'Music Artist' },
  { name: 'Edgar Esteves', discipline: 'Entrepreneur & Director' },
];

export const track: TrackItem[] = [
  { k: 'CAA', v: 'Digital talent & brand partnerships' },
  { k: 'UNCMMN', v: 'Co-founded with Macro' },
  { k: 'M88', v: 'Head of Emerging & Interactive' },
];

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
  'notes',
  'contact',
] as const;
