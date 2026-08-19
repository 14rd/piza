import Scene from '../Scene';
import { press } from '@/lib/content';

export default function Notes() {
  return (
    <Scene label="Press and notes">
      <div className="pz-notes">
        {press.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pz-note"
          >
            <span className="pz-note-source">{p.source}</span>
            <span className="pz-note-title">{p.title} ↗</span>
          </a>
        ))}
      </div>
    </Scene>
  );
}
