'use client';

import { createElement, useEffect, useRef, type ReactNode } from 'react';

/**
 * Splits an element's text nodes into per-character spans so they can be
 * revealed on a stagger. Words are kept in nowrap wrappers so line breaking
 * still happens between words, never mid-word.
 *
 * Runs once per element; guarded so a StrictMode double-effect is a no-op.
 */
export function charify(el: HTMLElement, stagger = true) {
  if (el.dataset.pzCharified === 'true') return;
  el.dataset.pzCharified = 'true';

  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (n.textContent ?? '').split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const word = document.createElement('span');
          word.style.display = 'inline-block';
          word.style.whiteSpace = 'nowrap';
          for (const chr of part) {
            const c = document.createElement('span');
            c.className = 'pz-ch';
            if (stagger) c.style.transitionDelay = `${(Math.random() * 0.75).toFixed(2)}s`;
            c.textContent = chr;
            word.appendChild(c);
          }
          frag.appendChild(word);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        walk(n);
      }
    });
  };

  walk(el);
}

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote';

type Props = {
  /** Element to render. Defaults to a span. */
  as?: Tag;
  className?: string;
  children: ReactNode;
};

/**
 * Wraps display type in a character-level reveal. The parent scene toggles
 * `.pz-on` as it takes the stage, which plays the reveal.
 */
export default function CharReveal({ as = 'span', className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stagger = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    charify(el, stagger);
  }, []);

  return createElement(as, { ref, className, 'data-chars': '' }, children);
}
