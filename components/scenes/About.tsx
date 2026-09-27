import CharReveal from '../CharReveal';
import Scene from '../Scene';
import { about, scope, values } from '@/lib/content';

export default function About() {
  return (
    <Scene label="About">
      <div className="pz-col pz-about">
        <CharReveal as="h2" className="pz-h2 pz-about-h2">
          {about.headline.map((line, i) => (
            <span key={line} className={i === about.headline.length - 1 ? undefined : 'pz-line'}>
              {line}
            </span>
          ))}
        </CharReveal>

        <div className="pz-about-lede">
          {about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

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
