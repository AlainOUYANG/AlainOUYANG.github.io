import { getCollection } from 'astro:content';

const site = 'https://alainouyang.github.io';
const fixed = ['/', '/topics/', '/writing/', '/lab/', '/research/', '/about/', '/archive/'];

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const urls = [...fixed, ...posts.map(({ data }) => data.permalink)];
  const entries = urls.map((path) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
