# Jean-Luc Peloquin — Portfolio

A responsive personal portfolio for Jean-Luc Peloquin, built as a precise editorial system around software engineering, computer vision, data products, and interactive interfaces.

## Highlights

- Machined-metal Three.js plaque generated from the exact supplied alpha mask, with real recessed engraving, restrained tilt, scroll response, mobile quality controls, offscreen pausing, and an exact SVG fallback
- Terminal-style startup screen with a deterministic 64×40 ASCII rendition of that same authoritative logo mask
- Responsive light/dark editorial layout with live Las Vegas and New York clocks
- Accessible mobile navigation and contact dialogs with native focus trapping and Escape handling
- Selectable project case studies and an autoplaying, user-pausable principles carousel
- Self-hosted open-source fonts, optimized WebP portraits, and deterministic ASCII/SVG/GLB logo assets
- Standalone privacy and 404 pages
- GitHub Pages deployment workflow

## Run locally

```bash
npm install
npm run dev
```

Build and preview the production version:

```bash
npm run build
npm run preview
```

Regenerate or validate the committed logo model and fallback:

```bash
npm run generate:logo-model
npm run check:logo-model
```

## Structure

```text
index.html              Main portfolio
privacy.html            Privacy details
404.html                Static 404 page
src/main.js             Page interactions and UI state
src/artifact.js         GLB loading, lighting, and plaque interaction
scripts/logo-model.mjs  Deterministic alpha-to-ASCII/SVG/GLB generator and validator
src/generated/          Generated ASCII logo module
src/style.css           Design system and responsive layouts
public/                 Optimized images, social card, and favicon
.github/workflows/      GitHub Pages deployment
```

## Deployment

The Pages workflow builds the Vite project on pushes to `main` and deploys `dist/`. The Vite base is relative so assets work from a GitHub Pages repository subpath.

## Provenance

See [ASSET_PROVENANCE.md](./ASSET_PROVENANCE.md). The site recreates its editorial and halftone system in code and does not redistribute Aspen Search artwork, fonts, photography, or brand assets. The 3D plaque is generated from the supplied mark; it does not include a third-party model, texture, audio, or game file.
