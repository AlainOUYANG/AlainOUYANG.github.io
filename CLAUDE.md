# CLAUDE.md

This file defines the working rules and architecture context for this repository.

## Project Status

The production site at <https://alainouyang.github.io> is currently a Jekyll site based on the legacy AcademicPages / Minimal Mistakes template.

An Astro rebuild has been designed and approved, but implementation has not started. Until the Astro build is fully verified and the user separately approves the publishing-source switch, the Jekyll site remains the production source of truth.

Progress and verification status are tracked in `ROADMAP.md`. The approved redesign is specified in `docs/superpowers/specs/2026-07-10-personal-site-astro-redesign-design.md`.

## Product Direction

The redesigned site is a Chinese-first professional personal site for industry peers.

- Primary positioning: intelligent marketing, causal inference, and Uplift Modeling.
- Secondary positioning: independent AI applications and personal productivity tools.
- Academic work is supporting evidence, not the homepage's main identity.
- Chinese display name is always `佐坤`. Do not use `左坤`.
- Company work may be described only at the role and professional-domain level. Do not publish company cases, business details, metrics, or internal methods.
- English content is limited to the profile summary, CV, and publications/research where useful.

## Current Jekyll Architecture

The current content is stored in Jekyll collections and pages:

| Directory | Purpose |
|---|---|
| `_posts/` | Historical blog posts |
| `_publications/` | Publication collection, including legacy sample entries |
| `_talks/` | Legacy talks collection |
| `_teaching/` | Legacy teaching collection |
| `_portfolio/` | Legacy portfolio collection |
| `_pages/` | Homepage, CV, publications, archives, and template demo pages |
| `_data/` | Navigation, author, UI text, and legacy comments |
| `_layouts/`, `_includes/`, `_sass/` | Jekyll theme implementation |
| `files/`, `images/` | PDFs and static images |

Current local commands:

```bash
bundle install
bundle exec jekyll liveserve
bundle exec jekyll serve --config _config.yml,_config.dev.yml
npm run build:js
```

Do not document Astro commands as working until the Astro project has actually been scaffolded and verified.

## Approved Astro Target

The target site is a static Astro site deployed to GitHub Pages by GitHub Actions.

Planned content boundaries:

```text
src/content/posts/          Methodology and technical writing
src/content/lab/            Independent AI projects and experiments
src/content/publications/   Papers and doctoral research
src/data/profile.*          Identity, positioning, and contact links
src/data/experience.*       Professional and education history
src/data/topics.*           Causal inference, Uplift, and marketing topics
```

Use Astro Content Collections schemas so missing or invalid required fields fail the build. Pages compose reusable components; they must not duplicate profile, experience, publication, or project data.

The first release intentionally excludes a CMS, comments, site search, dynamic filters, analytics, and dark mode.

## Approved Information Architecture

Primary navigation:

1. 首页
2. 专题
3. 文章
4. AI 实验室
5. 研究
6. 关于

Historical archives, RSS, sitemap, and English CV belong in the footer or secondary navigation.

Content priority:

- 60% intelligent marketing, causal inference, and Uplift Modeling.
- 25% AI applications and productivity tools.
- 15% academic research and historical background.

The homepage uses the approved warm personal-studio visual language with a Bento workspace layout. The largest card is reserved for causal inference and Uplift Modeling. Mobile layouts reflow into a natural single-column reading order.

## Migration Rules

- Generate and preserve a manifest of valid production URLs before migration.
- Preserve historical post permalinks wherever possible.
- Migrate historical posts into an archive; only curated posts appear in primary content feeds.
- Reconstruct publications from real records and remove duplicate/template entries from the new build.
- Preserve valid CV, thesis, publication PDF, avatar, and favicon URLs.
- Do not migrate template demo pages or fake talks, teaching, portfolio, and publication entries.
- Keep the Jekyll source until the Astro build, route parity, and production preview are verified.
- Deleting legacy files, changing the GitHub Pages publishing source, or rolling back requires separate user approval.

## SEO and Validation

Every public page requires a unique title, description, canonical URL, and social metadata. Generate Person, Article, and ScholarlyArticle structured data where applicable, plus sitemap, RSS, robots.txt, and a useful 404 page.

Target verification for the Astro implementation:

```text
Astro type/content checks
Production build
Old-to-new URL parity check
Internal link and static asset validation
Playwright smoke tests for primary routes and 404
Desktop and mobile screenshot review
Lighthouse scores >= 90 for Performance, Accessibility, Best Practices, and SEO
GitHub Pages preview verification before production switching
```

## Change Discipline

- Read `ROADMAP.md` before implementation work.
- Update `ROADMAP.md` after every verified development, migration, documentation, or research milestone.
- Only mark work completed after verification.
- Keep changes scoped to the approved redesign.
- Preserve user changes and never stage `.superpowers/` brainstorming artifacts.
- Do not publish, deploy, change GitHub Pages settings, delete legacy files, or modify CI/CD without explicit approval.
