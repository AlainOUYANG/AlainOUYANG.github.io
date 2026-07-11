# ROADMAP.md

## 当前阶段

Astro 7 个人网站已正式发布到 GitHub Pages。生产源为 `site/` 与 `.github/workflows/deploy.yml`；旧 Jekyll／AcademicPages 文件保留为回退参考，不再承担线上构建。

## 已完成

- 2026-07-10：审计当前仓库、线上主页、导航、内容集合、依赖与模板遗留内容。
- 2026-07-10：确认目标受众为行业同行。
- 2026-07-10：确认主定位为智能营销、因果推断与 Uplift Modeling，副定位为 AI 应用与个人效率工具。
- 2026-07-10：确认中文为主，英文仅用于简介、CV 与研究内容。
- 2026-07-10：确认不公开公司案例、业务细节或内部指标。
- 2026-07-10：确认使用 Astro 重建并继续托管于 GitHub Pages。
- 2026-07-10：确认首页、专题、文章、AI 实验室、研究、关于的信息架构。
- 2026-07-10：确认「温暖个人工作室＋Bento 工作台」视觉方案及移动端单列重排原则。
- 2026-07-10：确认内容模型、旧站迁移、SEO、异常处理、测试和发布安全方案。
- 2026-07-10：完成正式改版设计规格文档。
- 2026-07-10：审阅 `zhangtenggan.cn` 的桌面端和移动端，确认借鉴沉浸式首屏、锚点导航和编号叙事，但不做像素级复制。
- 2026-07-10：确认首页与子页面必须共享深紫黑、暖白、珊瑚紫强调、编号章节、卡片和动效设计语言。
- 2026-07-10：在 `site/` 搭建 Astro 7 静态站、Content Collections、结构化个人数据和完整验证命令。
- 2026-07-10：实现全站统一 design tokens、导航、页头、编号章节、卡片、页脚和文章阅读布局。
- 2026-07-10：实现粒子／打字机首屏、Bento 首页以及专题、文章、AI 实验室、研究、关于、归档和 404 页面。
- 2026-07-10：迁移 142 篇历史文章、24 个图片资源和 4 个真实研究文件，生成 142 条旧文 URL manifest；模板假论文未进入新站。
- 2026-07-10：实现 canonical、Open Graph、Person／Article／ScholarlyArticle JSON-LD、RSS、sitemap 和 robots.txt。
- 2026-07-10：完成桌面端和 390px 移动端全部核心路由的 Playwright CLI 检查与截图目检。
- 2026-07-10：修复 4 处 ARIA 语义问题和旧站唯一失效内部图片链接，Lighthouse 四项达到 100 分。
- 2026-07-10：新增基于 `withastro/action@v6` 与 `actions/deploy-pages@v5` 的 GitHub Pages workflow，并将 Pages 构建源从 `legacy` 切换为 `workflow`。
- 2026-07-10：将 `master` 推送到 GitHub，Actions 运行 `29138964139` 的 build 与 deploy job 均成功，Astro 新站正式上线。
- 2026-07-10：完成线上首页、六个核心栏目、历史文章、RSS、sitemap 与自定义 404 验收。

## 进行中

- 观察 Astro 生产站稳定性，旧 Jekyll 文件暂不删除。

## 待办

1. 持续整理因果推断、Uplift Modeling 与智能营销的精选文章。
2. 为 AI 实验室补充可公开的项目链接和过程记录。
3. Astro 生产站稳定运行一段时间且用户再次确认后，再决定是否删除旧 Jekyll 文件。

## 阻塞与待确认

- 当前没有本地实现阻塞。
- 新站只使用已确认的职业领域与博士背景，没有公开当前雇主、地点、邮箱、公司案例、业务数据或内部指标。
- 用户已确认公开 GitHub、Google Scholar、LinkedIn 和 ORCID；当前雇主、地点和邮箱保持不发布。
- 任何再次修改 GitHub Pages 发布源、删除旧文件或执行回滚的操作均需单独确认。

## 最近验证

- 2026-07-10：确认当前生产首页仍显示 2023 年 ATER、Orléans 和 Signal Processing 定位。
- 2026-07-10：确认仓库包含 142 篇 2017 至 2021 年历史文章、模板假论文及示例 talks／teaching／portfolio 页面。
- 2026-07-10：确认当前依赖锁定为 `github-pages 228` 与 `Jekyll 3.9.3`。
- 2026-07-10：`cd site && npm run verify:all` 通过；Astro check 为 0 error／0 warning／0 hint，生产构建输出 150 个页面。
- 2026-07-10：构建、内容、设计系统、核心路由、142 篇迁移、SEO 与内部链接契约全部通过。
- 2026-07-10：Playwright CLI 在 1440×900 与 390×844 下检查首页及全部核心子页面；共享壳层存在、背景一致、横向溢出均为 0，控制台 0 error／0 warning。
- 2026-07-10：Lighthouse 首页最终结果为 Performance 100、Accessibility 100、Best Practices 100、SEO 100。
- 2026-07-10：GitHub Pages API 返回 `build_type: workflow`、`status: built`、HTTPS enforced；Actions 运行 `29138964139` 结论为 `success`。
- 2026-07-10：线上首页、专题、文章、AI 实验室、研究、关于、归档和代表性历史文章均返回 HTTP 200；不存在路径返回自定义 HTTP 404。
- 2026-07-10：线上 RSS 包含 50 条 item，sitemap 包含 149 条 URL，线上内容契约通过。
