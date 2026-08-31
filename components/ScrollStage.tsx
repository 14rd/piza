'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { SECTION_IDS } from '@/lib/content';

/**
 * The scroll engine.
 *
 * Scrolling never moves content down the page. Seven `100svh` spacers create
 * the scroll length; this component reads scroll position and crossfades the
 * seven absolutely-positioned scenes in place over the fixed background.
 *
 * Styles are mutated directly on the DOM nodes each frame — deliberately no
 * React state here, so scrolling causes zero re-renders.
 */
export default function ScrollStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const sections = Array.from(
      stage.querySelectorAll<HTMLElement>('section[data-screen-label]')
    );
    if (!sections.length) return;

    let fit: number[] = sections.map(() => 1);
    const revealed: boolean[] = sections.map(() => false);
    // avoid re-writing will-change every frame
    const promoted: boolean[] = sections.map(() => false);

    /**
     * Layout reads are cached here and refreshed on resize. Reading
     * scrollHeight inside the scroll handler would force a synchronous
     * layout on every event, which is a serious cost on mobile.
     */
    let stride = 1; // px of scroll per scene
    let maxScroll = 1;
    let viewportH = 1;

    /**
     * Scene index -> its nav link. The hero's anchor is the logo rather than a
     * nav item, so index 0 has no entry and nothing is marked active on it.
     */
    const navLinks = new Map<number, HTMLElement>();
    SECTION_IDS.forEach((id, i) => {
      const link = document.querySelector<HTMLElement>(`.pz-nav a[href="#${id}"]`);
      if (link) navLinks.set(i, link);
    });
    let activeIndex = -1;

    const setActive = (i: number) => {
      if (i === activeIndex) return; // only touch the DOM when it changes
      const prev = navLinks.get(activeIndex);
      if (prev) {
        prev.classList.remove('is-active');
        prev.removeAttribute('aria-current');
      }
      const next = navLinks.get(i);
      if (next) {
        next.classList.add('is-active');
        next.setAttribute('aria-current', 'true');
      }
      activeIndex = i;
    };

    /**
     * Scenes taller than the viewport shrink so nothing clips. offsetHeight
     * ignores the scale transform, so measuring stays stable across frames.
     */
    const measure = () => {
      const vh = Math.max(1, window.innerHeight);
      viewportH = vh;

      /**
       * Take the stride from a rendered spacer rather than from innerHeight.
       * Spacers are sized in `svh`, which on mobile is the height with browser
       * chrome showing, while innerHeight grows as the URL bar retracts. Using
       * innerHeight would drift the scenes out of step with their anchors
       * mid-scroll.
       */
      const spacer = document.querySelector<HTMLElement>('.pz-spacer');
      stride = Math.max(1, spacer?.getBoundingClientRect().height ?? vh);

      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      fit = sections.map((s, i) => {
        if (i === 0) return 1; // hero is intrinsically fluid
        let ch = 0;
        Array.from(s.children).forEach((c) => {
          ch += (c as HTMLElement).offsetHeight;
        });
        const total = ch + 170; // section vertical padding + header clearance
        return total > vh ? Math.max(0.4, (vh - 96) / total) : 1;
      });
    };

    /** Reads no layout — every value it needs was cached by measure(). */
    const update = () => {
      const yy = window.scrollY || document.documentElement.scrollTop || 0;

      const p = Math.min(1, yy / maxScroll);
      if (progressRef.current) {
        progressRef.current.style.width = `${(p * 100).toFixed(2)}%`;
      }

      /**
       * Clamped so rubber-band overscroll, or a viewport taller than the
       * tail pad allows for, can never fade the first or last scene out.
       */
      const pos = Math.min(sections.length - 1, Math.max(0, yy / stride));

      // the nearest scene is also the most opaque one
      setActive(Math.round(pos));

      sections.forEach((s, i) => {
        const d = pos - i;
        const a = Math.max(0, 1 - Math.abs(d) * 1.6);
        const o = a * a * (3 - 2 * a); // smoothstep
        const k = fit[i] ?? 1;
        const onStage = o >= 0.01;

        s.style.opacity = o.toFixed(3);
        s.style.visibility = onStage ? 'visible' : 'hidden';
        s.style.pointerEvents = o > 0.45 ? 'auto' : 'none';
        s.style.transform =
          `translate3d(0,${(-d * 42 + (1 - k) * 60).toFixed(1)}px,0) scale(${k.toFixed(3)})`;

        /**
         * Only scenes actually on stage get a compositor layer. Promoting all
         * seven full-viewport scenes at once costs a lot of GPU memory on
         * phones; in practice at most two are visible.
         */
        if (onStage !== promoted[i]) {
          promoted[i] = onStage;
          s.style.willChange = onStage ? 'opacity, transform' : 'auto';
        }

        // character reveals replay each time a scene takes the stage
        if (o > 0.55 && !revealed[i]) {
          revealed[i] = true;
          s.classList.add('pz-on');
        } else if (o < 0.06 && revealed[i]) {
          revealed[i] = false;
          s.classList.remove('pz-on');
        }
      });
    };

    /**
     * Scroll events can outpace the display, especially on high-refresh
     * phones. Coalesce them so the DOM is touched at most once per frame.
     */
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // re-measure once fonts and images have settled
    const t1 = window.setTimeout(onResize, 700);
    const t2 = window.setTimeout(onResize, 2200);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // in-page anchors smooth-scroll to their spacer
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + (window.scrollY || 0);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <div className="pz-progress" aria-hidden="true">
        <div ref={progressRef} className="pz-progress-fill" />
      </div>
      <div ref={stageRef} className="pz-stage">
        <div className="pz-scrim" />
        {children}
      </div>
    </>
  );
}
