'use client';

import { useEffect, useState } from 'react';

/** Sun/moon toggle. Persists to localStorage; a head script applies the
 *  saved theme before paint so there's no flash. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const el = document.documentElement;
    const next = !el.classList.contains('dark');
    el.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
    setDark(next);
    // let the 3D scene know so it can swap particle colors
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-sm text-ink/70 hover:border-accent hover:text-accent transition-colors"
    >
      {mounted ? (dark ? '☀' : '☾') : '·'}
    </button>
  );
}
