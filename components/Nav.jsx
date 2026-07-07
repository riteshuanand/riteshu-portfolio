'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Case studies' },
  { href: '/#teardowns', label: 'Teardowns' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#writing', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
];

/** Floating pill nav (Sarvam-style). */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <nav
        className={`mx-auto max-w-4xl h-14 px-6 flex items-center justify-between rounded-full border transition-all duration-300 ${
          scrolled
            ? 'bg-surface/80 backdrop-blur-md border-ink/10 shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
            : 'bg-surface/40 backdrop-blur-sm border-ink/5'
        }`}
      >
        <Link
          href="/"
          className="font-display text-xl tracking-tight hover:text-accent transition-colors"
        >
          riteshu<span className="text-accent">.</span>
        </Link>
        <ul className="hidden sm:flex items-center gap-7 text-[11px] uppercase tracking-[0.18em] text-muted">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-ink transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="/resume.pdf"
            className="text-sm bg-ink text-cream rounded-full px-5 py-2 hover:bg-accent transition-colors"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
