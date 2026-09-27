import { existsSync } from 'node:fs';
import path from 'node:path';
import CharReveal from '../CharReveal';
import FounderBio from '../FounderBio';
import Scene from '../Scene';
import { founderBio, track } from '@/lib/content';

/**
 * Drop the client's photo at `public/assets/stephanie-piza.jpg` (4:5 works
 * best) and rebuild. This is a server component, so the check runs once at
 * build time; until the file exists the slot renders a placeholder.
 */
export const PORTRAIT_SRC = '/assets/stephanie-piza.jpg';
const hasPortrait = existsSync(path.join(process.cwd(), 'public', PORTRAIT_SRC));

export default function Founder() {
  const [lead] = founderBio;

  return (
    <Scene label="Founder">
      <div className="pz-col pz-founder">
        <div className="pz-portrait">
          {hasPortrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={PORTRAIT_SRC} alt="Stephanie Piza" className="pz-portrait-img" />
          ) : (
            <>
              <div className="pz-portrait-fill" />
              <span className="pz-portrait-label">
                Portrait
                <br />
                <span style={{ opacity: 0.55 }}>awaiting</span>
              </span>
            </>
          )}
        </div>

        <CharReveal as="h2" className="pz-h2 pz-founder-name">
          Stephanie Piza
        </CharReveal>

        <p className="pz-bio">{lead}</p>

        <FounderBio paragraphs={founderBio} portrait={hasPortrait ? PORTRAIT_SRC : null} />

        <div className="pz-track">
          {track.map((t) => (
            <div key={t.k} className="pz-track-item">
              <div className="pz-track-k">{t.k}</div>
              <div className="pz-track-v">{t.v}</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}
