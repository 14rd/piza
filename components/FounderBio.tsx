'use client';

import { useCallback, useEffect, useRef } from 'react';

type Props = {
  paragraphs: string[];
  portrait: string | null;
};

/**
 * The full biography lives in a native <dialog>. The stage is fixed and the
 * scenes crossfade, so a six-paragraph bio cannot sit inline: scale-to-fit
 * would shrink it past legibility. The overlay scrolls on its own and hands
 * focus back to the button on close.
 */
export default function FounderBio({ paragraphs, portrait }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    const d = ref.current;
    if (!d || d.open) return;
    d.showModal();
    // start at the top on every open
    d.querySelector('.pz-biodlg-scroll')?.scrollTo(0, 0);
  }, []);

  const close = useCallback(() => ref.current?.close(), []);

  // click on the backdrop (outside the panel) closes
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener('click', onClick);
    return () => d.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <button type="button" className="pz-button pz-bio-open" onClick={open}>
        Full biography
      </button>

      <dialog ref={ref} className="pz-biodlg" aria-labelledby="pz-biodlg-title">
        <div className="pz-biodlg-panel">
          <button
            type="button"
            className="pz-biodlg-close"
            onClick={close}
            aria-label="Close biography"
          >
            Close
          </button>

          <div className="pz-biodlg-scroll">
            <div className="pz-biodlg-grid">
              <aside className="pz-biodlg-side">
                {portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portrait} alt="Stephanie Piza" className="pz-biodlg-portrait" />
                ) : null}
                <span className="pz-biodlg-kicker">Founder</span>
                <h2 id="pz-biodlg-title" className="pz-biodlg-title">
                  Stephanie Piza
                </h2>
              </aside>

              <div className="pz-biodlg-text">
                {paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
