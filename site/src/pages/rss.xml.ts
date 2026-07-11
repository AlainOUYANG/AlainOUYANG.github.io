import { getCollection } from 'astro:content';

const site = 'https://alainouyang.github.io';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const items = posts.slice(0, 50).map(({ data }) => {
    const title = data.title.replaceAll(']]>', ']]&gt;');
    const link = escapeXml(new URL(data.permalink, site).href);
    return `<item><title><![CDATA[${title}]]></title><link>${link}</link><guid isPermaLink="true">${link}</guid><description><![CDATA[${data.description.replaceAll(']]>', ']]&gt;')}]]></description><pubDate>${data.pubDate.toUTCString()}</pubDate></item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>佐坤 · Zuokun Ouyang</title><link>${site}/</link><description>智能营销、因果推断、Uplift Modeling 与 AI 应用。</description><language>zh-CN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
