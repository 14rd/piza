import CharReveal from '../CharReveal';
import ContactForm from '../ContactForm';
import Scene from '../Scene';
import { CONTACT, ROSTER_REQUEST_HREF } from '@/lib/content';

export default function Contact() {
  return (
    <Scene label="Contact" variant="contact">
      <div className="pz-col pz-contact">
        <CharReveal as="h2" className="pz-h2 pz-contact-h2">
          Own what you build.
        </CharReveal>

        <div className="pz-inflated">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/piza-inflated.png"
            alt="PIZA inflated logomark"
            width={2000}
            height={2000}
          />
        </div>

        <div className="pz-contact-links">
          <a href={`mailto:${CONTACT.founder}`} className="pz-email">
            {CONTACT.founder}
          </a>
          <a href={`mailto:${CONTACT.inbox}`} className="pz-email pz-email--secondary">
            {CONTACT.inbox}
          </a>
          <div className="pz-contact-meta">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="pz-ig"
            >
              {CONTACT.instagramHandle} ↗
            </a>
            <a href={ROSTER_REQUEST_HREF} className="pz-ig">
              Request roster
            </a>
          </div>
        </div>

        <ContactForm />

        <div className="pz-footer">© PIZA · Representation 2.0 · Los Angeles</div>
      </div>
    </Scene>
  );
}
