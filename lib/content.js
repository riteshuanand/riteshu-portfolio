import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Every piece of site copy lives here as a default, and each key can be
 * overridden from /admin (stored in the site_content table). So the whole
 * homepage is editable word-by-word without redeploying.
 */
export const DEFAULT_CONTENT = {
  hero_kicker: 'Associate Product Manager · Cashify',
  hero_name: 'Riteshu Anand',
  hero_tagline: 'Building products people actually love.',
  hero_intro:
    'APM at Cashify, obsessed with AI, metrics, and user-centric design. Before this: PlatinumRx and Cult.fit.',
  hero_primary_cta: 'See my work',
  hero_secondary_cta: 'Get in touch',

  about_kicker: 'About',
  about_title: 'The TL;DR',
  about_p1:
    "Mechanical engineer from NSUT. Did strategy at Cult.fit, then product at PlatinumRx, where I shipped checkout, SEO, and social-proof work with real numbers attached. Now I'm an APM at Cashify, working on re-commerce.",
  about_p2:
    'On the side I build with AI: an Android dictation app, a Telegram stock agent. Top PM Fellow at NextLeap. Currently doing a PGP in Business & AI at Scaler.',

  cs_kicker: 'Off the clock',
  cs_title: 'Case studies',
  td_kicker: 'Experiments',
  td_title: 'Teardowns & builds',
  skills_kicker: 'Skills',
  skills_title: 'The toolkit',
  writing_kicker: 'Learnings',
  writing_title: 'The playbook',

  contact_kicker: 'Contact',
  contact_title: 'Nerdy product debates welcome',
  contact_blurb:
    'Open to collaborations, mentorship chats, and product debates that spiral into startup ideas.',
  contact_email: 'anandriteshu@gmail.com',
  linkedin_url: 'https://www.linkedin.com/in/riteshuanand',

  // skill groups as editable JSON
  skills_json: JSON.stringify(
    [
      {
        group: 'AI',
        items: [
          'AI agents',
          'LLM integration',
          'Prompt engineering',
          'Context engineering',
          'AI evaluations',
          'Workflow automation',
        ],
      },
      {
        group: 'Product',
        items: [
          'User research',
          'Funnel analysis',
          'A/B testing',
          'Roadmap prioritization',
          'SEO optimization',
        ],
      },
      {
        group: 'Data & Analytics',
        items: [
          'SQL',
          'Product analytics',
          'Behavioral analytics',
          'Session analysis',
          'Data visualization',
        ],
      },
      {
        group: 'Technical',
        items: [
          'System design',
          'REST APIs',
          'Rapid prototyping',
          'Android (Kotlin)',
          'Data pipelines',
        ],
      },
    ],
    null,
    2
  ),
};

/** Fetch copy overrides from Supabase and merge over the defaults. */
export async function fetchSiteContent() {
  if (!isSupabaseConfigured) return DEFAULT_CONTENT;
  const { data, error } = await supabase.from('site_content').select('key, value');
  if (error || !data) return DEFAULT_CONTENT;
  const overrides = Object.fromEntries(
    data.filter((r) => r.value != null && r.value !== '').map((r) => [r.key, r.value])
  );
  return { ...DEFAULT_CONTENT, ...overrides };
}

/** Parse the skills JSON safely, falling back to the defaults. */
export function parseSkills(content) {
  try {
    const parsed = JSON.parse(content.skills_json);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return JSON.parse(DEFAULT_CONTENT.skills_json);
}
