# 简报条目加厚与今日趋势实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 简报每条摘要加厚为 3–4 句（120–180 字），每期开头新增可降级的「今日趋势」总览段。

**Architecture:** 抓取层新增 RSS 全文提取（剥 HTML、截 2500 字、回退 snippet），摘要 prompt 改用全文并放宽字数；新增 trend 模块在三栏目选定后综合生成趋势段，失败返回 null 由渲染层省略。

**Tech Stack:** 既有 Node + node:test，不新增依赖。仓库 `~/digest`。

## Global Constraints

- 不新增依赖；评分阶段仍用 200 字 snippet，只有摘要阶段用全文。
- 趋势段失败不阻塞出刊：`buildTrend` 返回 null → 渲染省略该段。
- 三栏目结构、frontmatter、`verify-issues` 契约保持兼容，旧期刊不迁移。
- Commit 中文前缀规范，不加 Co-Authored-By。

---

### Task 1: 抓取层全文提取

**Files:**
- Modify: `scripts/lib/feeds.mjs`
- Test: `scripts/test/feeds.test.mjs`

**Interfaces:**
- Produces: `stripHtml(html)` 导出；`normalizeItem` 返回值新增 `content: string`（≤2500 字，无全文时等于 snippet）。

- [ ] **Step 1: 加失败测试**

```js
test('stripHtml 剥标签并解码常见实体', () => {
  assert.equal(stripHtml('<p>a &amp; b&nbsp;<b>c</b></p>'), 'a & b c');
});

test('normalizeItem 优先 content:encoded 并截断 2500 字', () => {
  const raw = { title: 'T', link: 'x', contentSnippet: 'short', 'content:encoded': `<p>${'长'.repeat(3000)}</p>` };
  const item = normalizeItem(raw, 'S');
  assert.equal(item.content.length, 2500);
  assert.ok(!item.content.includes('<p>'));
});

test('normalizeItem 无全文时 content 回退 snippet', () => {
  const item = normalizeItem({ title: 'T', link: 'x', contentSnippet: 'only snippet' }, 'S');
  assert.equal(item.content, 'only snippet');
});
```

- [ ] **Step 2: 跑测试确认失败**（`stripHtml` 未导出）
- [ ] **Step 3: 实现**

```js
export function stripHtml(html) {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
```

`normalizeItem` 内：

```js
const fullText = raw['content:encoded'] || raw.content || '';
const snippet = (raw.contentSnippet ?? '').slice(0, 500);
return {
  // ...原字段不变
  snippet,
  content: (fullText ? stripHtml(fullText) : snippet).slice(0, 2500),
};
```

- [ ] **Step 4: 全量测试通过后提交** `feat: RSS 全文提取与 HTML 剥离，供摘要阶段使用`

---

### Task 2: 摘要 prompt 升级

**Files:**
- Modify: `scripts/lib/select.mjs`
- Test: `scripts/test/select.test.mjs`

**Interfaces:**
- Consumes: `NormalizedItem.content`（Task 1）。
- Produces: `selectAndSummarize` 签名不变；摘要调用输入改用 `content.slice(0, 2000)`。

- [ ] **Step 1: 更新测试**（fake chat 断言第二次调用的 user 消息包含条目 content 而非仅 snippet；现有测试 items 补 `content` 字段）
- [ ] **Step 2: 确认失败** → **Step 3: 实现**：摘要 prompt 改为：

```
为每条写 3-4 句中文摘要（120-180 字）：先说讲了什么，再给关键结论或数据，最后一句说为什么值得读。
原文很短的条目（如社交动态）提炼核心观点即可，不要硬凑字数。只输出 JSON [{"i":序号,"summary":"..."}]。
```

摘要输入由 `{ i, title, snippet }` 改为 `{ i, title, text: c.content.slice(0, 2000) }`。

- [ ] **Step 4: 全量测试通过后提交** `feat: 摘要改用全文输入并加厚为 3-4 句结构化摘要`

---

### Task 3: 今日趋势模块

**Files:**
- Create: `scripts/lib/trend.mjs`
- Test: `scripts/test/trend.test.mjs`

**Interfaces:**
- Produces: `buildTrend(chat, sections)` → `Promise<string|null>`；sections 为 `[{ name, picks: [{title, summary}] }]`。

- [ ] **Step 1: 失败测试**

```js
test('buildTrend 汇总条目并返回段落', async () => {
  const chat = async () => '今天的主线是 X。多篇文章讨论 Y。';
  const t = await buildTrend(chat, [{ name: 'A', picks: [{ title: 't1', summary: 's1' }] }]);
  assert.ok(t.includes('主线'));
});
test('buildTrend 两次失败返回 null', async () => {
  const chat = async () => { throw new Error('boom'); };
  assert.equal(await buildTrend(chat, [{ name: 'A', picks: [{ title: 't', summary: 's' }] }]), null);
});
test('buildTrend 无条目返回 null', async () => {
  assert.equal(await buildTrend(async () => '', []), null);
});
```

- [ ] **Step 2: 确认失败** → **Step 3: 实现**

```js
export async function buildTrend(chat, sections) {
  const lines = sections.flatMap((s) => s.picks.map((p) => `[${s.name}] ${p.title}：${p.summary}`));
  if (lines.length === 0) return null;
  for (let tries = 0; tries < 2; tries += 1) {
    try {
      const text = (await chat([
        { role: 'system', content: '你是中文技术编辑，只输出正文段落，不加标题和列表。' },
        { role: 'user', content: `根据今天简报的全部条目，写 3-5 句中文总览：提炼今天的 1-2 条主线，点出值得关注的共性或分歧。条目：\n${lines.join('\n')}` },
      ])).trim();
      if (text) return text;
    } catch (e) {
      console.error(`[今日趋势] 第 ${tries + 1} 次尝试失败：${e.message}`);
    }
  }
  return null;
}
```

- [ ] **Step 4: 提交** `feat: 今日趋势总览模块（失败自动省略）`

---

### Task 4: 渲染与编排接线、验收

**Files:**
- Modify: `scripts/lib/render.mjs`、`scripts/run-digest.mjs`
- Test: `scripts/test/render.test.mjs`

**Interfaces:**
- Consumes: `buildTrend`（Task 3）。
- Produces: `renderIssue({ number, date, sections, failedSources, trend })`，trend 为 string|null。

- [ ] **Step 1: 失败测试**：`trend: '今天主线是 X。'` 时输出在首个栏目前含 `## 今日趋势`；`trend: null` 时不含。
- [ ] **Step 2: 确认失败** → **Step 3: 实现**：`renderIssue` 解构新增 `trend = null`，frontmatter 之后、首栏目之前插入：

```js
if (trend) lines.push('## 今日趋势', '', trend, '');
```

`run-digest.mjs` 在三栏目循环后：

```js
import { buildTrend } from './lib/trend.mjs';
const trend = await buildTrend(chat, sections);
```

并传入 `renderIssue({ number, date: today, sections, failedSources, trend })`。

- [ ] **Step 4: 全量验证** `npm test && npm run build && npm run verify` 全过后提交 `feat: 期刊渲染接入今日趋势段`
- [ ] **Step 5: 推送并手动触发** `git push && gh workflow run digest.yml -R AlainOUYANG/digest`，watch 成功后抽查当期内容：摘要 3–4 句、有趋势段、署名链接齐全。
- [ ] **Step 6: 用户目检新形态**，通过后更新主站 `ROADMAP.md` 记录本次改动与验证结果并提交推送。
