import Background from '@/components/Background';
import Header from '@/components/Header';
import ScrollStage from '@/components/ScrollStage';
import About from '@/components/scenes/About';
import Contact from '@/components/scenes/Contact';
import Founder from '@/components/scenes/Founder';
import Hero from '@/components/scenes/Hero';
import Notes from '@/components/scenes/Notes';
import Roster from '@/components/scenes/Roster';
import WhyPiza from '@/components/scenes/WhyPiza';
import { SECTION_IDS } from '@/lib/content';

export default function Page() {
  return (
    <div className="pz-root">
      <Background />
      <Header />

      {/* scroll length + anchor targets only; nothing renders here */}
      <div className="pz-spacers" aria-hidden="true">
        {SECTION_IDS.map((id) => (
          <div key={id} id={id} className="pz-spacer" />
        ))}
      </div>

      <ScrollStage>
        <Hero />
        <WhyPiza />
        <About />
        <Roster />
        <Founder />
        <Notes />
        <Contact />
      </ScrollStage>
    </div>
  );
}
