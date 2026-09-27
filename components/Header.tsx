import Logo from './Logo';

const NAV = [
  { href: '#manifesto', label: 'Why' },
  { href: '#essence', label: 'About' },
  { href: '#roster', label: 'Roster' },
  { href: '#founder', label: 'Founder' },
  { href: '#press', label: 'Press', hideSmall: true },
];

export default function Header() {
  return (
    <header className="pz-header">
      <a href="#top" aria-label="PIZA — Home" className="pz-logo-link">
        <Logo className="pz-logo" />
      </a>
      <nav className="pz-nav" aria-label="Primary">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={item.hideSmall ? 'pz-hide-sm' : undefined}
          >
            {item.label}
          </a>
        ))}
        <a href="#contact" className="pz-nav-cta">
          Get in touch
        </a>
      </nav>
    </header>
  );
}
