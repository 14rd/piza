'use client';

import { useEffect, useRef } from 'react';

/** CSS fallback when WebGL is unavailable. */
const FALLBACK =
  'radial-gradient(80% 70% at 50% 20%, #930F12 0%, #2F0E00 55%, #0b0402 100%)';

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }';

/**
 * `octaves` is compiled in because a GLSL loop bound must be a constant. Each
 * octave is another round of value noise across five fbm calls per pixel, so
 * dropping from 6 to 4 is roughly a third off the per-pixel cost — the
 * difference is fine detail in the cloud, which is barely visible on a phone.
 */
const buildFrag = (octaves: number, coarse: boolean) => {
  // touch devices get finer, smaller strands
  const veinA = coarse ? '13.0' : '11.0';
  const veinB = coarse ? '18.0' : '16.0';
  const veinC = coarse ? '26.0' : '22.0';
  const boltTight = coarse ? '13.0' : '8.5';

  return `
precision highp float;
uniform vec2 u_res; uniform float u_t; uniform vec2 u_m; uniform float u_flow; uniform float u_energy; uniform float u_stir;
uniform float u_glow;   // cursor bloom, rises with pointer speed
uniform float u_flash;  // lightning strike, fast decay
uniform vec2  u_flashP; // where the strike landed
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<${octaves};i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 q = uv; q.x *= u_res.x/u_res.y;
  // mouse position gently tilts the whole field
  q += (u_m - vec2(0.5)) * 0.08;
  // scroll advances the field's evolution in time (u_flow) instead of translating it
  float ph = u_t * 0.05 + u_flow;
  vec2 warp = vec2(fbm(q*1.5 + vec2(ph, -ph*0.7)), fbm(q*1.5 + vec2(4.3 - ph*0.5, 1.7 + ph)));
  float f = fbm(q*1.95 + warp*(2.15 + u_energy*0.85 + u_stir*0.35) + vec2(0.0, ph*0.6));
  // scroll energy blooms and dissolves drifting patches of cloud
  float patch = fbm(q*2.4 + vec2(11.7 - ph*0.9, 3.1 + ph*1.3));
  f += (patch - 0.48) * u_energy * 0.62;
  // cursor stirs local turbulence rather than displacing the field
  vec2 md = (u_m - uv); md.x *= u_res.x/u_res.y;
  float m = exp(-dot(md,md)*3.0);
  float swirl = fbm(q*3.4 + vec2(ph*2.1 + 23.0, -ph*1.6));
  f += m * (0.05 + u_stir * 1.05) * (swirl - 0.32);
  // ---- light: cursor bloom + lightning ----
  // Ridged noise (1 - |2n-1|) peaks along thin lines rather than filling an
  // area. Raised to a high power those ridges narrow into filaments, so the
  // light reads as strands threading the cloud instead of a soft ball.
  // All three source fields are already computed above: no extra fbm.
  float vA = 1.0 - abs(swirl * 2.0 - 1.0);
  vA = pow(clamp(vA, 0.0, 1.0), ${veinA});
  float vB = 1.0 - abs(patch * 2.0 - 1.0);
  vB = pow(clamp(vB, 0.0, 1.0), ${veinB});
  // a third, much finer system breaks the strands into scattered bits
  float vC = 1.0 - abs(f * 2.0 - 1.0);
  vC = pow(clamp(vC, 0.0, 1.0), ${veinC});
  float filament = vA + vB * 0.7 + vC * 0.5;

  float aspect = u_res.x / u_res.y;

  /**
   * The falloff distance is warped by the noise field before it is squared,
   * so the lit area has a ragged, organic edge. A plain radial gaussian
   * reads as an obvious circle tracking the cursor.
   */
  vec2 gd = (u_m - uv); gd.x *= aspect;
  float gdist = max(0.0, length(gd) + (swirl - 0.5) * 0.34);
  float glowMask = exp(-gdist * gdist * 15.0);
  // no unstructured term: every bit of cursor light is carried by a strand
  float glowL = u_glow * glowMask * filament * 1.5;

  vec2 ld = (u_flashP - uv); ld.x *= aspect;
  float ldist = max(0.0, length(ld) + (patch - 0.5) * 0.30);
  float boltMask = exp(-ldist * ldist * ${boltTight});
  // only a trace of unstructured flash, so a strike still reads as a strike
  float boltL = u_flash * boltMask * (filament * 2.5 + 0.05);

  float light = glowL + boltL;
  // feed the light into the field so the cloud itself lights up from within,
  // rather than a flat disc floating over the top
  f += light * 0.40;

  f = pow(clamp(f, 0.0, 1.0), 0.86);
  vec3 base = vec3(0.043,0.016,0.008);   // near-black ground
  vec3 mah  = vec3(0.184,0.055,0.0);     // #2F0E00 rich mahogany
  vec3 crim = vec3(0.576,0.059,0.071);   // #930F12 deep crimson
  vec3 alab = vec3(0.898,0.898,0.898);   // #e5e5e5 alabaster
  vec3 col = mix(base, mah, smoothstep(0.12,0.56,f));
  col = mix(col, crim, smoothstep(0.40,0.88,f));
  // wisp highlights carried by alabaster, never by extra red
  col = mix(col, alab, pow(smoothstep(0.82,1.0,f), 2.2) * 0.30);
  float vig = smoothstep(1.5, 0.1, length((uv-vec2(0.5,0.45))*vec2(1.1,1.28)));
  col *= 0.46 + vig*0.54;
  // ambient field stays inside the palette ceiling
  col = min(col, max(crim, alab * 0.30));

  // light is applied above the ceiling, otherwise it clamps flat and reads as
  // a grey smudge. Crimson halo, alabaster core: still only brand colours.
  col = mix(col, crim, clamp(light * 0.50, 0.0, 1.0));
  // only the brightest filament cores reach alabaster, so the light keeps
  // thin white threads with a crimson bloom around them
  col = mix(col, alab, clamp(light * 0.62, 0.0, 1.0) * 0.85);

  col += (hash(gl_FragCoord.xy + u_t) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;
};

type Props = {
  /** Shader speed, 0–2.5. */
  motion?: number;
};

export default function CloudShader({ motion = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // read inside the rAF loop without restarting it
  const motionRef = useRef(motion);
  motionRef.current = motion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      canvas.style.background = FALLBACK;
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('PIZA shader compile failed:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    /**
     * Phones pay for this shader twice over: far more pixels per CSS pixel,
     * and a much weaker GPU. Render fewer octaves at 1x there.
     */
    const coarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches;

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, buildFrag(coarse ? 4 : 6, coarse));
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      canvas.style.background = FALLBACK;
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('PIZA shader link failed:', gl.getProgramInfoLog(prog));
      canvas.style.background = FALLBACK;
      return;
    }
    gl.useProgram(prog);

    // one fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uT = gl.getUniformLocation(prog, 'u_t');
    const uM = gl.getUniformLocation(prog, 'u_m');
    const uFlow = gl.getUniformLocation(prog, 'u_flow');
    const uEnergy = gl.getUniformLocation(prog, 'u_energy');
    const uStir = gl.getUniformLocation(prog, 'u_stir');
    const uGlow = gl.getUniformLocation(prog, 'u_glow');
    const uFlash = gl.getUniformLocation(prog, 'u_flash');
    const uFlashP = gl.getUniformLocation(prog, 'u_flashP');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mouse = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55 };
    let stirT = 0;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      stirT = Math.min(1, stirT + Math.hypot(nx - mouse.tx, ny - mouse.ty) * 6);
      mouse.tx = nx;
      mouse.ty = ny;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.6);
    const onResize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      // mobile fires resize as the URL bar retracts; reallocating the drawing
      // buffer for an unchanged size is pure cost
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    window.addEventListener('resize', onResize);
    onResize();

    const t0 = performance.now();
    let raf = 0;
    let flow = 0;
    let flowT = 0;
    let energy = 0;
    let stir = 0;
    let lastY = window.scrollY || 0;

    // ---- lighting state ----
    let glow = 0;
    let flash = 0;
    let flashX = 0.5;
    let flashY = 0.55;
    let nextStrike = 0; // earliest timestamp for the next strike
    let flickerAt = 0;
    let flickerPower = 0;
    let scrolled = 0; // viewports scrolled since the last mobile strike
    let scrollGate = 0.4; // re-rolled per strike so mobile never feels metronomic

    // strikes are deliberately sparse on both: on pointer devices the cursor
    // was producing far too many, on touch they were too rare to notice
    const MIN_GAP = coarse ? 1900 : 1900;
    const GAP_JITTER = coarse ? 2200 : 2400;

    /** Lightning rarely strikes once, so each bolt schedules a weaker echo. */
    const strike = (x: number, y: number, power: number, now: number) => {
      flashX = x;
      flashY = y;
      flash = Math.max(flash, power);
      flickerAt = now + 70 + Math.random() * 130;
      flickerPower = power * (0.4 + Math.random() * 0.35);
      nextStrike = now + MIN_GAP + Math.random() * GAP_JITTER;
    };

    const loop = () => {
      // was 0.055, which left the light trailing well behind the cursor
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      const doc = document.documentElement;
      const y = window.scrollY || doc.scrollTop || 0;
      const dy = Math.abs(y - lastY) / Math.max(1, window.innerHeight);
      lastY = y;

      flowT += dy * 0.45; // scroll distance advances evolution
      flow += (flowT - flow) * 0.055;

      // scroll AND cursor speed both feed the field's energy: fast bloom, slow dissolve
      const en = Math.min(1, dy * 24 + stirT * 0.4);
      energy += (en - energy) * (en > energy ? 0.1 : 0.02);
      stirT *= 0.945;
      stir += (stirT - stir) * 0.08;

      // ---- lighting ----
      const now = performance.now();

      if (flickerPower > 0 && now >= flickerAt) {
        flash = Math.max(flash, flickerPower);
        flickerPower = 0;
      }
      flash *= 0.885; // sharp falloff is what makes it read as a strike
      if (flash < 0.001) flash = 0;

      if (coarse) {
        glow = 0; // no cursor to bloom around
        scrolled += dy;
        // a re-rolled distance gate rather than a fixed one, so strikes land
        // on their own rhythm instead of every N viewports
        if (!reduced && scrolled > scrollGate && now >= nextStrike) {
          scrolled = 0;
          scrollGate = 0.25 + Math.random() * 0.45;
          strike(
            0.15 + Math.random() * 0.7,
            0.2 + Math.random() * 0.6,
            0.5 + Math.random() * 0.4, // varied power keeps the strands small
            now
          );
        }
      } else {
        /**
         * Light only while the cursor is actually moving. A constant baseline
         * left a halo permanently parked under the pointer, which is what
         * made it read as an artificial circle following the mouse.
         */
        const target = reduced ? 0 : Math.min(0.75, stirT * 0.95);
        glow += (target - glow) * (target > glow ? 0.15 : 0.045);
        if (!reduced && stirT > 0.85 && now >= nextStrike) {
          strike(mouse.tx, mouse.ty, 0.7 + Math.random() * 0.25, now);
        }
      }

      const speed = (motionRef.current ?? 1) * (reduced ? 0.2 : 1);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, ((performance.now() - t0) / 1000) * speed);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform1f(uFlow, flow);
      gl.uniform1f(uEnergy, energy);
      gl.uniform1f(uStir, stir);
      gl.uniform1f(uGlow, glow);
      gl.uniform1f(uFlash, flash);
      gl.uniform2f(uFlashP, flashX, flashY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(loop);
    };
    loop();

    // don't burn battery rendering a page nobody is looking at
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        lastY = window.scrollY || 0; // resume without a phantom scroll burst
        loop();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className="pz-shader" aria-hidden="true" />;
}
