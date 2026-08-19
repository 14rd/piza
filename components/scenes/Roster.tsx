import Scene from '../Scene';
import { roster } from '@/lib/content';

export default function Roster() {
  return (
    <Scene label="Roster">
      <div className="pz-col pz-roster-wrap">
        <p className="pz-roster-lede">
          A curated roster of digital-first entrepreneurs — cross-disciplinary
          creators who’ve built real influence and are ready to own it.
        </p>

        <div className="pz-roster">
          {/* names repeat to fill the grid; see lib/content.ts */}
          {roster.map((r, i) => (
            <div key={`${r.name}-${i}`} className="pz-roster-tile">
              <span className="pz-roster-name">{r.name}</span>
              <span className="pz-roster-disc">{r.discipline}</span>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}
