# Jean-Luc Peloquin — Portfolio

A responsive personal portfolio for Jean-Luc Peloquin, built as a precise editorial system around software engineering, computer vision, data products, and interactive interfaces.

## Highlights

- Custom procedural Three.js precision object with an assembly sequence, pointer parallax, scroll response, mobile quality controls, offscreen pausing, and a reduced-motion fallback
- Responsive light/dark editorial layout with live Las Vegas and New York clocks
- Accessible mobile navigation and contact dialogs with native focus trapping and Escape handling
- Selectable project case studies and an autoplaying, user-pausable principles carousel
- Self-hosted open-source fonts and optimized WebP portraits
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

## Structure

```text
index.html              Main portfolio
privacy.html            Privacy details
404.html                Static 404 page
src/main.js             Page interactions and UI state
src/artifact.js         Procedural Three.js model and animation
src/style.css           Design system and responsive layouts
public/                 Optimized images, social card, and favicon
.github/workflows/      GitHub Pages deployment
```

## Deployment

The Pages workflow builds the Vite project on pushes to `main` and deploys `dist/`. The Vite base is relative so assets work from a GitHub Pages repository subpath.

## Provenance

See [ASSET_PROVENANCE.md](./ASSET_PROVENANCE.md). The site recreates its editorial and halftone system in code and does not redistribute Aspen Search artwork, fonts, photography, or brand assets. The 3D object is original procedural geometry informed by public visual research; it does not include a Riot Games model, texture, mark, or audio asset.
