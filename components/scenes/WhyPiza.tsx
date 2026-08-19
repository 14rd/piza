import CharReveal from '../CharReveal';
import Scene from '../Scene';

export default function WhyPiza() {
  return (
    <Scene label="Why PIZA">
      <CharReveal as="blockquote" className="pz-quote">
        Creators are media companies with built-in distribution.{' '}
        <span className="pz-dim-45">
          The question is whether they’ll own what they build.
        </span>
      </CharReveal>
    </Scene>
  );
}
