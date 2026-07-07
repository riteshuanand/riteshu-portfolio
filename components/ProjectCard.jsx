'use client';

import Link from 'next/link';
import { useRef } from 'react';

const typeLabels = {
  'case-study': 'Case study',
  teardown: 'Teardown / build',
  writing: 'Writing',
};

/** Card with a subtle 3D tilt on hover. */
export default function ProjectCard({ project }) {
  const ref = useRef();

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-2px)`;
  };

  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0)';
  };

  // only writing posts link out from the card; case studies and teardowns
  // always open their detail page (external_url becomes the prototype button there)
  const isExternal = project.type === 'writing' && Boolean(project.external_url);
  const href = isExternal ? project.external_url : `/project/${project.slug}`;

  const inner = (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group h-full rounded-3xl border border-ink/10 bg-surface/70 backdrop-blur-sm p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {project.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.cover_url}
          alt=""
          className="mb-6 h-40 w-full rounded-2xl object-cover"
        />
      )}
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted mb-4">
        <span className="uppercase tracking-[0.18em] text-accent">
          {typeLabels[project.type] || project.type}
        </span>
        {project.tags?.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full border border-ink/10 bg-cream px-2.5 py-0.5">
            {t}
          </span>
        ))}
      </div>
      <h3 className="font-display text-2xl leading-snug mb-3 group-hover:text-accent transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{project.summary}</p>
      {project.metrics && (
        <p className="text-xs text-accent font-medium">{project.metrics}</p>
      )}
      <span className="mt-4 inline-block text-sm text-muted group-hover:text-ink transition-colors">
        {isExternal ? 'Read →' : 'Open case study →'}
      </span>
    </div>
  );

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
