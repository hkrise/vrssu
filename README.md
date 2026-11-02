# VRSSU (Astro)

Astro + Vue islands rebuild of the TIDE **Virtual Rocky Shore Sampling Unit**.

This project lives in `vrssu-astro/` and does **not** replace the legacy Quasar/Vue 2 app in the repository root.

## Stack

- Astro (static output)
- Vue 3 islands for interactive analytics
- Tailwind CSS 4
- Highcharts (light theme)
- Local Tai Tam survey JSON (no runtime Gist/Firebase fetch)

## Requirements

- Node.js ≥ 22.12
- **pnpm** (this project uses `packageManager: pnpm@10.33.2`)

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Features

- Student educational pages (introduction, before you go, after you return, resources, acknowledgements)
- Interactive sampling-effort charts for Tai Tam sample data
- Upload own survey `.xlsx` and plot the same mean ± SD / SE logic
- Species gallery with italic scientific names + lightbox
- Collaborators entry is stubbed: hover/focus shows **Under maintenance**

## GitHub Pages

Published at [https://hkrise.github.io/vrssu/](https://hkrise.github.io/vrssu/) from the public repo `hkrise/vrssu`. `astro.config.mjs` is set for that project site:

```js
site: 'https://hkrise.github.io',
base: '/vrssu/',
```

Local `pnpm dev` and `pnpm preview` use the same prefix (`http://localhost:4321/vrssu/`).

Pushes to `main` on `hkrise/vrssu` run `.github/workflows/deploy.yml`, which builds `dist/` and deploys it with GitHub Pages Actions. The repo must use **Settings → Pages → Source: GitHub Actions**.

## Notes

- Legacy Quasar app remains untouched at the repo root.
- Parent Quasar `.postcssrc.js` is overridden by local `postcss.config.mjs`.
