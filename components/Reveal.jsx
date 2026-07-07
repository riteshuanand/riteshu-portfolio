'use client';

import { useEffect, useRef } from 'react';

/** Fades/tilts children in as they enter the viewport (the scroll-depth part of the 3D feel). */
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      // fire as soon as any part enters the viewport, slightly early
      { threshold: 0.01, rootMargin: '0px 0px 10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
