import CharReveal from '../CharReveal';
import Scene from '../Scene';
import { CONTACT, ROSTER_REQUEST_HREF } from '@/lib/content';

/**
 * The roster is not published. It is shared on request, by email, per the
 * client's notes of September 2026.
 */
export default function Roster() {
  return (
    <Scene label="Roster">
      <div className="pz-col pz-roster-wrap">
        <CharReveal as="h2" className="pz-h2 pz-roster-h2">
          A roster shared on request.
        </CharReveal>

        <p className="pz-roster-lede">
          PIZA represents a curated roster of digital-first entrepreneurs — cross-disciplinary
          creators who’ve built real influence and are ready to own it. Details are shared
          privately with partners and collaborators.
        </p>

        <a href={ROSTER_REQUEST_HREF} className="pz-button">
          Request roster
        </a>
        <span className="pz-roster-note">
          Opens an email to {CONTACT.founder}
        </span>
      </div>
    </Scene>
  );
}
