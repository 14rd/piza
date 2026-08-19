import CharReveal from '../CharReveal';
import Scene from '../Scene';
import { track } from '@/lib/content';

export default function Founder() {
  return (
    <Scene label="Founder">
      <div className="pz-col pz-founder">
        {/* real portrait of Stephanie Piza pending from client */}
        <div className="pz-portrait">
          <div className="pz-portrait-fill" />
          <span className="pz-portrait-label">
            Portrait
            <br />
            <span style={{ opacity: 0.55 }}>awaiting</span>
          </span>
        </div>

        <CharReveal as="h2" className="pz-h2 pz-founder-name">
          Stephanie Piza
        </CharReveal>

        <p className="pz-bio">
          Stephanie Piza founded PIZA after exiting M88, where she served as Head of
          Emerging &amp; Interactive Talent. She began her career in the digital
          talent and brand-partnerships divisions at CAA, then co-founded UNCMMN,
          one of the first female-founded management firms centered on culturally
          influential digital voices, alongside Charles D.{' '}King and Macro,
          before it was acquired and folded into M88. Named to Variety’s “New
          Leaders” list.
        </p>

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
