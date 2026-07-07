'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Nav from '../../../components/Nav';
import { fetchProjectBySlug } from '../../../lib/supabase';

const typeLabels = {
  'case-study': 'Case study',
  teardown: 'Teardown / build',
  writing: 'Writing',
};

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(undefined);

  useEffect(() => {
    if (slug) fetchProjectBySlug(slug).then((p) => setProject(p || null));
  }, [slug]);

  if (project === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center text-muted text-sm">
        Loading…
      </main>
    );
  }

  if (project === null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted">Project not found.</p>
        <Link href="/" className="text-accent underline underline-offset-4">
          Back home
        </Link>
      </main>
    );
  }

  return (
    <>
      {/* soft gradient wash — theme-aware via .bg-wash */}
      <div className="fixed inset-0 -z-20 pointer-events-none bg-wash" aria-hidden="true" />
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-36 pb-24">
        <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">
          ← Back
        </Link>

        <div className="mt-10 mb-5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="uppercase tracking-[0.18em] text-accent">
            {typeLabels[project.type] || project.type}
          </span>
          {project.tags?.map((t) => (
            <span key={t} className="rounded-full border border-ink/10 bg-surface/60 px-2.5 py-0.5">
              {t}
            </span>
          ))}
        </div>

        <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-[1.05]">
          {project.title}
        </h1>

        {project.metrics && (
          <p className="mt-5 text-sm text-accent font-medium">{project.metrics}</p>
        )}

        {/* working prototype / live project link — quiet accent pill */}
        {project.external_url && project.type !== 'writing' && (
          <a
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-2 rounded-full border border-accent/40 px-5 py-2.5 text-sm font-medium text-accent hover:bg-accent hover:text-cream hover:border-accent transition-colors"
          >
            Working prototype
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        )}

        {project.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url}
            alt=""
            className="mt-10 w-full rounded-3xl border border-ink/10"
          />
        )}

        <article className="prose-portfolio mt-10">
          <ReactMarkdown>{project.body || ''}</ReactMarkdown>
        </article>

        {/* Inline PDF viewer — the document opens right here, same window */}
        {project.pdf_url && (
          <section className="mt-14">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">
                Document
              </p>
              <h2 className="font-display text-3xl tracking-tight">
                The full deck
              </h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <iframe
                src={`${project.pdf_url}#view=FitH`}
                title={`${project.title} — PDF`}
                className="w-full h-[85vh]"
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Viewer not loading?{' '}
              <a
                href={project.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                Open the PDF directly
              </a>
              .
            </p>
          </section>
        )}
      </main>
    </>
  );
}
