/**
 * Joins the last two words of an element with a non-breaking space, so the
 * final line can never be a single stranded word.
 *
 * `text-wrap: pretty` is the declarative version of this, but Safari support
 * is too recent to rely on and much of the traffic here is iPhone. A hard
 * non-breaking space behaves identically everywhere.
 *
 * Runs once per element; a StrictMode double-effect is a no-op.
 */
export function preventOrphan(el: HTMLElement) {
  if (el.dataset.pzNoOrphan === 'true') return;
  el.dataset.pzNoOrphan = 'true';

  // the last text node holding actual words is where the final line ends
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let last: Text | null = null;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if ((node.textContent ?? '').trim()) last = node as Text;
  }
  if (!last) return;

  const text = last.textContent ?? '';
  // whitespace before the final word, keeping any trailing space intact
  const match = text.match(/\s+(\S+\s*)$/);
  if (!match || match.index === undefined) return;

  last.textContent = text.slice(0, match.index) + ' ' + match[1];
}

/**
 * The character reveal turns every word into an `inline-block`, and a browser
 * will happily break between two atomic inline boxes even when the whitespace
 * between them is non-breaking. So for revealed headings the last two words
 * have to be wrapped in a `nowrap` box instead.
 *
 * Must run *after* charify, since it operates on the word boxes charify makes.
 */
export function preventOrphanCharified(el: HTMLElement) {
  if (el.dataset.pzNoOrphanWrap === 'true') return;
  el.dataset.pzNoOrphanWrap = 'true';

  const isWord = (n: Node) =>
    n.nodeType === Node.ELEMENT_NODE &&
    !!(n as HTMLElement).firstElementChild?.classList.contains('pz-ch');

  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    node.childNodes.forEach((n) => {
      if (isWord(n)) words.push(n as HTMLElement);
      else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
    });
  };
  walk(el);
  if (words.length < 2) return;

  const last = words[words.length - 1];
  const prev = words[words.length - 2];
  const parent = last.parentNode;
  // only wrap a contiguous run under one parent
  if (!parent || prev.parentNode !== parent) return;

  const run: ChildNode[] = [];
  let cur: ChildNode | null = prev;
  while (cur) {
    run.push(cur);
    if (cur === last) break;
    cur = cur.nextSibling;
  }
  if (run[run.length - 1] !== last) return;

  const wrap = document.createElement('span');
  wrap.style.whiteSpace = 'nowrap';
  parent.insertBefore(wrap, prev);
  run.forEach((n) => wrap.appendChild(n));
}

/** Text blocks that are not character-revealed. CharReveal handles its own. */
export const ORPHAN_SELECTORS = [
  '.pz-about-lede',
  '.pz-3-title',
  '.pz-3-body',
  '.pz-roster-lede',
  '.pz-bio',
  '.pz-note-title',
  '.pz-track-v',
].join(', ');
