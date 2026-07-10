# 佐坤个人网站 Astro 重建设计

日期：2026-07-10

状态：已逐段确认，等待书面规格复核

## 1. 背景

当前网站是基于旧版 AcademicPages／Minimal Mistakes 的 Jekyll 学术主页。生产内容仍将佐坤描述为法国高校 ATER 和信号处理博士，首页、CV、侧栏、PDF 与 Publications 分别维护信息，已经与当前职业背景明显脱节。

仓库还包含模板假论文、示例 talks、teaching、portfolio 和演示页面。142 篇历史文章停留在 2021 年，主导航仍以 Publications、Blog Posts、CV 为核心，无法有效服务当前目标受众。

本次改版不做局部换肤，而是用 Astro 重建一个面向行业同行的专业个人站，同时保留 GitHub Pages 托管和有价值的历史 URL。

## 2. 目标与非目标

### 2.1 目标

- 让行业同行在一分钟内理解佐坤的专业定位与长期关注方向。
- 以智能营销、因果推断和 Uplift Modeling 建立核心专业认知。
- 以 AI 播客、内容生成、知识管理和效率工具展示独立创造能力。
- 将博士研究和论文作为方法论基础，而不是首页主角。
- 建立单一结构化内容源，避免个人资料和经历再次多处过期。
- 保留历史文章、CV、论文和博士论文的有效访问路径。
- 通过静态构建、schema、自动检查和发布门禁保证内容质量。

### 2.2 非目标

- 不公开公司案例、业务数据、内部方法、指标或系统细节。
- 第一版不实现 CMS、评论、站内搜索、动态筛选、访问统计和深色模式。
- 不在 Astro 版本验证前删除 Jekyll 源码或切换生产发布源。
- 不把所有历史文章重新包装成当前作品；历史内容保留但降权。

## 3. 目标受众与定位

### 3.1 目标受众

首要受众是智能营销、因果推断、机器学习和 AI 应用领域的行业同行。招聘者和普通读者可以访问，但不驱动首页结构。

### 3.2 核心定位

主定位：智能营销与因果推断算法工程师，关注 Uplift Modeling、实验评估和增量决策。

副定位：AI 应用与个人效率工具实践者。

支撑背景：计算机科学与信号处理博士、时序建模研究经历。

中文显示名固定为「佐坤」，英文使用 `Zuokun Ouyang`。

### 3.3 内容权重

- 智能营销、因果推断、Uplift Modeling：60%。
- AI 应用与效率工具：25%。
- 学术研究与历史经历：15%。

## 4. 技术架构

### 4.1 总体架构

- 使用 Astro 生成纯静态站点。
- 使用 GitHub Actions 构建静态产物并部署到 GitHub Pages。
- 不依赖数据库、服务端运行时或外部 CMS。
- 内容保存在 Git 仓库，通过 Markdown／MDX 与结构化数据维护。
- Astro Content Collections 使用 schema 校验必填字段和状态枚举。

### 4.2 内容边界

```text
src/content/posts/          方法论与技术文章
src/content/lab/            AI 独立项目和公开实验
src/content/publications/   论文与博士研究
src/data/profile.*          姓名、定位、联系方式
src/data/experience.*       职业与教育经历
src/data/topics.*           因果推断、Uplift、智能营销专题
```

页面和组件不得硬编码重复的个人资料、职业经历、论文和项目数据。

### 4.3 数据流

```text
Markdown／MDX／结构化数据
            ↓
Astro Content Collections schema 校验
            ↓
专题、文章、实验室、研究与关于页面
            ↓
静态 HTML、RSS、sitemap 与 SEO 元数据
            ↓
GitHub Actions 构建与 GitHub Pages 发布
```

## 5. 信息架构

### 5.1 主导航

1. 首页
2. 专题
3. 文章
4. AI 实验室
5. 研究
6. 关于

Archive、RSS、sitemap 和英文 CV 放在页脚或二级入口。

### 5.2 首页

首页按以下认知顺序组织：

1. 首屏定位：「研究增量，也创造新东西。」
2. 核心专题：因果推断与 Uplift Modeling。
3. 精选文章：只展示最能代表当前专业判断的内容。
4. AI 实验室：展示公开的个人项目和实验状态。
5. 研究基础：博士研究、代表论文和学术档案。
6. Now：近期关注方向和更新入口。

### 5.3 专题

首期只建立三个高质量专题：

- 因果推断与实验评估。
- Uplift Modeling 与增量决策。
- 智能营销算法。

专题页包含问题定义、文章列表、推荐阅读顺序和相关研究，不是普通标签聚合页。

### 5.4 文章

文章分为方法与模型、工程与实践、阅读与思考、历史归档。旧文章全部保留，但默认内容流优先展示与当前定位一致的文章。

### 5.5 AI 实验室

只展示独立个人项目和公开实验。项目状态限定为「探索中」「可用」「已归档」。每个项目说明问题、状态、实现思路、公开链接和相关笔记，不包含公司业务内容。

### 5.6 研究

集中展示论文、博士论文、研究主题、Google Scholar 和英文简介。学术经历用于解释专业基础，不支配首页。

### 5.7 关于

包含职业简介、经历时间线、教育背景、技能、联系方式和中英文 CV。公司经历只写职位、专业领域和时间。

## 6. 视觉设计

### 6.1 方向

使用已确认的「温暖个人工作室＋Bento 工作台」方向：

- 暖白背景。
- 深紫正文。
- 玫红到紫色的有限渐变作为强调色。
- 圆角卡片和克制阴影。
- 亲近、有创造力，但不使用黑客控制台、过度科技感或儿童化装饰。

### 6.2 Bento 层级

- 因果推断与 Uplift Modeling 是最大、最醒目的卡片。
- 精选文章、AI 实验室、研究和 Now 是辅助卡片。
- 桌面端用于快速扫描。
- 移动端按核心专题、文章、AI 实验室、研究、Now 的顺序重排为单列或有限双列。
- 不为保持 Bento 形状牺牲正文可读性。

### 6.3 关键文案

首页主标题：

> 研究增量，也创造新东西。

首页身份说明：

> 智能营销与因果推断算法工程师，关注 Uplift Modeling、实验评估，也持续构建 AI 内容与效率工具。

上线前由用户最终确认所有个人资料和职业字段；未确认字段阻塞生产发布。

## 7. 组件边界

- `BaseLayout`：页面骨架、字体和全局样式。
- `SEOHead`：title、description、canonical、Open Graph 和 JSON-LD。
- `SiteHeader`／`SiteFooter`：主导航和二级入口。
- `BentoGrid`：只管理首页布局，不读取具体内容源。
- `TopicCard`／`ArticleCard`／`LabCard`：展示对应内容类型。
- `ArticleLayout`：正文、目录、日期、标签和相关文章。
- `Timeline`：职业与教育经历。
- `PublicationList`：论文、链接和引用信息。

每个组件只承担一个清晰职责，页面负责组合，数据由内容集合或结构化数据注入。

## 8. 迁移策略

1. 生成现有生产站有效 URL manifest。
2. 将 142 篇历史文章迁移到 Astro，保留原 permalink。
3. 默认归入历史 Archive，只手动精选当前定位相关内容。
4. 从真实出版物记录重建 publication collection，排除模板假数据和重复手写内容。
5. 保留 CV、博士论文、论文 PDF、头像、favicon 及其有效 URL。
6. 不迁移模板示例 talks、teaching、portfolio 和演示页。
7. 新旧构建分别生成 URL、标题和内部链接报告并做差异检查。
8. Astro 预览完全通过后，另行请求切换 GitHub Pages 发布源。
9. 生产站稳定且用户确认后，再决定旧 Jekyll 文件的处理方式。

GitHub Pages 不提供通用服务器端重定向能力，因此优先保持原路径；无法保持时生成兼容静态页面并设置新页面 canonical。

## 9. SEO

每个页面必须提供独立的 title、description、canonical 和 Open Graph 数据。

- 首页生成 `Person` JSON-LD。
- 文章生成 `Article` JSON-LD。
- 论文页面生成 `ScholarlyArticle` JSON-LD。
- 自动生成 sitemap、RSS 和 robots.txt。
- 中文页面声明中文；英文 CV 和研究页面声明英文。
- 第一版关闭访问统计并移除旧 Universal Analytics 配置。

## 10. 错误处理与发布安全

- schema 缺少标题、日期、摘要、slug 或使用非法状态值时，构建失败。
- 内部链接、图片和 PDF 路径失效时，CI 失败。
- 外部链接失效只发出警告，避免第三方短暂异常阻塞发布。
- 自定义 404 页面提供首页、专题、文章和 Archive 入口。
- GitHub Actions 只发布成功构建的静态产物。
- 未完成预览验证前，不改变生产发布源。
- 发布源切换、删除旧文件和回滚均需单独确认。

## 11. 验证方案

每次准备合并或发布时至少完成：

1. Astro 类型检查与 Content Collections schema 检查。
2. 生产构建。
3. 旧站到新站的 URL parity 检查。
4. 内部链接、图片、PDF、RSS 和 sitemap 检查。
5. Playwright 冒烟测试：首页、专题、文章、AI 实验室、研究、关于和 404。
6. 桌面端与移动端截图检查，重点验证 Bento 重排。
7. Lighthouse 检查：Performance、Accessibility、Best Practices、SEO 均不低于 90。
8. GitHub Pages 预览验证。

## 12. 完成标准

- 中文名全部为「佐坤」。
- 首页准确呈现智能营销、因果推断、Uplift Modeling 与 AI 实践定位。
- 不再展示 ATER、Orléans 地址和旧 Signal Processing 主定位。
- 不公开公司业务案例。
- 模板假论文和演示内容不再发布。
- 历史文章、CV、论文和博士论文的有效链接保持可访问。
- 桌面端与移动端符合已确认的温暖 Bento 设计。
- Content Collections、链接检查、Playwright、截图和 Lighthouse 验证通过。
- `CLAUDE.md` 与 `ROADMAP.md` 反映真实架构、进度和最近验证。

## 13. 风险与控制

| 风险 | 控制措施 |
|---|---|
| 历史中文 slug 在 Astro 中发生变化 | 使用 URL manifest 和显式 permalink 映射验证 |
| 迁移后内容数量大、噪声高 | 默认 Archive，首页和栏目只显示人工精选内容 |
| Bento 布局影响移动端阅读 | 移动端按固定语义顺序重排，不保持桌面形状 |
| 个人信息再次多处过期 | profile、experience、publications 使用单一结构化数据源 |
| Astro 构建通过但线上链接失效 | 加入生产 base URL、静态资源和 URL parity 检查 |
| 上线内容包含未经确认的职业信息 | 将用户确认个人字段设置为发布门禁 |
