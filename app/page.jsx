'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Nav from '../components/Nav';
import Reveal from '../components/Reveal';
import ProjectCard from '../components/ProjectCard';
import ScrollRevealText from '../components/ScrollRevealText';
import SpinBadge from '../components/SpinBadge';
import Magnetic from '../components/Magnetic';
import LogoMarquee from '../components/LogoMarquee';
import { fetchProjects } from '../lib/supabase';
import { DEFAULT_CONTENT, fetchSiteContent, parseSkills } from '../lib/content';

const Scene = dynamic(() => import('../components/Scene'), { ssr: false });

/** Numbered editorial section header: hairline rule + index/kicker, then the title.
 *  Anchors each section and echoes the numbering in the case-study list. */
function SectionHeading({ index, kicker, title }) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-4 border-t border-ink/15 pt-5">
        <span className="font-display text-lg text-accent">{index}</span>
        <span className="text-xs uppercase tracking-[0.3em] text-muted">{kicker}</span>
      </div>
      <h2 className="mt-6 font-display text-5xl sm:text-6xl tracking-tight leading-[1.05]">
        {title}
      </h2>
    </div>
  );
}

/** Numbered editorial row for case studies */
function CaseRow({ project, index }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group grid grid-cols-12 gap-4 sm:gap-6 items-start border-t border-ink/10 py-10 transition-colors hover:bg-surface/60"
    >
      <span className="col-span-2 sm:col-span-1 font-display text-xl text-accent pt-1">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="col-span-10 sm:col-span-6">
        <h3 className="font-display text-2xl sm:text-3xl leading-snug group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        {project.metrics && (
          <p className="mt-3 text-xs text-accent font-medium">{project.metrics}</p>
        )}
      </div>
      <div className="col-span-10 col-start-3 sm:col-span-4 sm:col-start-8">
        <p className="text-sm text-muted leading-relaxed">{project.summary}</p>
      </div>
      <span className="hidden sm:block col-span-1 text-right text-xl text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
        →
      </span>
    </Link>
  );
}

const SECTION_LIMIT = 4;

/** Centered "View X more / Show less" pill */
function ShowMore({ total, expanded, onToggle }) {
  if (total <= SECTION_LIMIT) return null;
  return (
    <div className="mt-8 text-center">
      <button
        onClick={onToggle}
        className="rounded-full border border-ink/15 bg-surface/50 px-6 py-2.5 text-sm text-muted hover:border-accent hover:text-accent transition-colors"
      >
        {expanded ? 'Show less ↑' : `View ${total - SECTION_LIMIT} more ↓`}
      </button>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [showAllCs, setShowAllCs] = useState(false);
  const [showAllTd, setShowAllTd] = useState(false);
  const [showAllWr, setShowAllWr] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchSiteContent().then(setContent);
  }, []);

  const caseStudies = projects.filter((p) => p.type === 'case-study');
  const teardowns = projects.filter((p) => p.type === 'teardown');
  const writing = projects.filter((p) => p.type === 'writing');
  const visibleCs = showAllCs ? caseStudies : caseStudies.slice(0, SECTION_LIMIT);
  const visibleTd = showAllTd ? teardowns : teardowns.slice(0, SECTION_LIMIT);
  const visibleWr = showAllWr ? writing : writing.slice(0, SECTION_LIMIT);
  const skills = parseSkills(content);
  const nameWords = content.hero_name.split(' ');

  return (
    <>
      {/* soft gradient wash behind everything — theme-aware via .bg-wash */}
      <div className="fixed inset-0 -z-20 pointer-events-none bg-wash" aria-hidden="true" />
      <Scene />
      <Nav />

      <main className="relative mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="min-h-[92vh] flex flex-col items-center justify-center text-center pt-16">
          <div className="flex items-center gap-4 mb-8 fade-up" style={{ animationDelay: '0.9s' }}>
            <span className="h-px w-10 bg-ink/20" />
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {content.hero_kicker}
            </p>
            <span className="h-px w-10 bg-ink/20" />
          </div>
          <h1 className="font-display text-6xl sm:text-8xl tracking-tight leading-[1.02]">
            {nameWords.map((word, i) => (
              <span key={i}>
                <span className="rise-mask">
                  <span className="rise" style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
                    {word}
                    {i === nameWords.length - 1 && <span className="text-accent">.</span>}
                  </span>
                </span>
                {i < nameWords.length - 1 && ' '}
              </span>
            ))}
          </h1>
          <p className="font-display italic text-2xl sm:text-3xl text-ink/70 mt-5">
            <span className="rise-mask">
              <span className="rise" style={{ animationDelay: '0.45s' }}>
                {content.hero_tagline}
              </span>
            </span>
          </p>
          <p
            className="mt-6 max-w-lg text-base text-muted leading-relaxed fade-up"
            style={{ animationDelay: '0.7s' }}
          >
            {content.hero_intro}
          </p>
          <div className="mt-10 flex items-center gap-4 fade-up" style={{ animationDelay: '0.85s' }}>
            <Magnetic>
              <a
                href="#work"
                className="rounded-full bg-ink text-cream px-7 py-3.5 text-sm font-medium hover:bg-accent transition-colors inline-block"
              >
                {content.hero_primary_cta}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="rounded-full border border-ink/15 bg-surface/50 px-7 py-3.5 text-sm hover:border-accent hover:text-accent transition-colors inline-block"
              >
                {content.hero_secondary_cta}
              </a>
            </Magnetic>
          </div>
          <div className="mt-16 fade-up" style={{ animationDelay: '1.1s' }}>
            <SpinBadge href="#about" label="scroll to explore • " />
          </div>
        </section>

        {/* Logo marquee strip */}
        <LogoMarquee />

        {/* About */}
        <section id="about" className="py-20 scroll-mt-28">
          <Reveal>
            <SectionHeading index="01" kicker={content.about_kicker} title={content.about_title} />
          </Reveal>
          <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
              <ScrollRevealText text={content.about_p1} />
              <ScrollRevealText text={content.about_p2} />
          </div>
        </section>

        {/* Case studies — numbered editorial list */}
        <section id="work" className="py-20 scroll-mt-28">
          <Reveal>
            <SectionHeading index="02" kicker={content.cs_kicker} title={content.cs_title} />
          </Reveal>
          <div className="border-b border-ink/10">
            {visibleCs.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <CaseRow project={p} index={i} />
              </Reveal>
            ))}
            {caseStudies.length === 0 && (
              <p className="text-muted text-sm py-10">Case studies coming soon.</p>
            )}
          </div>
          <ShowMore
            total={caseStudies.length}
            expanded={showAllCs}
            onToggle={() => setShowAllCs(!showAllCs)}
          />
        </section>

        {/* Teardowns & builds — card grid */}
        <section id="teardowns" className="py-20 scroll-mt-28">
          <Reveal>
            <SectionHeading index="03" kicker={content.td_kicker} title={content.td_title} />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {visibleTd.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
            {teardowns.length === 0 && (
              <p className="text-muted text-sm">Teardowns coming soon.</p>
            )}
          </div>
          <ShowMore
            total={teardowns.length}
            expanded={showAllTd}
            onToggle={() => setShowAllTd(!showAllTd)}
          />
        </section>

        {/* Skills */}
        <section id="skills" className="py-20 scroll-mt-28">
          <Reveal>
            <SectionHeading index="04" kicker={content.skills_kicker} title={content.skills_title} />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((s, i) => (
              <Reveal key={s.group} delay={i * 80} className="h-full">
                <div
                  className={`rounded-3xl border backdrop-blur-sm p-6 h-full shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
                    s.featured
                      ? 'border-accent/50 bg-accent/[0.06]'
                      : 'border-ink/10 bg-surface/70'
                  }`}
                >
                  <h3 className="font-display text-xl mb-4 text-accent">
                    {s.group}
                    {s.featured && <span className="ml-2 text-sm align-middle">✦</span>}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Writing */}
        <section id="writing" className="py-20 scroll-mt-28">
          <Reveal>
            <SectionHeading index="05" kicker={content.writing_kicker} title={content.writing_title} />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {visibleWr.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
            {writing.length === 0 && (
              <p className="text-muted text-sm">Posts coming soon.</p>
            )}
          </div>
          <ShowMore
            total={writing.length}
            expanded={showAllWr}
            onToggle={() => setShowAllWr(!showAllWr)}
          />
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 scroll-mt-28">
          <Reveal>
            <SectionHeading
              index="06"
              kicker={content.contact_kicker}
              title={content.contact_title}
            />
            <p className="max-w-xl text-muted leading-relaxed mb-10">
              {content.contact_blurb}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${content.contact_email}`}
                className="rounded-full bg-ink text-cream px-7 py-3.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                {content.contact_email}
              </a>
              <a
                href={content.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/15 bg-surface/50 px-7 py-3.5 text-sm hover:border-accent hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="/resume.pdf"
                className="rounded-full border border-ink/15 bg-surface/50 px-7 py-3.5 text-sm hover:border-accent hover:text-accent transition-colors"
              >
                Download resume
              </a>
            </div>
          </Reveal>
        </section>

        <footer className="pb-10 pt-6 border-t border-ink/10 text-xs text-muted flex justify-between">
          <span>© {new Date().getFullYear()} {content.hero_name}</span>
          <a href="/admin" className="hover:text-ink transition-colors">
            admin
          </a>
        </footer>
      </main>
    </>
  );
}
