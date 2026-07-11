# Kzyo 编辑型极简主页改版实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Astro 深色 Bento 站点改造成以 Kzyo 为公开身份、使用霞鹜文楷与 Source Sans 3 的暖白编辑型极简个人主页。

**Architecture:** 保留现有路由、内容集合和静态部署方式，先收紧身份与构建契约，再替换全局 design tokens 和字体，最后把共享组件与各页面收敛成统一的文字列表。旧 Jekyll、个人图片文件、ParticleHero 和 BentoGrid 源文件不删除，只解除 Astro 生产页面对它们的引用。

**Tech Stack:** Astro 7、TypeScript 6、CSS、Node.js contract scripts、Fontsource Source Sans 3 variable、LXGW WenKai webfont、Playwright CLI、Lighthouse。

## Global Constraints

- 站内公开身份始终为 `Kzyo`；第一方页面、元数据、RSS 和文章作者不得显示真实姓名。
- 论文 bibliographic author、CV、论文 PDF、Google Scholar、LinkedIn 和 ORCID 允许保留真实姓名。
- Astro 生产站不展示或引用本人照片；旧文件保留，不执行删除。
- 中文使用 LXGW WenKai，西文使用 Source Sans 3；字体通过构建自托管，不产生运行时第三方字体请求。
- 视觉使用暖白背景、深灰正文、单一低饱和强调色、细分隔线和紧凑文字列表。
- 删除生产页面中的粒子、打字机、渐变光晕、Bento 大卡片、装饰性编号和非必要动效。
- 保持现有公开路径、142 篇历史文章、RSS、sitemap、404、canonical 与内部链接兼容。
- 不新增 CMS、搜索、评论、analytics、动态筛选或主题切换器。
- 不修改 `.github/workflows/deploy.yml`，不 push，不发布。

## File Structure

- `site/src/data/profile.ts`：Kzyo 第一方身份、职业定位与保留外链的唯一来源。
- `site/src/styles/tokens.css`：暖白编辑型颜色、排版、宽度与间距 tokens。
- `site/src/styles/global.css`：字体导入、基础排版、列表与可访问性交互规则。
- `site/src/components/{SiteHeader,SiteFooter,PageIntro,SectionHeading}.astro`：全站编辑型壳层。
- `site/src/components/{TopicCard,ArticleCard,LabCard}.astro`：保留组件接口，视觉改为紧凑列表行。
- `site/src/pages/index.astro`：简短开场、当前关注、精选内容、正在构建与研究资料。
- `site/src/pages/{topics,writing,lab,research,about,archive}/index.astro`：栏目页编辑型列表布局。
- `site/src/layouts/ArticleLayout.astro`：Kzyo 作者信息与窄栏文章阅读样式。
- `site/src/components/SEOHead.astro`、`site/src/pages/rss.xml.ts`：Kzyo 站点级 SEO 与 RSS。
- `site/public/images/og-kzyo.svg`：不含照片的纯文字社交分享图。
- `site/scripts/verify-*.mjs`：身份、视觉、路由、SEO 与生产输出回归契约。
- `ROADMAP.md`：仅在全部验证通过后记录实施结果。

---

### Task 1: 建立 Kzyo 身份与隐私回归契约

**Files:**
- Modify: `site/scripts/verify-content.mjs`
- Modify: `site/scripts/verify-seo.mjs`
- Modify: `site/src/data/profile.ts`
- Modify: `site/src/components/SEOHead.astro`
- Modify: `site/src/layouts/ArticleLayout.astro`
- Modify: `site/src/pages/rss.xml.ts`
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/pages/topics/index.astro`
- Modify: `site/src/pages/writing/index.astro`
- Modify: `site/src/pages/lab/index.astro`
- Modify: `site/src/pages/research/index.astro`
- Modify: `site/src/pages/about/index.astro`
- Modify: `site/src/pages/archive/index.astro`
- Create: `site/public/images/og-kzyo.svg`

**Interfaces:**
- Produces: `profile.id`, `profile.headline`, `profile.statement`, `profile.summary`, `profile.focus`, `profile.links`。
- Preserves: `publications[].authors` 的真实 bibliographic data 与全部外链 URL。

- [ ] **Step 1: 先把身份契约改成预期状态**

在 `verify-content.mjs` 中断言 `profile.id === Kzyo` 的源码表示，扫描 Astro 第一方 UI 文件不得出现真实姓名，但排除 `src/data/publications.ts`：

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const profile = await readFile(new URL('../src/data/profile.ts', import.meta.url), 'utf8');
assert.match(profile, /id:\s*['"]Kzyo['"]/);
assert.doesNotMatch(profile, /nameZh|nameEn|佐坤|左坤|Zuokun Ouyang/);

for (const path of [
  'components/SEOHead.astro', 'components/SiteHeader.astro', 'components/SiteFooter.astro',
  'layouts/ArticleLayout.astro', 'pages/index.astro', 'pages/topics/index.astro',
  'pages/writing/index.astro', 'pages/lab/index.astro', 'pages/about/index.astro',
  'pages/archive/index.astro', 'pages/rss.xml.ts'
]) {
  const source = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /佐坤|左坤|Zuokun Ouyang/);
}

console.log('content contract: PASS');
```

在 `verify-seo.mjs` 增加：

```js
assert.match(home, /<title>Kzyo<\/title>/);
assert.match(home, /og:site_name" content="Kzyo"/);
assert.doesNotMatch(home, /profile\.png|佐坤|Zuokun Ouyang/);
assert.match(rss, /<title>Kzyo<\/title>/);
```

- [ ] **Step 2: 运行契约并确认当前实现失败**

Run: `cd site && npm run verify:content && npm run build && npm run verify:seo`

Expected: FAIL，至少命中旧 `nameZh`、旧站点标题或 `profile.png`。

- [ ] **Step 3: 将第一方身份收敛到 Kzyo**

把 `profile.ts` 改为：

```ts
export const profile = {
  id: 'Kzyo',
  headline: '营销增长、因果推断与 AI 应用',
  statement: '研究增长为何发生，也用 AI 构建工具与内容产品。',
  summary: '关注营销增长、因果推断与 Uplift Modeling，也持续构建 AI 内容、播客与个人效率工具。',
  focus: ['营销增长', '因果推断', 'Uplift Modeling', 'AI 应用'],
  links: {
    github: 'https://github.com/alainouyang',
    scholar: 'https://scholar.google.com/citations?user=-g8XCeAAAAAJ&hl=en',
    linkedin: 'https://www.linkedin.com/in/zuokun-ouyang/',
    orcid: 'https://orcid.org/0000-0002-9728-5158'
  }
} as const;
```

同步修改：

- `SEOHead.astro`：`siteName = 'Kzyo'`，页面标题为首页 `Kzyo`、内页 `${title} · Kzyo`，默认分享图为 `/images/og-kzyo.svg`，主题色改为 `#f4f0e8`。
- `ArticleLayout.astro`：第一方 `Article.author.name` 改为 `Kzyo`，移除 `alternateName`。
- `rss.xml.ts`：channel title 改为 `Kzyo`。
- 全部页面 description 和第一方标题中的旧姓名改为 `Kzyo`。
- `research/index.astro` 继续从 `publications.ts` 生成真实论文作者信息，不改论文数据。

创建纯文字分享图：

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f4f0e8"/>
  <text x="96" y="322" fill="#24231f" font-family="Arial, sans-serif" font-size="112" font-weight="600">Kzyo</text>
  <text x="102" y="392" fill="#6f6b62" font-family="Arial, sans-serif" font-size="30">Growth · Causal Inference · AI</text>
</svg>
```

- [ ] **Step 4: 运行身份与 SEO 契约**

Run: `cd site && npm run verify:content && npm run build && npm run verify:seo`

Expected: 三个命令均输出 `PASS` 或构建成功；论文页仍包含 `publications.ts` 中的真实作者。

- [ ] **Step 5: 提交身份边界**

```bash
git add site/src/data/profile.ts site/src/components/SEOHead.astro site/src/layouts/ArticleLayout.astro site/src/pages site/public/images/og-kzyo.svg site/scripts/verify-content.mjs site/scripts/verify-seo.mjs
git commit -m "feat: 将站内身份统一为 Kzyo 并移除个人照片元数据"
```

### Task 2: 安装自托管字体并替换全局设计系统

**Files:**
- Modify: `site/package.json`
- Modify: `site/package-lock.json`
- Modify: `site/src/layouts/BaseLayout.astro`
- Modify: `site/src/styles/tokens.css`
- Modify: `site/src/styles/global.css`
- Modify: `site/scripts/verify-design-system.mjs`

**Interfaces:**
- Produces CSS tokens: `--font-latin`, `--font-cjk`, `--color-bg`, `--color-text`, `--color-muted`, `--color-accent`, `--content-width`, `--reading-width`。
- Dependencies: `@fontsource-variable/source-sans-3` 与 `lxgw-wenkai-webfont`，仅提供构建期本地字体资源。

- [ ] **Step 1: 把设计系统契约改成暖白与双字体**

在 `verify-design-system.mjs` 增加：

```js
assert.match(tokens, /color-scheme:\s*light/);
assert.match(tokens, /--font-latin:\s*"Source Sans 3 Variable"/);
assert.match(tokens, /--font-cjk:\s*"LXGW WenKai"/);
assert.doesNotMatch(tokens, /gradient-accent|accent-violet|shadow-card/);

const globalCss = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(globalCss, /font-synthesis:\s*none/);
assert.doesNotMatch(globalCss, /radial-gradient|fractalNoise/);
```

- [ ] **Step 2: 运行契约并确认失败**

Run: `cd site && npm run verify:design`

Expected: FAIL，提示缺少 light color scheme 或仍存在 gradient tokens。

- [ ] **Step 3: 安装两个字体资源包**

Run: `cd site && npm install @fontsource-variable/source-sans-3 lxgw-wenkai-webfont`

Expected: `package.json` 和 lockfile 增加两项依赖，无安装错误。

选择理由：Fontsource 的 Source Sans 3 提供当前维护的 variable WOFF2；霞鹜文楷官方项目指向 webfont 包，包内按 Unicode range 拆分 WOFF2。不能使用只声明 Latin subset 的 `@fontsource/lxgw-wenkai` 作为中文正文来源。

- [ ] **Step 4: 在根布局导入必要字体**

在 `BaseLayout.astro` 的全局样式 import 前加入：

```ts
import '@fontsource-variable/source-sans-3/wght.css';
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css';
import '../styles/global.css';
```

不导入霞鹜文楷 light、bold、mono，避免无用资源。

- [ ] **Step 5: 用暖白编辑型 tokens 替换旧 tokens**

`tokens.css` 至少包含：

```css
:root {
  color-scheme: light;
  --color-bg: #f4f0e8;
  --color-surface: #f8f5ef;
  --color-text: #24231f;
  --color-muted: #6f6b62;
  --color-subtle: #969086;
  --color-border: #d8d2c7;
  --color-border-strong: #aaa399;
  --color-accent: #9b4f3f;
  --content-width: 64rem;
  --reading-width: 45rem;
  --gutter: clamp(1.1rem, 4vw, 2.5rem);
  --section-space: clamp(4rem, 8vw, 7rem);
  --font-latin: "Source Sans 3 Variable", "Helvetica Neue", Arial, sans-serif;
  --font-cjk: "LXGW WenKai", "Kaiti SC", "STKaiti", serif;
  --font-body: var(--font-latin), var(--font-cjk);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

`global.css` 删除噪点、背景 radial gradients、通用大卡片阴影和渐变按钮；正文使用 `var(--font-body)` 与 `font-synthesis: none`。保留 skip link、focus-visible、reduced-motion、代码块和响应式基础能力。

- [ ] **Step 6: 运行设计、类型与构建验证**

Run: `cd site && npm run verify:design && npm run check && npm run build`

Expected: design contract `PASS`，Astro check 为 0 error，构建成功。

- [ ] **Step 7: 提交字体与 tokens**

```bash
git add site/package.json site/package-lock.json site/src/layouts/BaseLayout.astro site/src/styles site/scripts/verify-design-system.mjs
git commit -m "feat: 引入文楷与 Source Sans 并切换暖白设计系统"
```

### Task 3: 将共享组件改成编辑型列表语言

**Files:**
- Modify: `site/src/components/SiteHeader.astro`
- Modify: `site/src/components/SiteFooter.astro`
- Modify: `site/src/components/PageIntro.astro`
- Modify: `site/src/components/SectionHeading.astro`
- Modify: `site/src/components/TopicCard.astro`
- Modify: `site/src/components/ArticleCard.astro`
- Modify: `site/src/components/LabCard.astro`
- Modify: `site/scripts/verify-design-system.mjs`

**Interfaces:**
- Preserves existing Astro component props so pages can migrate incrementally。
- Produces rendered markers: `data-editorial-header`、`data-editorial-row`。

- [ ] **Step 1: 增加共享组件结构契约**

在 `verify-design-system.mjs` 中读取三个 row 组件并断言：

```js
for (const file of ['TopicCard.astro', 'ArticleCard.astro', 'LabCard.astro']) {
  const source = await readFile(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
  assert.match(source, /data-editorial-row/);
  assert.doesNotMatch(source, /surface-card|min-height:\s*(?:19|20|21|22|25|28)rem|gradient/);
}
```

- [ ] **Step 2: 运行契约并确认失败**

Run: `cd site && npm run verify:design`

Expected: FAIL，旧 card 组件缺少 `data-editorial-row`。

- [ ] **Step 3: 收敛 Header、Footer、PageIntro 和 SectionHeading**

- Header 品牌只显示 `Kzyo`，移除中文单字 mark、双行真实姓名和模糊深色背景。
- 桌面导航保持现有链接；移动导航继续使用按钮与 `aria-expanded`，背景改为不透明暖白。
- Footer 使用 `profile.statement` 与 `© year Kzyo`，保留归档、RSS 与外链。
- PageIntro 的桌面标题上限降为 4rem，删除渐变线段，只保留整条细线。
- SectionHeading 保留 `number` prop 兼容旧调用，但不渲染编号；标题上限约 2.25rem。

- [ ] **Step 4: 将三个 Card 组件改成统一行结构**

共同结构遵循：

```astro
<article class="editorial-row" data-editorial-row>
  <div class="editorial-row__meta">类型／日期／状态</div>
  <div class="editorial-row__content">
    <h3>标题</h3>
    <p>简短描述</p>
  </div>
  <div class="editorial-row__action">链接或标签</div>
</article>
```

桌面端使用三列 `8rem minmax(0, 1fr) auto`，移动端自然堆叠；只有上下 1px 边线，无背景填充、阴影和大圆角。保留 TopicCard 的问题列表、ArticleCard 的链接、LabCard 的状态和 tags，但压缩为一行或可换行文字。

- [ ] **Step 5: 运行共享组件验证**

Run: `cd site && npm run verify:design && npm run check && npm run build`

Expected: contract `PASS`、Astro check 0 error、构建成功。

- [ ] **Step 6: 提交共享组件**

```bash
git add site/src/components site/scripts/verify-design-system.mjs
git commit -m "refactor: 将共享组件收敛为编辑型列表布局"
```

### Task 4: 重建首页并解除 ParticleHero 与 BentoGrid 生产依赖

**Files:**
- Modify: `site/scripts/verify-build.mjs`
- Modify: `site/src/pages/index.astro`

**Interfaces:**
- Consumes: `profile`、`topics`、`labProjects`、`getCollection('posts')`、三个 editorial row 组件。
- Produces: 首页区块 `intro`、`focus`、`selected`、`building`、`research`。

- [ ] **Step 1: 把首页构建契约改成新结构**

`verify-build.mjs` 改为：

```js
assert.match(html, /Kzyo/);
assert.match(html, /研究增长为何发生/);
assert.match(html, /data-home-intro/);
assert.match(html, /data-editorial-row/);
assert.match(html, /增长与因果/);
assert.match(html, /AI 项目/);
assert.doesNotMatch(html, /data-particle-hero|<canvas|bento-grid|profile\.png|佐坤|Zuokun Ouyang/);
assert.match(html, /prefers-reduced-motion/);
```

- [ ] **Step 2: 运行新首页契约并确认失败**

Run: `cd site && npm run build && npm run verify`

Expected: FAIL，旧首页仍包含 particle hero 或 Bento。

- [ ] **Step 3: 重写首页内容流**

`index.astro`：

- 删除 `ParticleHero`、`BentoGrid` 与所有渐变 closing block import 和 markup。
- 使用 `getCollection` 取最近 5 篇非 draft 文章。
- 开场显示 `Kzyo`、`profile.statement`、`profile.summary`，并提供文章与关于链接。
- 当前关注映射三个 topics 为紧凑 TopicCard 行。
- 精选内容映射最近文章为 ArticleCard 行，并保留研究入口。
- 正在构建映射 labProjects 为 LabCard 行。
- 研究资料使用一行纯文本入口连接 `/research/`。
- 所有 section 只以留白和细线分隔。

- [ ] **Step 4: 运行首页契约**

Run: `cd site && npm run check && npm run build && npm run verify`

Expected: Astro check 0 error，build 成功，`build contract: PASS`。

- [ ] **Step 5: 提交首页**

```bash
git add site/src/pages/index.astro site/scripts/verify-build.mjs
git commit -m "refactor: 以编辑型内容流重建 Kzyo 首页"
```

### Task 5: 将栏目页和文章详情统一为极简样式

**Files:**
- Modify: `site/src/pages/topics/index.astro`
- Modify: `site/src/pages/writing/index.astro`
- Modify: `site/src/pages/lab/index.astro`
- Modify: `site/src/pages/research/index.astro`
- Modify: `site/src/pages/about/index.astro`
- Modify: `site/src/pages/archive/index.astro`
- Modify: `site/src/layouts/ArticleLayout.astro`
- Modify: `site/scripts/verify-routes.mjs`

**Interfaces:**
- Preserves all route paths and content data。
- Produces each route with shared header、page intro、section heading and list markers。

- [ ] **Step 1: 增加路由级极简契约**

在 `verify-routes.mjs` 的每个 route 循环内增加：

```js
assert.match(html, /Kzyo/);
assert.doesNotMatch(html, /gradient-accent|data-particle-hero|profile\.png|佐坤|Zuokun Ouyang/);
```

对 `about/index.html` 额外断言：

```js
const about = await readFile(new URL('../dist/about/index.html', import.meta.url), 'utf8');
assert.doesNotMatch(about, /about-profile__monogram|<img/);
```

对 `research/index.html` 断言真实 bibliographic author 仍存在：

```js
const research = await readFile(new URL('../dist/research/index.html', import.meta.url), 'utf8');
assert.match(research, /Zuokun Ouyang/);
```

- [ ] **Step 2: 运行路由契约并确认失败**

Run: `cd site && npm run build && npm run verify:routes`

Expected: FAIL，至少 about 仍存在 monogram 或其他页面仍含旧视觉类。

- [ ] **Step 3: 重构专题、文章与实验室页面**

- `topics`：TopicCard 列表＋三步方法列表，取消 card grid 和编号方块。
- `writing`：ArticleCard 时间列表＋四项内容地图文字行，预留 `article`／`podcast`／`note` 标签样式，不创建空播客栏目。
- `lab`：LabCard 状态列表＋三条实验原则，取消三列大卡片。

- [ ] **Step 4: 重构研究、关于与归档页面**

- `research`：保留真实作者与 DOI／PDF，研究文件改为两行文字入口。
- `about`：只显示 Kzyo，删除带「佐」字的 monogram；保留三段职业说明、当前关注和外链。
- `archive`：保留 142 篇历史文章，列表编号改为年份／日期元信息，不使用装饰性序号。

- [ ] **Step 5: 收敛文章详情阅读样式**

`ArticleLayout.astro` 保持 45rem 阅读宽度；标题、正文、引用、代码、表格和图片改用暖白系统变量。正文中文继承文楷，代码继续使用系统 monospace。移除正文中的装饰性章节编号，但保留返回归档／文章链接。

- [ ] **Step 6: 运行栏目与文章验证**

Run: `cd site && npm run check && npm run build && npm run verify:routes && npm run verify:migration && npm run verify:links`

Expected: Astro check 0 error；route、migration、link contract 全部 `PASS`。

- [ ] **Step 7: 提交栏目页**

```bash
git add site/src/pages site/src/layouts/ArticleLayout.astro site/scripts/verify-routes.mjs
git commit -m "refactor: 统一栏目页与文章详情的极简阅读体验"
```

### Task 6: 全站验证、视觉验收与路线图

**Files:**
- Modify: `ROADMAP.md`
- Test only: `site/dist/**`

**Interfaces:**
- Consumes: 所有前序任务产物。
- Produces: 可审阅的本地构建、桌面与移动截图、完整验证记录。

- [ ] **Step 1: 扫描生产源码中的身份与旧视觉残留**

Run:

```bash
rg -n '佐坤|左坤|Zuokun Ouyang|profile\.png|ParticleHero|BentoGrid|gradient-accent' site/src \
  -g '!data/publications.ts'
```

Expected: 无输出。若论文页 Astro 源码因显式验收字符串出现真实姓名，改为从 publication data 验证，保证第一方 UI 源码扫描为零。

- [ ] **Step 2: 运行完整自动化验证**

Run: `cd site && npm run verify:all`

Expected: Astro check 0 error／0 warning／0 hint；构建 150 个页面；全部 contract 输出 `PASS`。

- [ ] **Step 3: 启动本地预览并做浏览器验收**

Run: `cd site && npm run preview -- --host 127.0.0.1`

使用 Playwright CLI 检查 `/`、`/topics/`、`/writing/`、`/lab/`、`/research/`、`/about/`、`/archive/` 和代表性文章：

- 桌面 `1440×900` 与移动 `390×844`。
- 页面无横向溢出。
- 移动导航可打开、关闭和跳转。
- 控制台 0 error／0 warning。
- 首页无 canvas、个人照片、大卡片、渐变或过大标题。
- computed font family 同时包含 Source Sans 3 与 LXGW WenKai。
- Network 中字体请求来自本地站点，不出现第三方字体域名。

- [ ] **Step 4: 运行 Lighthouse**

Run: `npx lighthouse http://127.0.0.1:4321/ --output=json --output-path=/tmp/kzyo-lighthouse.json --chrome-flags='--headless'`

Expected: Performance、Accessibility、Best Practices、SEO 均不低于 0.90；无阻塞性的字体布局偏移问题。

- [ ] **Step 5: 更新路线图**

仅在 Steps 1 至 4 全部通过后，把改版从“进行中”移到“已完成”，记录：

- Kzyo 身份与照片引用检查结果。
- 字体来源与自托管验证。
- `verify:all` 实际结果。
- 桌面／移动视觉检查结果。
- Lighthouse 四项实际分数。

- [ ] **Step 6: 提交验证记录**

```bash
git add ROADMAP.md
git commit -m "docs: 记录 Kzyo 极简站点全量验证结果"
```

- [ ] **Step 7: 最终工作区检查**

Run: `git status --short && git log -7 --oneline`

Expected: 仅保留用户已有且未纳入任务的 `.superpowers/`；本次实现形成分阶段中文 commits；未 push、未修改 workflow、未删除文件。
