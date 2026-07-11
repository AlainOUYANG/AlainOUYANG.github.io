# 佐坤个人网站 Astro 重建实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `site/` 中构建一个可本地完整验证的 Astro 个人网站，使首页与所有子页面共享有辨识度的沉浸式深色设计系统，并保留历史内容和有效 URL。

**Architecture:** 使用 Astro 7 的纯静态输出和 build-time Content Collections。全站由 `BaseLayout`、统一 design tokens、共享导航／页头／章节／卡片／页脚组成；首页额外加载无框架的粒子与打字机脚本。Jekyll 保持不动，Astro 在 `site/` 独立构建，直到发布切换获得单独授权。

**Tech Stack:** Node.js 22+、Astro 7、TypeScript、Astro Content Collections、原生 CSS／Canvas／TypeScript、Node.js 内置测试与验证脚本、Playwright CLI。

## Global Constraints

- 中文显示名始终为「佐坤」，英文名为 `Zuokun Ouyang`。
- 主定位是智能营销、因果推断和 Uplift Modeling；AI 应用是副线；研究是支撑。
- 不公开公司案例、业务数据、内部方法和指标。
- 首页和子页面必须共享深紫黑、暖白、珊瑚紫强调、编号章节、卡片、按钮和动效语言。
- 首页使用沉浸式粒子／打字机首屏和 Bento；子页面使用相同 token 和组件，优先正文可读性。
- 不复制参考站的文案、素材、粒子分布、精确配色、字体或尺寸。
- 第一版不实现 CMS、评论、搜索、动态筛选、统计和主题切换。
- 不删除 Jekyll 文件，不修改 `.github/workflows`，不切换 GitHub Pages 发布源。
- 所有新行为遵循 RED → GREEN → REFACTOR；配置和机械迁移用构建／输出契约验证。

---

### Task 1: 建立 Astro 工程与输出契约

**Files:**
- Create: `site/package.json`
- Create: `site/astro.config.mjs`
- Create: `site/tsconfig.json`
- Create: `site/scripts/verify-build.mjs`
- Create: `site/src/pages/index.astro`

**Interfaces:**
- Produces: `npm run check`、`npm run build`、`npm run verify`；静态输出目录 `site/dist/`。

- [ ] **Step 1: 写失败的构建契约验证器**

```js
// site/scripts/verify-build.mjs
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

await access(new URL('../dist/index.html', import.meta.url));
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(html, /佐坤/);
assert.match(html, /研究增量，也创造新东西/);
console.log('build contract: PASS');
```

- [ ] **Step 2: 运行验证器并确认因 `dist/index.html` 不存在而失败**

Run: `cd site && node scripts/verify-build.mjs`  
Expected: FAIL with `ENOENT` for `dist/index.html`.

- [ ] **Step 3: 创建最小 Astro 7 配置并安装必要本地依赖**

```json
{
  "name": "zuokun-personal-site",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "build": "astro build",
    "preview": "astro preview",
    "verify": "node scripts/verify-build.mjs"
  }
}
```

Run: `cd site && npm install astro@latest @astrojs/check@latest typescript@latest`

- [ ] **Step 4: 创建可构建的最小首页**

```astro
---
const title = '佐坤 · Zuokun Ouyang';
---
<html lang="zh-CN"><head><title>{title}</title></head><body><h1>研究增量，也创造新东西。</h1><p>佐坤</p></body></html>
```

- [ ] **Step 5: 运行 GREEN 验证**

Run: `cd site && npm run check && npm run build && npm run verify`  
Expected: all commands exit 0 and print `build contract: PASS`.

- [ ] **Step 6: Commit**

```bash
git add site/package.json site/package-lock.json site/astro.config.mjs site/tsconfig.json site/scripts/verify-build.mjs site/src/pages/index.astro
git commit -m "init: 搭建 Astro 静态站与构建契约"
```

### Task 2: 定义内容 schema 与结构化个人数据

**Files:**
- Create: `site/src/content.config.ts`
- Create: `site/src/data/profile.ts`
- Create: `site/src/data/navigation.ts`
- Create: `site/src/data/topics.ts`
- Create: `site/src/data/lab.ts`
- Create: `site/src/data/publications.ts`
- Create: `site/scripts/verify-content.mjs`

**Interfaces:**
- Produces: `profile`、`navigation`、`topics`、`labProjects`、`publications`；collections `posts`。

- [ ] **Step 1: 写失败的内容约束验证**

```js
// site/scripts/verify-content.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const profile = await readFile(new URL('../src/data/profile.ts', import.meta.url), 'utf8');
assert.match(profile, /nameZh:\s*['"]佐坤['"]/);
assert.doesNotMatch(profile, /左坤|ATER|Orléans/);
console.log('content contract: PASS');
```

- [ ] **Step 2: 确认验证器因数据文件不存在而失败**

Run: `cd site && node scripts/verify-content.mjs`  
Expected: FAIL with `ENOENT` for `src/data/profile.ts`.

- [ ] **Step 3: 定义 Astro 7 build-time collection**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    permalink: z.string(),
    category: z.enum(['方法与模型', '工程与实践', '阅读与思考', '历史归档']),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});
export const collections = { posts };
```

- [ ] **Step 4: 创建不含未确认职业字段的数据文件并运行 GREEN**

```ts
// site/src/data/profile.ts
export const profile = {
  nameZh: '佐坤',
  nameEn: 'Zuokun Ouyang',
  headline: '智能营销与因果推断算法工程师',
  statement: '研究增量，也创造新东西。',
  summary: '关注 Uplift Modeling、实验评估，也持续构建 AI 内容与效率工具。',
  links: {
    github: 'https://github.com/alainouyang',
    scholar: 'https://scholar.google.com/citations?user=-g8XCeAAAAAJ&hl=en',
    linkedin: 'https://www.linkedin.com/in/zuokun-ouyang/'
  }
} as const;
```

`navigation.ts` 固定输出首页、专题、文章、AI 实验室、研究、关于；`topics.ts` 固定输出因果推断与实验评估、Uplift Modeling 与增量决策、智能营销算法。职业、地点和邮箱字段在用户确认前不进入 `profile.ts`。

Run: `cd site && node scripts/verify-content.mjs && npm run check`  
Expected: `content contract: PASS` and Astro check exits 0.

- [ ] **Step 5: Commit**

```bash
git add site/src/content.config.ts site/src/data site/scripts/verify-content.mjs
git commit -m "feat: 建立个人资料与内容集合约束"
```

### Task 3: 实现全站设计系统和共享布局

**Files:**
- Create: `site/src/styles/tokens.css`
- Create: `site/src/styles/global.css`
- Create: `site/src/layouts/BaseLayout.astro`
- Create: `site/src/components/SEOHead.astro`
- Create: `site/src/components/SiteHeader.astro`
- Create: `site/src/components/SiteFooter.astro`
- Create: `site/src/components/PageIntro.astro`
- Create: `site/src/components/SectionHeading.astro`
- Create: `site/scripts/verify-design-system.mjs`

**Interfaces:**
- `BaseLayout` consumes `{ title, description, canonicalPath?, lang?, jsonLd? }` and wraps every route.
- CSS exposes `--color-bg`、`--color-surface`、`--color-text`、`--color-accent`、`--radius-card`、`--content-width`.

- [ ] **Step 1: 写失败的共享组件验证**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
for (const file of ['BaseLayout.astro','SiteHeader.astro','SiteFooter.astro','PageIntro.astro','SectionHeading.astro']) {
  await readFile(new URL(`../src/${file === 'BaseLayout.astro' ? 'layouts' : 'components'}/${file}`, import.meta.url), 'utf8');
}
const tokens = await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
for (const token of ['--color-bg','--color-surface','--color-text','--color-accent','--radius-card','--content-width']) assert.match(tokens, new RegExp(token));
console.log('design system contract: PASS');
```

- [ ] **Step 2: 确认因共享组件缺失而失败**

Run: `cd site && node scripts/verify-design-system.mjs`  
Expected: FAIL with `ENOENT`.

- [ ] **Step 3: 实现 token、全局排版和共享组件**

```css
/* site/src/styles/tokens.css */
:root {
  --color-bg: #18121e;
  --color-surface: #241b2b;
  --color-surface-raised: #2e2236;
  --color-text: #f5ede3;
  --color-muted: #b9a9bb;
  --color-accent: #f08a82;
  --color-accent-violet: #9b78ff;
  --radius-card: 1.25rem;
  --content-width: 70rem;
}
```

```astro
---
// site/src/layouts/BaseLayout.astro
import '../styles/tokens.css';
import '../styles/global.css';
import SEOHead from '../components/SEOHead.astro';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
const { title, description, canonicalPath = Astro.url.pathname, lang = 'zh-CN', jsonLd } = Astro.props;
---
<html lang={lang}>
  <head><SEOHead {title} {description} {canonicalPath} {jsonLd} /></head>
  <body>
    <SiteHeader />
    <main><slot /></main>
    <SiteFooter />
  </body>
</html>
```

所有子页面禁止自建第二套 header、footer 或颜色变量。

- [ ] **Step 4: 运行 GREEN 与构建**

Run: `cd site && node scripts/verify-design-system.mjs && npm run check && npm run build`  
Expected: contract PASS and build exit 0.

- [ ] **Step 5: Commit**

```bash
git add site/src/styles site/src/layouts site/src/components site/scripts/verify-design-system.mjs
git commit -m "feat: 建立全站统一视觉系统与布局组件"
```

### Task 4: 实现沉浸式首页首屏与 Bento 工作台

**Files:**
- Create: `site/src/components/ParticleHero.astro`
- Create: `site/src/components/BentoGrid.astro`
- Create: `site/src/components/TopicCard.astro`
- Create: `site/src/components/ArticleCard.astro`
- Create: `site/src/components/LabCard.astro`
- Modify: `site/src/pages/index.astro`
- Modify: `site/scripts/verify-build.mjs`

**Interfaces:**
- `ParticleHero` renders canvas, static fallback, typed phrases, and respects `prefers-reduced-motion`.
- `BentoGrid` accepts Astro slots and owns layout only.

- [ ] **Step 1: 扩展构建契约并确认失败**

```js
assert.match(html, /data-particle-hero/);
assert.match(html, /因果推断与 Uplift Modeling/);
assert.match(html, /AI 实验室/);
assert.match(html, /prefers-reduced-motion/);
```

Run: `cd site && npm run build && npm run verify`  
Expected: FAIL because the homepage lacks the new markers.

- [ ] **Step 2: 实现原生 Canvas 粒子、打字机降级和 Bento 卡片**

```astro
<!-- site/src/components/ParticleHero.astro -->
<section class="particle-hero" data-particle-hero>
  <canvas aria-hidden="true"></canvas>
  <div class="particle-hero__content">
    <p>你好，我是佐坤</p>
    <h1>研究增量，也创造新东西。</h1>
    <p data-typed-fallback>智能营销 · 因果推断 · Uplift Modeling · AI 应用</p>
  </div>
</section>
<script>
  const root = document.querySelector('[data-particle-hero]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (root && !reduceMotion) {
    const canvas = root.querySelector('canvas');
    const context = canvas.getContext('2d');
    const particles = Array.from({ length: 42 }, (_, index) => ({
      x: ((index * 47) % 101) / 100,
      y: ((index * 71) % 97) / 96,
      radius: 0.8 + (index % 4) * 0.45,
      phase: index * 0.37
    }));
    let frame = 0;
    let visible = true;
    const resize = () => {
      canvas.width = root.clientWidth * devicePixelRatio;
      canvas.height = root.clientHeight * devicePixelRatio;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    const draw = (time) => {
      context.clearRect(0, 0, root.clientWidth, root.clientHeight);
      for (const particle of particles) {
        const alpha = 0.24 + Math.sin(time / 1700 + particle.phase) * 0.12;
        context.fillStyle = `rgba(240, 138, 130, ${alpha})`;
        context.beginPath();
        context.arc(particle.x * root.clientWidth, particle.y * root.clientHeight, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      if (visible) frame = requestAnimationFrame(draw);
    };
    new ResizeObserver(resize).observe(root);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(draw);
    }).observe(root);
    resize();
    frame = requestAnimationFrame(draw);
  }
</script>
<style>
  @media (prefers-reduced-motion: reduce) {
    .particle-hero canvas { display: none; }
  }
</style>
```

`BentoGrid.astro` 只提供 grid 容器和 slot；首页传入核心专题、精选文章、AI 实验室、研究和 Now 卡片。粒子脚本只在首页加载，颜色从 CSS custom properties 读取。

- [ ] **Step 3: 运行 GREEN 并检查无控制台错误**

Run: `cd site && npm run check && npm run build && npm run verify`  
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add site/src/pages/index.astro site/src/components site/scripts/verify-build.mjs
git commit -m "feat: 实现沉浸式粒子首屏与 Bento 首页"
```

### Task 5: 实现共享视觉的核心子页面

**Files:**
- Create: `site/src/pages/topics/index.astro`
- Create: `site/src/pages/writing/index.astro`
- Create: `site/src/pages/lab/index.astro`
- Create: `site/src/pages/research/index.astro`
- Create: `site/src/pages/about/index.astro`
- Create: `site/src/pages/archive/index.astro`
- Create: `site/src/pages/404.astro`
- Create: `site/scripts/verify-routes.mjs`

**Interfaces:**
- Every page imports `BaseLayout`, `PageIntro`, and at least one `SectionHeading`.
- Primary output routes: `/topics/`、`/writing/`、`/lab/`、`/research/`、`/about/`、`/archive/`、`/404.html`.

- [ ] **Step 1: 写失败的路由与共享布局验证器**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const routes = ['topics/index.html','writing/index.html','lab/index.html','research/index.html','about/index.html','archive/index.html','404.html'];
for (const route of routes) {
  const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
  assert.match(html, /data-site-header/);
  assert.match(html, /data-page-intro/);
}
console.log('route contract: PASS');
```

- [ ] **Step 2: 确认构建后因页面缺失而失败**

Run: `cd site && npm run build && node scripts/verify-routes.mjs`  
Expected: FAIL on the first missing route.

- [ ] **Step 3: 用共享组件实现所有页面，禁止页面级自定义视觉变量**

```astro
---
// site/src/pages/topics/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageIntro from '../../components/PageIntro.astro';
import SectionHeading from '../../components/SectionHeading.astro';
import TopicCard from '../../components/TopicCard.astro';
import { topics } from '../../data/topics';
---
<BaseLayout title="专题 · 佐坤" description="因果推断、Uplift Modeling 与智能营销算法专题。">
  <PageIntro eyebrow="Topics" title="把预测推进到可验证的决策" description="围绕增量、实验和营销决策建立知识路径。" />
  <section class="section-shell">
    <SectionHeading number="01" title="核心专题" />
    <div class="card-grid">{topics.map((topic) => <TopicCard {topic} />)}</div>
  </section>
</BaseLayout>
```

其余页面的明确内容契约：`writing` 使用 PageIntro「文章」并展示精选文章与 Archive 入口；`lab` 使用 PageIntro「AI 实验室」并展示个人公开项目；`research` 使用 PageIntro「研究」并展示论文和博士研究；`about` 使用 PageIntro「关于」且只读取已确认资料；`archive` 使用 PageIntro「历史归档」并展示全部历史文章；`404` 使用 BaseLayout、PageIntro「页面没有找到」和返回首页／文章入口。

- [ ] **Step 4: 运行 GREEN**

Run: `cd site && npm run check && npm run build && node scripts/verify-routes.mjs`  
Expected: `route contract: PASS`.

- [ ] **Step 5: Commit**

```bash
git add site/src/pages site/scripts/verify-routes.mjs
git commit -m "feat: 实现统一视觉的核心子页面"
```

### Task 6: 迁移论文、静态资源和历史文章

**Files:**
- Create: `site/scripts/migrate-posts.mjs`
- Create: `site/scripts/verify-migration.mjs`
- Create mechanically: `site/src/content/posts/*.md`
- Copy mechanically: `site/public/images/*`、`site/public/files/*`
- Create: `site/src/pages/[...legacy].astro`

**Interfaces:**
- Migration script maps every `_posts/YYYY-MM-DD-title.md` to collection frontmatter with explicit `permalink`.
- Verification requires exactly 142 migrated posts and no fake publication titles.

- [ ] **Step 1: 写失败的迁移验证**

```js
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
const files = (await readdir(new URL('../src/content/posts/', import.meta.url))).filter((x) => x.endsWith('.md'));
assert.equal(files.length, 142);
for (const file of files) assert.match(await readFile(new URL(`../src/content/posts/${file}`, import.meta.url), 'utf8'), /permalink:/);
console.log('migration contract: PASS');
```

- [ ] **Step 2: 确认当前文章数量不足而失败**

Run: `cd site && node scripts/verify-migration.mjs`  
Expected: FAIL because 142 migrated posts do not exist.

- [ ] **Step 3: 实现并运行机械迁移脚本，复制二进制资源**

```js
// site/scripts/migrate-posts.mjs
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const source = new URL('../../_posts/', import.meta.url);
const target = new URL('../src/content/posts/', import.meta.url);
await mkdir(target, { recursive: true });
for (const name of (await readdir(source)).filter((file) => file.endsWith('.md'))) {
  const raw = await readFile(new URL(name, source), 'utf8');
  const date = name.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-/);
  if (!date) throw new Error(`Invalid post filename: ${name}`);
  const title = (raw.match(/^title:\s*(.+)$/m)?.[1] ?? name.replace(/\.md$/, '')).trim();
  const permalink = `/${date[1]}/${date[2].padStart(2, '0')}/${date[3].padStart(2, '0')}/${encodeURIComponent(name.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace(/\.md$/, ''))}/`;
  const body = raw.replace(/^---[\s\S]*?---\s*/, '');
  const frontmatter = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(title)}\npubDate: ${date[1]}-${date[2].padStart(2, '0')}-${date[3].padStart(2, '0')}\npermalink: ${JSON.stringify(permalink)}\ncategory: 历史归档\nfeatured: false\ndraft: false\n---\n\n`;
  await writeFile(new URL(name, target), frontmatter + body);
}
```

Run: `cd site && node scripts/migrate-posts.mjs && cp -R ../images/. public/images/ && cp -R ../files/. public/files/`

- [ ] **Step 4: 运行 GREEN 与生产构建**

Run: `cd site && node scripts/verify-migration.mjs && npm run check && npm run build`  
Expected: 142 posts, all explicit permalinks, build exit 0.

- [ ] **Step 5: Commit**

```bash
git add site/scripts site/src/content/posts site/src/pages site/public
git commit -m "feat: 迁移历史文章论文与静态资源"
```

### Task 7: 实现文章详情、SEO、RSS、sitemap 与 robots

**Files:**
- Create: `site/src/layouts/ArticleLayout.astro`
- Create: `site/src/pages/writing/[...id].astro`
- Create: `site/src/pages/rss.xml.ts`
- Create: `site/src/pages/sitemap.xml.ts`
- Create: `site/public/robots.txt`
- Create: `site/scripts/verify-seo.mjs`

**Interfaces:**
- `SEOHead` receives `jsonLd` and renders Person／Article／ScholarlyArticle JSON-LD.
- RSS and sitemap output XML with `https://alainouyang.github.io` absolute URLs.

- [ ] **Step 1: 写失败的 SEO 输出验证**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
for (const file of ['index.html','rss.xml','sitemap.xml','robots.txt']) await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(home, /application\/ld\+json/);
assert.match(home, /canonical/);
console.log('seo contract: PASS');
```

- [ ] **Step 2: 确认缺少 RSS／sitemap 输出而失败**

- [ ] **Step 3: 实现静态 SEO 和文章详情页**

```ts
// site/src/pages/rss.xml.ts
import { getCollection } from 'astro:content';
export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const items = posts.slice(0, 50).map(({ data }) => `<item><title><![CDATA[${data.title}]]></title><link>https://alainouyang.github.io${data.permalink}</link><pubDate>${data.pubDate.toUTCString()}</pubDate></item>`).join('');
  return new Response(`<?xml version="1.0"?><rss version="2.0"><channel><title>佐坤</title><link>https://alainouyang.github.io/</link>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
```

```ts
// site/src/pages/sitemap.xml.ts
import { getCollection } from 'astro:content';
const fixed = ['/', '/topics/', '/writing/', '/lab/', '/research/', '/about/', '/archive/'];
export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const urls = [...fixed, ...posts.map(({ data }) => data.permalink)];
  const entries = urls.map((path) => `<url><loc>https://alainouyang.github.io${path}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
```

`writing/[...id].astro` 使用 `getCollection('posts')`、`getStaticPaths()` 和 `render()`；`ArticleLayout` 复用 BaseLayout、PageIntro 和 SectionHeading，并输出 Article JSON-LD。

- [ ] **Step 4: 运行 GREEN**

Run: `cd site && npm run build && node scripts/verify-seo.mjs`  
Expected: `seo contract: PASS`.

- [ ] **Step 5: Commit**

```bash
git add site/src/layouts site/src/pages site/public/robots.txt site/scripts/verify-seo.mjs
git commit -m "feat: 完善文章详情与静态 SEO 输出"
```

### Task 8: 全量验证与视觉回归

**Files:**
- Create: `site/playwright.config.ts`
- Create: `site/tests/smoke.spec.ts`
- Create: `site/tests/visual.spec.ts`
- Modify: `site/package.json`
- Modify: `ROADMAP.md`

**Interfaces:**
- Smoke test covers homepage and all primary routes at desktop and 390px mobile viewport.
- Visual assertions confirm shared header, page intro, background, accent, card radius, and no horizontal overflow.

- [ ] **Step 1: 写 Playwright 冒烟测试并确认在预览服务未启动时失败**

```ts
import { test, expect } from '@playwright/test';
for (const path of ['/', '/topics/', '/writing/', '/lab/', '/research/', '/about/', '/archive/', '/404.html']) {
  test(`${path} shares the visual shell`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('[data-site-header]')).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(24, 18, 30)');
  });
}
```

- [ ] **Step 2: 安装本地测试依赖并配置 `webServer` 运行 `npm run preview`**

Run: `cd site && npm install -D @playwright/test@latest`

```ts
// site/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  webServer: { command: 'npm run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4321', reuseExistingServer: true },
  use: { baseURL: 'http://127.0.0.1:4321' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } }
  ]
});
```

- [ ] **Step 3: 运行完整验证**

Run: `cd site && npm run check && npm run build && npm run verify && node scripts/verify-content.mjs && node scripts/verify-design-system.mjs && node scripts/verify-routes.mjs && node scripts/verify-migration.mjs && node scripts/verify-seo.mjs && npx playwright test`  
Expected: all checks pass with 0 failures.

- [ ] **Step 4: 在真实浏览器中检查首页及全部子页面的桌面端和移动端截图**

逐页核对导航、页面 intro、编号章节、卡片、背景、强调色、间距、无横向溢出和 reduced-motion 降级；发现差异先写失败断言再修复。

- [ ] **Step 5: 更新 ROADMAP 最近验证并 Commit**

```bash
git add site ROADMAP.md
git commit -m "test: 验证全站路由内容与响应式视觉一致性"
```

### Task 9: 上线前审计与授权边界

**Files:**
- Modify: `ROADMAP.md`
- Do not create yet: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: 本地验证报告、待确认个人字段列表、发布源切换风险说明。

- [ ] **Step 1: 从完成标准逐项审计当前 `site/dist/` 证据**

Run: `cd site && npm run check && npm run build && npm run verify && node scripts/verify-content.mjs && node scripts/verify-design-system.mjs && node scripts/verify-routes.mjs && node scripts/verify-migration.mjs && node scripts/verify-seo.mjs && npx playwright test`  
Expected: every command exits 0, all route and responsive projects pass, and the generated output contains 142 historical posts plus primary routes.

- [ ] **Step 2: 确认 `.github/workflows`、旧 Jekyll 文件和 GitHub Pages 设置均未改变**

Run: `git status --short && git diff --name-only d6b7541..HEAD | rg '^\.github/|^_layouts/|^_includes/|^_sass/'`  
Expected: no output for protected paths.

- [ ] **Step 3: 报告本地完成状态并单独请求 CI/CD 与发布切换授权**

不得在该授权前创建 workflow、push、修改 Pages 设置或删除旧站。
