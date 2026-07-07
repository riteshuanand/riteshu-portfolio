import { createClient } from '@supabase/supabase-js';
import { demoProjects } from './demoData';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

/**
 * Fetch published projects. Falls back to bundled demo content
 * when Supabase env vars aren't set, so the site always renders.
 */
/** Manual order first (sort_order 1, 2, 3…), then everything else newest-first. */
function sortProjects(list) {
  return [...list].sort((a, b) => {
    const ao = a.sort_order > 0 ? a.sort_order : Infinity;
    const bo = b.sort_order > 0 ? b.sort_order : Infinity;
    if (ao !== bo) return ao - bo;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

export async function fetchProjects() {
  if (!isSupabaseConfigured) return demoProjects;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Supabase fetch failed, using demo data:', error?.message);
    return demoProjects;
  }
  return data.length ? sortProjects(data) : demoProjects;
}

export async function fetchProjectBySlug(slug) {
  if (!isSupabaseConfigured) {
    return demoProjects.find((p) => p.slug === slug) || null;
  }
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error || !data) {
    return demoProjects.find((p) => p.slug === slug) || null;
  }
  return data;
}
