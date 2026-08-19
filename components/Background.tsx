'use client';

import { useEffect, useRef } from 'react';
import CloudShader from './CloudShader';

/** 160x160 tile of noise, generated once at runtime and repeated. */
function useGrain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const n = 160;
    const c = document.createElement('canvas');
    c.width = n;
    c.height = n;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const img = ctx.createImageData(n, n);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 90 + Math.random() * 150;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 80 + Math.random() * 90;
    }
    ctx.putImageData(img, 0, 0);
    host.style.backgroundImage = `url(${c.toDataURL()})`;
  }, []);

  return ref;
}

export default function Background() {
  const grainRef = useGrain();

  return (
    <div className="pz-bg" aria-hidden="true">
      <CloudShader />
      <div className="pz-vignette" />
      <div ref={grainRef} className="pz-grain" />
    </div>
  );
}
