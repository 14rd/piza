import InterviewEmbed from '../InterviewEmbed';
import Scene from '../Scene';
import { interview, press } from '@/lib/content';

export default function Notes() {
  return (
    <Scene label="Press">
      <div className="pz-notes">
        <span className="pz-section-label">Press</span>
        <div className="pz-interview">
          <InterviewEmbed id={interview.id} title={interview.title} poster={interview.poster} />
          <a
            href={interview.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pz-note pz-note--interview"
          >
            <span className="pz-note-source">{interview.source}</span>
            <span className="pz-note-title">{interview.title} ↗</span>
          </a>
        </div>

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
