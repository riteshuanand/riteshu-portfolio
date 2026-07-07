'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cuberto-style progressive text reveal: words start faded + blurred and
 * sharpen one by one as the paragraph moves through the viewport.
 */
export default function ScrollRevealText({ text, className = '' }) {
  const ref = useRef();
  const [revealed, setRevealed] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // reveal window: starts as the block enters the viewport,
      // fully revealed by the time it reaches ~60% height — text is
      // never still hidden when the reader actually reaches it
      const start = vh * 1.0;
      const end = vh * 0.6;
      const progress = Math.min(
        1,
        Math.max(0, (start - rect.top) / (start - end))
      );
      setRevealed(Math.floor(progress * words.length));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [words.length]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className={`rword ${i < revealed ? 'on' : ''}`}>
          {w}{' '}
        </span>
      ))}
    </p>
  );
}
