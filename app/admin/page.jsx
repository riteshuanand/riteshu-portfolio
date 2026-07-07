'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { DEFAULT_CONTENT } from '../../lib/content';

// fields editable in the "Site copy" panel — label, key, and input size
const copyFields = [
  { key: 'hero_kicker', label: 'Hero kicker (small line above your name)' },
  { key: 'hero_name', label: 'Name' },
  { key: 'hero_tagline', label: 'Hero tagline (italic line)' },
  { key: 'hero_intro', label: 'Hero intro paragraph', multiline: true },
  { key: 'hero_primary_cta', label: 'Primary button text' },
  { key: 'hero_secondary_cta', label: 'Secondary button text' },
  { key: 'about_kicker', label: 'About — kicker' },
  { key: 'about_title', label: 'About — title' },
  { key: 'about_p1', label: 'About — paragraph 1', multiline: true },
  { key: 'about_p2', label: 'About — paragraph 2', multiline: true },
  { key: 'cs_kicker', label: 'Case studies — kicker' },
  { key: 'cs_title', label: 'Case studies — title' },
  { key: 'td_kicker', label: 'Teardowns — kicker' },
  { key: 'td_title', label: 'Teardowns — title' },
  { key: 'skills_kicker', label: 'Skills — kicker' },
  { key: 'skills_title', label: 'Skills — title' },
  { key: 'writing_kicker', label: 'Writing — kicker' },
  { key: 'writing_title', label: 'Writing — title' },
  { key: 'contact_kicker', label: 'Contact — kicker' },
  { key: 'contact_title', label: 'Contact — title' },
  { key: 'contact_blurb', label: 'Contact — blurb', multiline: true },
  { key: 'contact_email', label: 'Contact email' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
  { key: 'skills_json', label: 'Skill groups (JSON — careful with commas)', multiline: true, mono: true },
];

const emptyForm = {
  id: null,
  title: '',
  slug: '',
  type: 'case-study',
  summary: '',
  body: '',
  tags: '',
  metrics: '',
  external_url: '',
  pdf_url: '',
  cover_url: '',
  sort_order: 0,
  published: true,
};

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [copy, setCopy] = useState(DEFAULT_CONTENT);
  const [copyStatus, setCopyStatus] = useState('');
  const [copySaving, setCopySaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadProjects();
      loadCopy();
    }
  }, [session]);

  async function loadCopy() {
    const { data, error } = await supabase.from('site_content').select('key, value');
    if (!error && data) {
      const overrides = Object.fromEntries(
        data.filter((r) => r.value != null && r.value !== '').map((r) => [r.key, r.value])
      );
      setCopy({ ...DEFAULT_CONTENT, ...overrides });
    }
  }

  async function saveCopy(e) {
    e.preventDefault();
    setCopySaving(true);
    setCopyStatus('');
    try {
      const rows = copyFields.map(({ key }) => ({
        key,
        value: copy[key] ?? '',
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from('site_content').upsert(rows);
      if (error) throw error;
      setCopyStatus('Copy saved ✓');
    } catch (err) {
      setCopyStatus(`Error: ${err.message}`);
    } finally {
      setCopySaving(false);
    }
  }

  async function loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
  }

  const [fetchingThumb, setFetchingThumb] = useState(false);

  async function fetchThumbnail() {
    if (!form.external_url) {
      setStatus('Add an external URL first.');
      return;
    }
    setFetchingThumb(true);
    setStatus('');
    try {
      const r = await fetch(`/api/ogimage?url=${encodeURIComponent(form.external_url)}`);
      const data = await r.json();
      if (data.image) {
        setForm((f) => ({ ...f, cover_url: data.image }));
        setStatus('Thumbnail fetched ✓');
      } else {
        setStatus('No thumbnail found on that page.');
      }
    } catch {
      setStatus('Could not fetch thumbnail.');
    } finally {
      setFetchingThumb(false);
    }
  }

  async function signIn(e) {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  function edit(p) {
    setForm({
      id: p.id,
      title: p.title || '',
      slug: p.slug || '',
      type: p.type || 'case-study',
      summary: p.summary || '',
      body: p.body || '',
      tags: (p.tags || []).join(', '),
      metrics: p.metrics || '',
      external_url: p.external_url || '',
      pdf_url: p.pdf_url || '',
      cover_url: p.cover_url || '',
      sort_order: p.sort_order ?? 0,
      published: p.published,
    });
    setCoverFile(null);
    setPdfFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id) {
    if (!confirm('Delete this project permanently?')) return;
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      let cover_url;
      if (coverFile) {
        const path = `${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: upErr } = await supabase.storage
          .from('covers')
          .upload(path, coverFile, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('covers').getPublicUrl(path);
        cover_url = data.publicUrl;
      }

      let pdf_url;
      if (pdfFile) {
        const path = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: pdfErr } = await supabase.storage
          .from('docs')
          .upload(path, pdfFile, { upsert: true, contentType: 'application/pdf' });
        if (pdfErr) throw pdfErr;
        const { data } = supabase.storage.from('docs').getPublicUrl(path);
        pdf_url = data.publicUrl;
      }

      const row = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        type: form.type,
        summary: form.summary,
        body: form.body,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        metrics: form.metrics || null,
        external_url: form.external_url || null,
        sort_order: Number(form.sort_order) || 0,
        published: form.published,
        // uploaded file wins; otherwise use the (possibly og-fetched) URL field
        cover_url: cover_url || form.cover_url || null,
        ...(pdf_url ? { pdf_url } : {}),
      };

      const { error } = form.id
        ? await supabase.from('projects').update(row).eq('id', form.id)
        : await supabase.from('projects').insert(row);
      if (error) throw error;

      setStatus('Saved ✓');
      setForm(emptyForm);
      setCoverFile(null);
      setPdfFile(null);
      loadProjects();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display text-3xl">Admin not connected</h1>
          <p className="text-muted text-sm leading-relaxed">
            Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local (see README.md), then
            restart the dev server. Until then, the site shows demo content.
          </p>
          <Link href="/" className="inline-block text-accent underline underline-offset-4">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const inputCls =
    'w-full rounded-xl bg-surface border border-ink/10 px-4 py-3 text-sm outline-none focus:border-accent';

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={signIn} className="w-full max-w-sm space-y-4">
          <h1 className="font-display text-3xl mb-6">Admin login</h1>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-ink text-cream py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl">
          {form.id ? 'Edit project' : 'New project'}
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted hover:text-ink">
            View site
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-muted hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>

      <form onSubmit={save} className="space-y-4">
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputCls}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Slug (auto from title if empty)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            className={inputCls}
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputCls}
          >
            <option value="case-study">Case study</option>
            <option value="teardown">Teardown / build</option>
            <option value="writing">Writing</option>
          </select>
        </div>
        <textarea
          required
          placeholder="Summary (1-2 sentences shown on the card)"
          rows={2}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className={inputCls}
        />
        <textarea
          placeholder={'Body (Markdown supported)\n\n## The problem\n...'}
          rows={12}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className={`${inputCls} font-mono text-xs`}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Tags, comma separated"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className={inputCls}
          />
          <input
            placeholder="Metrics line (optional)"
            value={form.metrics}
            onChange={(e) => setForm({ ...form, metrics: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-[1fr_150px] gap-4">
          <input
            placeholder="External URL (prototype button; for Writing it links the card out)"
            value={form.external_url}
            onChange={(e) => setForm({ ...form, external_url: e.target.value })}
            className={inputCls}
          />
          <input
            type="number"
            min="0"
            placeholder="Order (1 = first)"
            title="Manual position: 1 shows first, 2 second… 0 = automatic (newest first)"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-4">
          <input
            placeholder="Thumbnail URL (or fetch it from the external link →)"
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
            className={inputCls}
          />
          <button
            type="button"
            onClick={fetchThumbnail}
            disabled={fetchingThumb}
            className="shrink-0 rounded-full border border-ink/15 px-5 py-2.5 text-sm text-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
          >
            {fetchingThumb ? 'Fetching…' : 'Fetch thumbnail'}
          </button>
          {form.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.cover_url}
              alt="thumbnail preview"
              className="h-12 w-20 shrink-0 rounded-lg object-cover border border-ink/10"
            />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="text-sm text-muted">
            Cover image / thumbnail{' '}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="ml-2 text-xs"
            />
          </label>
          <label className="text-sm text-muted">
            PDF document{' '}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="ml-2 text-xs"
            />
            {form.pdf_url && !pdfFile && (
              <span className="ml-2 text-xs text-accent">PDF attached ✓</span>
            )}
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink text-cream px-7 py-3 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : form.id ? 'Update project' : 'Publish project'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setCoverFile(null);
              }}
              className="text-sm text-muted hover:text-ink"
            >
              Cancel edit
            </button>
          )}
          {status && <span className="text-sm text-accent">{status}</span>}
        </div>
      </form>

      <h2 className="font-display text-2xl mt-16 mb-6">
        All projects ({projects.length})
      </h2>
      <ul className="space-y-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-2xl border border-ink/10 bg-surface/70 px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium">
                {p.title}{' '}
                {!p.published && (
                  <span className="text-xs text-amber-600 ml-2">draft</span>
                )}
              </p>
              <p className="text-xs text-muted mt-1">
                {p.type} · /{p.slug}
                {p.sort_order > 0 && ` · order ${p.sort_order}`}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button onClick={() => edit(p)} className="text-muted hover:text-ink">
                Edit
              </button>
              <button
                onClick={() => remove(p.id)}
                className="text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Site copy editor — every heading and paragraph on the homepage */}
      <h2 className="font-display text-2xl mt-16 mb-2">Site copy</h2>
      <p className="text-sm text-muted mb-6">
        Edit any text on the homepage. Empty fields fall back to the built-in
        defaults.
      </p>
      <form onSubmit={saveCopy} className="space-y-4">
        {copyFields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs uppercase tracking-wider text-muted">
              {f.label}
            </span>
            {f.multiline ? (
              <textarea
                rows={f.mono ? 12 : 3}
                value={copy[f.key] ?? ''}
                onChange={(e) => setCopy({ ...copy, [f.key]: e.target.value })}
                className={`${inputCls} ${f.mono ? 'font-mono text-xs' : ''}`}
              />
            ) : (
              <input
                value={copy[f.key] ?? ''}
                onChange={(e) => setCopy({ ...copy, [f.key]: e.target.value })}
                className={inputCls}
              />
            )}
          </label>
        ))}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={copySaving}
            className="rounded-full bg-ink text-cream px-7 py-3 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            {copySaving ? 'Saving…' : 'Save site copy'}
          </button>
          {copyStatus && <span className="text-sm text-accent">{copyStatus}</span>}
        </div>
      </form>
    </main>
  );
}
