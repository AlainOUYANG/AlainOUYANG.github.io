# 每日简报条目加厚与今日趋势设计

## 1．背景与目标

当前简报每条仅一句 30–50 字摘要，信息量薄。原因：LLM 输入只有 RSS snippet（≤500 字），prompt 限定 80 字以内。目标：每条摘要加厚为 3–4 句、120–180 字，并在每期开头新增「今日趋势」总览段。改动仅涉及 `AlainOUYANG/digest` 仓库，主站不动。

## 2．输入增强

`scripts/lib/feeds.mjs` 的 `normalizeItem` 新增 `content` 字段：优先 `content:encoded`（rss-parser 暴露为 `item['content:encoded']`）或 `item.content`，正则剥离 HTML 标签并解码常见实体，截断 2500 字；无全文时回退 snippet。评分阶段沿用 200 字 snippet，摘要阶段改用 `content`。不新增依赖。

## 3．摘要升级

`scripts/lib/select.mjs` 摘要 prompt 改为：3–4 句、120–180 字，结构「讲了什么 → 关键结论或数据 → 为什么值得读」；对原文很短的条目（如即刻动态）提炼核心观点即可，不硬凑字数。

## 4．今日趋势

新模块 `scripts/lib/trend.mjs`：`buildTrend(chat, sections)` 接收三栏目入选条目（标题+摘要），一次 LLM 调用输出 3–5 句中文段落。失败重试一次，仍失败返回 `null`，当期省略趋势段，不阻塞出刊。

## 5．渲染与兼容

`renderIssue` 接受可选 `trend` 字符串，非空时在正文最前渲染 `## 今日趋势` 段。三栏目结构与 frontmatter 不变，旧期刊无需迁移，`verify-issues` 契约兼容。

## 6．验收

- 单测：全文提取/剥标签/截断/回退；trend 正常与两次失败返回 null；render 含/不含 trend 两种输出。
- 全量单测、`npm run build`、`npm run verify` 通过。
- 手动触发生成当期，用户目检新形态后视需要再调 prompt。
