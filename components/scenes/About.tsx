import CharReveal from '../CharReveal';
import Scene from '../Scene';
import { scope, values } from '@/lib/content';

export default function About() {
  return (
    <Scene label="About">
      <div className="pz-col pz-about">
        <CharReveal as="h2" className="pz-h2">
          PIZA exists to shift power.
        </CharReveal>

        <p className="pz-about-lede">
          Culture has always been built by underrepresented creators, yet ownership
          has remained elsewhere. PIZA closes the gap between influence and equity —
          infrastructure designed for creators to lead, build, and own.
        </p>

        <div className="pz-3">
          {scope.map((row) => (
            <div key={row.title} className="pz-3-item">
              <h3 className="pz-3-title">{row.title}</h3>
              <p className="pz-3-body">{row.body}</p>
            </div>
          ))}
        </div>

        <div className="pz-pills">
          {values.map((v) => (
            <span key={v} className="pz-pill">
              {v}
            </span>
          ))}
        </div>
      </div>
    </Scene>
  );
}
