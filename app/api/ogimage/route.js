// Fetches a page server-side and returns its og:image URL.
// Used by the admin to auto-grab thumbnails for Medium/Substack/LinkedIn posts.
export async function GET(request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url || !/^https?:\/\//i.test(url)) {
    return Response.json({ error: 'Provide a valid ?url=' }, { status: 400 });
  }
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        // some platforms serve og tags only to browser-like agents
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      },
    });
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
    return Response.json({ image: match ? match[1] : null });
  } catch (e) {
    return Response.json({ error: 'Could not fetch that URL' }, { status: 500 });
  }
}
