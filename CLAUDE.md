# CLAUDE.md

This file defines the working rules and architecture context for this repository.

## Project Status

The production site at <https://alainouyang.github.io> is an Astro 7 static site built from `site/` and deployed by `.github/workflows/deploy.yml` through GitHub Actions.

The legacy Jekyll / AcademicPages source remains in the repository as a rollback reference. It is no longer the GitHub Pages production source and must not be deleted without separate user approval.

Progress and verification status are tracked in `ROADMAP.md`. The production release is documented in `docs/superpowers/specs/2026-07-10-personal-site-astro-redesign-design.md`; the approved next redesign is specified in `docs/superpowers/specs/2026-07-11-kzyo-editorial-minimal-redesign-design.md` and supersedes the previous identity and visual direction.

## Product Direction

The redesigned site is a Chinese-first professional personal site for industry peers.

- Primary positioning: intelligent marketing, causal inference, and Uplift Modeling.
- Secondary positioning: independent AI applications and personal productivity tools.
- Academic work is supporting evidence, not the homepage's main identity.
- Public-facing site identity is always `Kzyo`. Do not display `佐坤`, `左坤`, `Zuokun Ouyang`, or other real-name variants in site chrome, page introductions, metadata, or first-party author bylines.
- Do not display personal portraits or profile photos. Legacy image files may remain as rollback assets but must not be referenced by the Astro production site.
- Bibliographic author lists, CV files, publication PDFs, and explicitly retained external profiles such as Google Scholar, LinkedIn, and ORCID may contain the legal name. Do not rewrite scholarly records or third-party destinations to use `Kzyo`.
- Company work may be described only at the role and professional-domain level. Do not publish company cases, business details, metrics, or internal methods.
- English content is limited to the profile summary, CV, and publications/research where useful.

## Legacy Jekyll Architecture

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

Verified Astro commands:

```bash
cd site
npm install
npm run dev
npm run verify:all
npm run preview
```

## Approved Astro Target

The production site is a static Astro 7 site deployed to GitHub Pages through the authorized GitHub Actions workflow.

Planned content boundaries:

```text
src/content/posts/          Methodology and technical writing
src/data/lab.ts             Independent AI projects and experiments
src/data/publications.ts    Papers and doctoral research
src/data/profile.*          Identity, positioning, and contact links
src/data/topics.*           Causal inference, Uplift, and marketing topics
```

Use Astro Content Collections schemas so missing or invalid required fields fail the build. Pages compose reusable components; they must not duplicate profile, experience, publication, or project data.

The first release intentionally excludes a CMS, comments, site search, dynamic filters, analytics, and a user-switchable theme. The next approved redesign replaces the fixed dark presentation with a warm-light editorial system inspired by the restraint of Steph Ango's site without copying its wording, assets, exact typography, or layout.

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

- 50% intelligent marketing, causal inference, and Uplift Modeling.
- 30% AI applications, automation, and productivity tools.
- 20% writing, podcast, academic research, and historical background.

The approved next visual system is editorial minimalism: warm off-white backgrounds, dark neutral text, one muted accent, narrow reading widths, typographic hierarchy, generous whitespace, and thin rules. Chinese text uses LXGW WenKai; Latin text uses Source Sans 3. Remove the particle/typewriter hero, color glows, gradients, oversized headings, Bento workspace, large rounded cards, ornamental numbering, and nonessential reveal motion. Content is presented primarily as compact text rows and chronological lists. Small thumbnails are allowed only when they communicate project or podcast identity; personal portraits are not allowed.

The content model separates professional topics from publishing formats. Growth, causal inference, Uplift Modeling, AI tools, and productivity are topics; article, podcast, project, note, and publication are formats. Podcast remains a publishing format within writing until it has enough sustained output to justify first-level navigation.

The previous release used `https://zhangtenggan.cn/` as a visual reference. Its immersive hero, particle treatment, numbered sections, and Bento rhythm are no longer part of the approved next design. The next design references the editorial restraint of `https://stephango.com/` without copying wording, assets, exact typography, or layout.

## Migration Rules

- Generate and preserve a manifest of valid production URLs before migration.
- Preserve historical post permalinks wherever possible.
- Migrate historical posts into an archive; only curated posts appear in primary content feeds.
- Reconstruct publications from real records and remove duplicate/template entries from the new build.
- Preserve valid CV, thesis, publication PDF, legacy avatar asset, and favicon URLs for compatibility and rollback, but do not reference the personal avatar from Astro production pages.
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
Playwright CLI checks for primary routes, 404, mobile navigation, console errors, and horizontal overflow
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
