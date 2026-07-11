# Kzyo 每日简报独立子站实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在独立仓库 `AlainOUYANG/digest` 建每日 AI 简报子站，发布到 `https://alainouyang.github.io/digest`，每天自动聚合三类源并生成中文摘要。

**Architecture:** 轻量 Astro 7 静态站（复用 Kzyo 暖白编辑型 tokens）+ 自研 Node 流水线（RSS 抓取 → 时间窗过滤 → 火山引擎方舟评分摘要 → 生成当期 markdown）+ 两条 GitHub Actions（push 部署、每日定时生成）。即刻源经 RSSHub 服务容器抓取。

**Tech Stack:** Astro 7、@astrojs/rss、rss-parser（唯一新增运行依赖，标准库无法可靠解析 XML）、node:test、playwright-core（devDep，验收用）、GitHub Actions + Pages。

## Global Constraints

- 站点身份为 `Kzyo`；不出现真名变体、个人照片、雇主与公司业务信息。
- 每条简报条目必须是「摘要 + 作者署名 + 原文链接」，不全文转载。
- 不复制 `vigorX777/ai-daily-digest` 的任何代码（无 License），只提取其 RSS 源 URL 列表。
- 本地开发目录 `~/digest`；spec 见主站仓库 `docs/superpowers/specs/2026-07-11-digest-subsite-design.md`。
- Commit 中文、前缀 `init:/feat:/fix:/docs:/chore:/content:`，不加 Co-Authored-By。
- LLM 凭证只经环境变量（`ARK_API_KEY`、`ARK_MODEL`、`ARK_BASE_URL`），不进代码与日志。
- 每日定时 cron 在用户目检首期并确认后才启用；此前 `digest.yml` 仅 `workflow_dispatch`。

---

### Task 1: 仓库脚手架与设计系统

**Files:**
- Create: `~/digest/package.json`, `astro.config.mjs`, `.gitignore`, `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`（占位）

**Interfaces:**
- Produces: `Base.astro`，props `{ title: string, description: string }`，含页头（Kzyo · 每日简报，导航：最新／归档／主站）、页脚、字体导入。

- [ ] **Step 1: 初始化仓库与依赖**

```bash
mkdir ~/digest && cd ~/digest && git init
npm init -y
npm i astro @astrojs/rss rss-parser lxgw-wenkai-webfont @fontsource-variable/source-sans-3
npm i -D playwright-core
```

`package.json` scripts 改为：

```json
{
  "dev": "ASTRO_TELEMETRY_DISABLED=1 astro dev",
  "build": "ASTRO_TELEMETRY_DISABLED=1 astro build",
  "preview": "ASTRO_TELEMETRY_DISABLED=1 astro preview",
  "test": "node --test scripts/test/",
  "verify": "node scripts/verify-issues.mjs",
  "digest": "node scripts/run-digest.mjs"
}
```

`.gitignore`：`node_modules/`、`dist/`、`.astro/`、`.env*`、`.DS_Store`。

- [ ] **Step 2: astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alainouyang.github.io',
  base: '/digest',
  trailingSlash: 'always',
});
```

- [ ] **Step 3: 设计系统**

从主站复制 `site/src/styles/tokens.css` 到 `src/styles/tokens.css`（原样保留暖白 tokens）。`src/styles/global.css` 写极简全局样式：暖白背景、窄阅读宽度（`max-width: 42rem`）、细分隔线，引用 tokens 变量，不引入主站的组件级样式。

- [ ] **Step 4: Base.astro 与占位首页**

`src/layouts/Base.astro`：导入两个字体包 CSS 与 global.css，`<header>` 站名「Kzyo · 每日简报」+ 导航（最新 `${base}/`、归档 `${base}/archive/`、主站 `https://alainouyang.github.io/`），`<footer>` 版权 `© Kzyo` 与 RSS 链接。`src/pages/index.astro` 暂输出「首期尚未生成」。

- [ ] **Step 5: 验证构建并提交**

```bash
npm run build
```

Expected: 构建成功。

```bash
git add -A && git commit -m "init: 搭建简报子站 Astro 骨架与暖白设计系统"
```

---

### Task 2: 内容集合、页面与构建契约

**Files:**
- Create: `src/content.config.ts`, `src/content/issues/2026-07-11.md`（样例，后续被真实首期覆盖或删除）, `src/pages/index.astro`（重写）, `src/pages/archive/index.astro`, `src/pages/issues/[id].astro`, `src/pages/rss.xml.js`, `scripts/verify-issues.mjs`

**Interfaces:**
- Produces: `issues` collection，frontmatter `{ title: string, date: Date, issue: number, unavailableSources: string[] }`，正文为三个 `## 栏目名` 段落的 markdown。文件名 `YYYY-MM-DD.md` 即条目 id。

- [ ] **Step 1: 集合 schema**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const issues = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/issues' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    issue: z.number().int().positive(),
    unavailableSources: z.array(z.string()).default([]),
  }),
});

export const collections = { issues };
```

- [ ] **Step 2: 写样例期刊**（含三栏目、两条带署名链接的条目），用于开发期页面渲染与契约测试。

- [ ] **Step 3: 页面**

- `index.astro`：取 date 最大的一期，渲染 `<Content />`，顶部期号+日期，底部「查看归档」。
- `archive/index.astro`：全部期数按日期倒序的列表行（期号、日期、链接）。
- `issues/[id].astro`：`getStaticPaths` 遍历集合，渲染单期。
- `rss.xml.js`：用 `@astrojs/rss` 输出全部期，link 指向 `/digest/issues/<id>/`。

- [ ] **Step 4: 构建契约 `scripts/verify-issues.mjs`**

遍历 `src/content/issues/*.md`：frontmatter 必含 title/date/issue；正文必含三个 `## `；每个 `- **[` 条目行必须含 markdown 链接和 ` — `（署名分隔符）。违规则 `process.exit(1)`。

- [ ] **Step 5: 验证并提交**

```bash
npm run build && npm run verify
```

Expected: 均通过。

```bash
git add -A && git commit -m "feat: 期刊内容集合、三个页面、RSS 与构建契约"
```

---

### Task 3: 三组源配置文件

**Files:**
- Create: `config/feeds-ai.json`, `config/feeds-causal.json`, `config/jike-users.json`, `config/sections.json`

**Interfaces:**
- Produces: feeds 文件格式 `[{ "name": "...", "url": "https://..." }]`；`jike-users.json` 格式 `[{ "id": "<uuid>", "name": "..." }]`（本任务先提交空数组，Task 7 填充）；`sections.json` 定义三栏目 `{ key, name, focus, topN }`。

- [ ] **Step 1: 提取 vigorX777 源列表**

```bash
curl -s https://raw.githubusercontent.com/vigorX777/ai-daily-digest/main/scripts/digest.ts -o /tmp/digest.ts
node -e "const s=require('fs').readFileSync('/tmp/digest.ts','utf8');const urls=[...new Set(s.match(/https?:\/\/[^'\"\s]+/g))].filter(u=>/(rss|feed|atom|xml)/i.test(u));console.log(JSON.stringify(urls,null,2))"
```

人工核对输出为 RSS 源（剔除文档链接），整理为 `feeds-ai.json`。若提取路径失效，改为打开该文件人工摘录。

- [ ] **Step 2: 拟定因果推断/营销科学初始源** 写入 `feeds-causal.json`：arXiv `https://rss.arxiv.org/rss/stat.ME`、`https://rss.arxiv.org/rss/econ.EM`，加 Gelman 博客 `https://statmodeling.stat.columbia.edu/feed/`、Pearl 博客 `http://causality.cs.ucla.edu/blog/index.php/feed/` 等约 6–8 个，逐个 `curl -sI` 确认可达，不可达的剔除。

- [ ] **Step 3: sections.json**

```json
[
  { "key": "ai", "name": "AI 技术博客", "focus": "AI/LLM 应用、工程实践与行业动态", "topN": 8, "feeds": "feeds-ai.json" },
  { "key": "causal", "name": "因果推断与营销科学", "focus": "因果推断、Uplift Modeling、实验设计与营销科学", "topN": 6, "feeds": "feeds-causal.json" },
  { "key": "jike", "name": "即刻简报", "focus": "AI 工具、独立开发与增长的一手观察", "topN": 8, "feeds": null }
]
```

- [ ] **Step 4: 提交**

```bash
git add config && git commit -m "feat: 三组信息源配置与栏目定义"
```

---

### Task 4: 抓取与过滤模块

**Files:**
- Create: `scripts/lib/feeds.mjs`, `scripts/test/feeds.test.mjs`

**Interfaces:**
- Produces: `withinWindow(item, now, hours)`、`normalizeItem(raw, sourceName)`、`fetchGroup(feeds, {now, hours})` → `{ items: NormalizedItem[], failed: string[] }`；`NormalizedItem = { title, link, author, source, snippet, isoDate }`。

- [ ] **Step 1: 先写失败测试 `feeds.test.mjs`**

用 node:test 覆盖：`withinWindow` 对 25 小时前/1 小时前/未来时间/无日期的判定；`normalizeItem` 的 author 回退到 sourceName、snippet 截断 500 字。

- [ ] **Step 2: 运行确认失败** `npm test` → FAIL（模块不存在）。

- [ ] **Step 3: 实现 `feeds.mjs`**

```js
import Parser from 'rss-parser';

const parser = new Parser({ timeout: 15000 });

export function withinWindow(item, now = new Date(), hours = 24) {
  const t = item.isoDate ? Date.parse(item.isoDate) : NaN;
  if (Number.isNaN(t)) return false;
  const age = now.getTime() - t;
  return age >= 0 && age <= hours * 3600 * 1000;
}

export function normalizeItem(raw, sourceName) {
  return {
    title: (raw.title ?? '').trim(),
    link: raw.link ?? '',
    author: raw.creator || raw.author || sourceName,
    source: sourceName,
    snippet: (raw.contentSnippet ?? '').slice(0, 500),
    isoDate: raw.isoDate ?? null,
  };
}

export async function fetchGroup(feeds, { now = new Date(), hours = 24 } = {}) {
  const items = [];
  const failed = [];
  const results = await Promise.allSettled(
    feeds.map((f) => parser.parseURL(f.url).then((p) => p.items.map((i) => normalizeItem(i, f.name)))),
  );
  results.forEach((r, idx) => {
    if (r.status === 'fulfilled') {
      items.push(...r.value.filter((i) => i.title && i.link && withinWindow(i, now, hours)));
    } else {
      failed.push(feeds[idx].name);
    }
  });
  return { items, failed };
}
```

- [ ] **Step 4: 测试通过后提交**

```bash
npm test
git add scripts && git commit -m "feat: RSS 抓取、归一化与 24 小时时间窗过滤"
```

---

### Task 5: LLM 评分与摘要模块

**Files:**
- Create: `scripts/lib/llm.mjs`, `scripts/lib/select.mjs`, `scripts/test/select.test.mjs`

**Interfaces:**
- Consumes: `NormalizedItem`（Task 4）。
- Produces: `createClient(env)` → `chat(messages) => Promise<string>`；`extractJson(text)`；`selectAndSummarize(chat, section, items)` → `{ picks: (NormalizedItem & {summary})[], degraded: boolean }`，section 即 `sections.json` 条目。

- [ ] **Step 1: 先写失败测试 `select.test.mjs`**

覆盖：`extractJson` 解析裸 JSON、```json 围栏、混杂文字三种回复；`selectAndSummarize` 注入 fake chat（返回固定评分与摘要 JSON）验证按分取 topN 且摘要拼接；fake chat 连续抛错时 `degraded: true` 且 picks 按时间取前 topN、summary 为空串。

- [ ] **Step 2: 运行确认失败** `npm test` → FAIL。

- [ ] **Step 3: 实现**

`llm.mjs`：

```js
export function createClient(env = process.env) {
  const baseUrl = env.ARK_BASE_URL ?? 'https://ark.cn-beijing.volces.com/api/v3';
  const apiKey = env.ARK_API_KEY;
  const model = env.ARK_MODEL;
  if (!apiKey || !model) throw new Error('需要 ARK_API_KEY 与 ARK_MODEL 环境变量');
  return async function chat(messages) {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, temperature: 0.3 }),
    });
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    return (await res.json()).choices[0].message.content;
  };
}
```

`select.mjs`：

```js
export function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('LLM 回复中没有 JSON 数组');
  return JSON.parse(raw.slice(start, end + 1));
}

async function attempt(chat, section, items) {
  const list = items.map((it, i) => ({ i, title: it.title, snippet: it.snippet.slice(0, 200) }));
  const scored = extractJson(await chat([
    { role: 'system', content: '你是内容编辑，只输出 JSON，不输出其他文字。' },
    { role: 'user', content: `按与「${section.focus}」的相关性与内容质量给每条打 1-10 分，输出 [{"i":序号,"score":分数}]：\n${JSON.stringify(list)}` },
  ]));
  const chosen = scored
    .filter((s) => Number.isFinite(s.score))
    .sort((a, b) => b.score - a.score)
    .slice(0, section.topN)
    .map((s) => items[s.i])
    .filter(Boolean);
  if (chosen.length === 0) return [];
  const summaries = extractJson(await chat([
    { role: 'system', content: '你是中文技术编辑，只输出 JSON，不输出其他文字。' },
    { role: 'user', content: `为每条写 1-2 句中文摘要，不复述标题，不超过 80 字，输出 [{"i":序号,"summary":"..."}]：\n${JSON.stringify(chosen.map((c, i) => ({ i, title: c.title, snippet: c.snippet })))}` },
  ]));
  return chosen.map((c, i) => ({ ...c, summary: summaries.find((s) => s.i === i)?.summary ?? '' }));
}

export async function selectAndSummarize(chat, section, items) {
  if (items.length === 0) return { picks: [], degraded: false };
  for (let tries = 0; tries < 2; tries += 1) {
    try {
      return { picks: await attempt(chat, section, items), degraded: false };
    } catch { /* retry once */ }
  }
  const picks = [...items]
    .sort((a, b) => Date.parse(b.isoDate ?? 0) - Date.parse(a.isoDate ?? 0))
    .slice(0, section.topN)
    .map((it) => ({ ...it, summary: '' }));
  return { picks, degraded: true };
}
```

- [ ] **Step 4: 测试通过后提交**

```bash
npm test
git add scripts && git commit -m "feat: 方舟评分摘要模块与失败降级策略"
```

---

### Task 6: 期刊渲染与流水线编排

**Files:**
- Create: `scripts/lib/render.mjs`, `scripts/run-digest.mjs`, `scripts/test/render.test.mjs`

**Interfaces:**
- Consumes: Task 4 `fetchGroup`、Task 5 `createClient`/`selectAndSummarize`、Task 3 配置文件。
- Produces: `renderIssue({ number, date, sections, failedSources })` → 完整 markdown 字符串；`run-digest.mjs` 写 `src/content/issues/<YYYY-MM-DD>.md`（当日已存在则复用期号覆盖，幂等）。

- [ ] **Step 1: 先写失败测试 `render.test.mjs`**

覆盖：输出含 frontmatter 五字段；三栏目标题齐全；条目行含链接与 ` — ` 署名；degraded 栏目含降级说明行；空栏目输出「本栏目今日无入选内容。」；failedSources 非空时含「N 个源本期不可用」；标题中的 `[`/`]` 被转义。

- [ ] **Step 2: 运行确认失败** `npm test` → FAIL。

- [ ] **Step 3: 实现 `render.mjs`**

```js
export function escapeMd(s) {
  return String(s).replace(/([[\]])/g, '\\$1');
}

export function renderIssue({ number, date, sections, failedSources }) {
  const lines = [
    '---',
    `title: 第 ${number} 期`,
    `date: ${date}`,
    `issue: ${number}`,
    `unavailableSources: ${JSON.stringify(failedSources)}`,
    '---',
    '',
  ];
  for (const s of sections) {
    lines.push(`## ${s.name}`, '');
    if (s.picks.length === 0) {
      lines.push('本栏目今日无入选内容。', '');
      continue;
    }
    if (s.degraded) lines.push('（本期摘要服务不可用，仅提供标题与链接。）', '');
    for (const p of s.picks) {
      lines.push(`- **[${escapeMd(p.title)}](${p.link})** — ${escapeMd(p.author || p.source)}`);
      if (p.summary) lines.push(`  ${p.summary}`);
    }
    lines.push('');
  }
  if (failedSources.length > 0) {
    lines.push(`> 本期有 ${failedSources.length} 个源不可用：${failedSources.map(escapeMd).join('、')}。`, '');
  }
  return lines.join('\n');
}
```

- [ ] **Step 4: 实现 `run-digest.mjs`**

```js
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fetchGroup } from './lib/feeds.mjs';
import { createClient } from './lib/llm.mjs';
import { selectAndSummarize } from './lib/select.mjs';
import { renderIssue } from './lib/render.mjs';

const CONTENT_DIR = new URL('../src/content/issues/', import.meta.url);
const loadJson = (p) => JSON.parse(readFileSync(new URL(`../config/${p}`, import.meta.url), 'utf8'));

const sectionsCfg = loadJson('sections.json');
const jikeUsers = loadJson('jike-users.json');
const rsshubBases = (process.env.RSSHUB_BASES ?? 'https://rsshub.app').split(',');
const chat = createClient();
const now = new Date();
const today = now.toISOString().slice(0, 10);

const failedSources = [];
const sections = [];
for (const cfg of sectionsCfg) {
  let feeds;
  if (cfg.key === 'jike') {
    feeds = jikeUsers.map((u) => ({ name: `即刻·${u.name}`, url: `${rsshubBases[0]}/jike/user/${u.id}` }));
  } else {
    feeds = loadJson(cfg.feeds);
  }
  let { items, failed } = await fetchGroup(feeds, { now });
  if (cfg.key === 'jike' && items.length === 0 && rsshubBases[1]) {
    ({ items, failed } = await fetchGroup(
      jikeUsers.map((u) => ({ name: `即刻·${u.name}`, url: `${rsshubBases[1]}/jike/user/${u.id}` })),
      { now },
    ));
  }
  failedSources.push(...failed);
  const { picks, degraded } = await selectAndSummarize(chat, cfg, items);
  sections.push({ name: cfg.name, picks, degraded });
}

const existing = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).sort();
const todayFile = new URL(`${today}.md`, CONTENT_DIR);
let number = existing.length + 1;
if (existsSync(todayFile)) {
  const m = readFileSync(todayFile, 'utf8').match(/^issue: (\d+)$/m);
  if (m) number = Number(m[1]);
}
writeFileSync(todayFile, renderIssue({ number, date: today, sections, failedSources }));
console.log(`已生成第 ${number} 期（${today}），不可用源 ${failedSources.length} 个`);
```

- [ ] **Step 5: 测试与全链路干跑**

```bash
npm test && npm run build && npm run verify
```

本地干跑（用户提供临时 key 或跳过）：`ARK_API_KEY=... ARK_MODEL=... npm run digest`，确认生成当日文件且重跑不改期号。

- [ ] **Step 6: 提交**

```bash
git add scripts && git commit -m "feat: 期刊渲染器与每日流水线编排（幂等）"
```

---

### Task 7: 即刻名单引导（一次性脚本）

**Files:**
- Create: `scripts/bootstrap-jike.mjs`
- Modify: `config/jike-users.json`

**Interfaces:**
- Produces: 填充后的 `jike-users.json`。脚本为一次性工具，保留在仓库供名单更新参考。

- [ ] **Step 1: 实现扫描脚本**

逻辑：抓 `https://digest.zhangtenggan.cn/` 与其归档页 → 收集期刊页 URL → 逐页抓取，正则提取 `m.okjike.com/originalPosts/<id>` 与 `okjike.com/users/<uuid>` 链接及邻近作者名 → 对 originalPosts 页面再抓一次解析作者 `/users/<uuid>` → 去重输出 `[{id, name}]`。请求间隔 ≥1s，总量封顶 200 页，纯只读。

- [ ] **Step 2: 运行并人工核对**

```bash
node scripts/bootstrap-jike.mjs > /tmp/jike-users.json && cat /tmp/jike-users.json
```

人工核对名单合理后写入 `config/jike-users.json`。若解析不出足够链接（站点结构不含原帖链接），停止并改用退路：用户在即刻 App 查看张腾甘关注列表，手动提供名单，逐个搜索用户主页分享链接映射 ID。

- [ ] **Step 3: 提交**

```bash
git add scripts/bootstrap-jike.mjs config/jike-users.json
git commit -m "feat: 即刻名单引导脚本与初始用户配置"
```

---

### Task 8: GitHub 仓库、Pages 与两条工作流

**Files:**
- Create: `.github/workflows/deploy.yml`, `.github/workflows/digest.yml`, `README.md`

- [ ] **Step 1: deploy.yml**（与主站同款：push master / 手动触发 → `withastro/action@v6` build → `actions/deploy-pages@v5`，permissions `contents: read, pages: write, id-token: write`。）

- [ ] **Step 2: digest.yml**（首版仅 `workflow_dispatch`，cron 在 Task 9 验收后加）

```yaml
name: Daily digest
on:
  workflow_dispatch:
permissions:
  contents: write
  pages: write
  id-token: write
jobs:
  generate:
    runs-on: ubuntu-latest
    services:
      rsshub:
        image: diygod/rsshub
        ports: ['1200:1200']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: node scripts/run-digest.mjs
        env:
          ARK_API_KEY: ${{ secrets.ARK_API_KEY }}
          ARK_MODEL: ${{ secrets.ARK_MODEL }}
          RSSHUB_BASES: http://localhost:1200,https://rsshub.app
      - run: |
          git config user.name "digest-bot"
          git config user.email "actions@users.noreply.github.com"
          git add src/content/issues
          git diff --cached --quiet || git commit -m "content: $(date -u +%F) 期简报"
          git push
  publish:
    needs: generate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { ref: master }
      - uses: withastro/action@v6
  deploy:
    needs: publish
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v5
```

注意：Actions 内用 `GITHUB_TOKEN` push 不会触发其他 workflow，因此 digest.yml 自带 build+deploy，不依赖 push 触发 deploy.yml。

- [ ] **Step 3: README.md**（项目介绍、三组源说明、本地命令、secrets 清单。）

- [ ] **Step 4: 建远端仓库并推送**

```bash
gh repo create AlainOUYANG/digest --public --source ~/digest --push
gh api repos/AlainOUYANG/digest/pages -X POST -f build_type=workflow
```

- [ ] **Step 5: 用户设置 secrets**（用户在会话中执行，key 不经助手）

```
! gh secret set ARK_API_KEY -R AlainOUYANG/digest
! gh secret set ARK_MODEL -R AlainOUYANG/digest
```

- [ ] **Step 6: 手动触发首期**

```bash
gh workflow run digest.yml -R AlainOUYANG/digest && gh run watch
```

Expected: generate/publish/deploy 三个 job 成功，`https://alainouyang.github.io/digest/` 返回首期。

---

### Task 9: 验收、启用定时与主站入口

**Files:**
- Modify: `~/digest/.github/workflows/digest.yml`（加 cron）
- Modify: 主站 `site/src/components/SiteFooter.astro`（加简报链接）、主站 `ROADMAP.md`

- [ ] **Step 1: Playwright 冒烟**（playwright-core + 系统 Chrome）：线上 `/digest/`、`/digest/archive/`、单期页，桌面 1440×900 与移动 390×844，无横向溢出、控制台 0 error/0 warning、条目均有链接与署名。

- [ ] **Step 2: 用户目检首期内容质量**（摘要准确性、栏目相关性、版权卫生抽查）。

- [ ] **Step 3: 通过后启用定时**：digest.yml 加

```yaml
  schedule:
    - cron: '0 11 * * *'
```

提交推送。

- [ ] **Step 4: 主站页脚加「简报」链接**（指向 `https://alainouyang.github.io/digest/`），跑主站 `npm run verify:all`，提交；推送会触发主站重新部署，推送前向用户确认。

- [ ] **Step 5: 更新主站 ROADMAP.md**（记录子站上线、验证结果与后续观察项），提交推送。
