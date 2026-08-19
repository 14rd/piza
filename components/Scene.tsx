import type { ReactNode } from 'react';

type Props = {
  /** Used by the scroll engine to find the scenes, and as an a11y label. */
  label: string;
  children: ReactNode;
  /** Hero only: on stage before the scroll engine paints its first frame. */
  initial?: boolean;
  variant?: 'contact';
};

export default function Scene({ label, children, initial, variant }: Props) {
  const className = [
    'pz-scene',
    initial && 'pz-scene--initial',
    variant === 'contact' && 'pz-scene--contact',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section data-screen-label={label} aria-label={label} className={className}>
      {children}
    </section>
  );
}
