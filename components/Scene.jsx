'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// shared mouse state (window-level listener since the canvas has pointer-events: none)
const mouse = { x: 0, y: 0 };

function useWindowPointer() {
  useEffect(() => {
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}

const LIGHT_PALETTE = [
  new THREE.Color('#171730'), // ink
  new THREE.Color('#ff5847'), // coral
  new THREE.Color('#7c83ff'), // periwinkle
];
const DARK_PALETTE = [
  new THREE.Color('#ebebf2'), // light ink
  new THREE.Color('#9ba0ff'), // periwinkle (dark-mode accent)
  new THREE.Color('#ff6a5a'), // coral, rare spark
];

/**
 * Flowing particle field: particles drift on layered sine "wind",
 * scatter away from the cursor, and ease back when it leaves.
 */
function FlowParticles({ count = 3200, isDark = false }) {
  const ref = useRef();
  const { viewport } = useThree();

  const { base, colors } = useMemo(() => {
    const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
    const base = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * 18; // x
      base[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      base[i * 3 + 2] = (Math.random() - 0.5) * 5; // z depth
      // mostly ink, with coral / periwinkle sparks
      const r = Math.random();
      const c = r < 0.62 ? palette[0] : r < 0.82 ? palette[1] : palette[2];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { base, colors };
  }, [count, isDark]);

  const positions = useMemo(() => base.slice(), [base]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const arr = pts.geometry.attributes.position.array;

    // cursor in world coords on the z=0 plane
    const mx = mouse.x * (viewport.width / 2);
    const my = mouse.y * (viewport.height / 2);
    const radius = 2.2;
    const r2 = radius * radius;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const bx = base[ix];
      const by = base[ix + 1];
      const bz = base[ix + 2];

      // layered sine "wind" — organic drift, different phase per particle
      let x = bx + Math.sin(t * 0.28 + by * 0.55 + bz) * 0.55 + Math.sin(t * 0.11 + bx * 0.3) * 0.35;
      let y = by + Math.cos(t * 0.22 + bx * 0.5) * 0.45 + Math.sin(t * 0.15 + bz * 1.3) * 0.25;
      const z = bz + Math.sin(t * 0.18 + bx * 0.4 + by * 0.6) * 0.4;

      // cursor repulsion
      const dx = x - mx;
      const dy = y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const push = (1 - d / radius) * 1.1;
        x += (dx / d) * push;
        y += (dy / d) * push;
      }

      // ease displayed position toward target (gives the scatter a soft spring)
      arr[ix] += (x - arr[ix]) * 0.08;
      arr[ix + 1] += (y - arr[ix + 1]) * 0.08;
      arr[ix + 2] += (z - arr[ix + 2]) * 0.08;
    }
    pts.geometry.attributes.position.needsUpdate = true;

    // whole field tilts gently with the cursor
    pts.rotation.x = THREE.MathUtils.lerp(pts.rotation.x, mouse.y * 0.06, 0.02);
    pts.rotation.y = THREE.MathUtils.lerp(pts.rotation.y, mouse.x * 0.08, 0.02);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* Scroll rig — camera pulls back and drifts as the page scrolls */
function Rig() {
  const { camera } = useThree();
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const s = scroll.current;
    const targetZ = 6 + s * 0.004;
    const targetY = -s * 0.001;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.25, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContents({ isDark }) {
  useWindowPointer();
  return (
    <>
      {/* key remount rebuilds the color buffer when the theme flips */}
      <FlowParticles key={isDark ? 'dark' : 'light'} isDark={isDark} />
      <Rig />
    </>
  );
}

export default function Scene() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const wrapRef = useRef();

  useEffect(() => {
    const readTheme = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
    readTheme();
    window.addEventListener('theme-change', readTheme);
    return () => window.removeEventListener('theme-change', readTheme);
  }, []);

  useEffect(() => {
    setMounted(true);
    // fade the scene down (but not out) as you scroll past the first viewport
    const onScroll = () => {
      if (!wrapRef.current) return;
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 1.4));
      wrapRef.current.style.opacity = String(0.25 + fade * 0.75);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContents isDark={isDark} />
      </Canvas>
      {/* soft vignette so the particles never fight the text (theme-aware via CSS var) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgb(var(--cream)) 97%)',
        }}
      />
    </div>
  );
}
