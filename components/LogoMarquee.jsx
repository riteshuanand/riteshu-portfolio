'use client';

/**
 * Scrolling strip of associations. Real vector logos where available
 * (Cashify, PlatinumRx icon), brand-styled text lockups for the rest.
 * One coherent treatment: everything sits at the same mid-gray weight.
 */

// shared classes so every item reads at the same visual weight
// (dark:invert flips the darkened logos to light gray on dark backgrounds)
const logoImg = 'w-auto grayscale brightness-50 opacity-80 dark:invert';
const lockup = 'text-lg font-semibold tracking-tight text-ink/60 whitespace-nowrap';

const items = [
  {
    key: 'cashify',
    node: (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/logos/cashify.svg" alt="Cashify" className={`h-7 ${logoImg}`} />
    ),
  },
  {
    key: 'platinumrx',
    node: (
      <span className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/platinumrx.svg" alt="" className={`h-6 ${logoImg}`} />
        <span className={lockup}>PlatinumRx</span>
      </span>
    ),
  },
  {
    key: 'cultfit',
    node: <span className={`${lockup} lowercase`}>cult.fit</span>,
  },
  {
    key: 'nsut',
    node: (
      <span className="flex items-center gap-2.5">
        {/* NSUT emblem, hotlinked from Wikimedia (public asset) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/en/e/e9/Netaji_Subhas_University_of_Technology.svg"
          alt=""
          className={`h-8 ${logoImg}`}
        />
        <span className={lockup}>Netaji Subhas University of Technology</span>
      </span>
    ),
  },
  {
    key: 'scaler',
    node: <span className={lockup}>Scaler School of Business</span>,
  },
];

export default function LogoMarquee() {
  // even number of copies so the -50% translate loops seamlessly and no item gets skipped
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="relative -mx-6 overflow-hidden border-y border-ink/10 bg-surface/40 backdrop-blur-sm py-5 select-none">
      <div className="marquee-track items-center">
        {row.map((item, i) => (
          <span key={`${item.key}-${i}`} className="flex items-center">
            <span className="px-10 flex items-center">{item.node}</span>
            <span className="text-accent/60 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
