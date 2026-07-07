'use client';

/**
 * Rotating circular text badge with an arrow in the middle (Cuberto-style).
 */
export default function SpinBadge({ href = '#work', label = 'see my work • ' }) {
  const repeated = label.repeat(2);
  return (
    <a
      href={href}
      className="group relative inline-block h-28 w-28 select-none"
      aria-label="See my work"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full animate-[spin_14s_linear_infinite] group-hover:animate-[spin_5s_linear_infinite]"
      >
        <defs>
          <path
            id="badge-circle"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        {/* textLength pins the text to the exact circumference so it never overlaps */}
        <text className="fill-ink/60 text-[9px] uppercase tracking-[0.15em]">
          <textPath href="#badge-circle" textLength="230" lengthAdjust="spacingAndGlyphs">
            {repeated}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl text-ink group-hover:text-accent transition-colors">
        ↓
      </span>
    </a>
  );
}
