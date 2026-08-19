import CharReveal from '../CharReveal';
import Scene from '../Scene';

export default function Hero() {
  return (
    <Scene label="Hero" initial>
      <CharReveal as="h1" className="pz-hero-title">
        <span className="pz-dim-58">Turn cultural influence</span>{' '}
        <span>into ownership.</span>
      </CharReveal>
    </Scene>
  );
}
