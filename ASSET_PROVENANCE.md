# Asset provenance

## First-party material

- `public/images/jean-luc.webp` is an optimized derivative of the portrait already tracked in this repository as `images/luc.jpg`.
- `public/images/jean-luc-current.webp` is an optimized derivative of `images/image.png`.
- `public/logo-flat.png` is the square logo supplied for this redesign and is used as the flat header mark.
- `assets/source/tour-de-force-inverted.png` is the authoritative 512×512 inverted mark supplied for the engraved plaque. Its alpha channel is the sole source of the generated logo geometry.
- `public/logo-inverted.svg`, `public/models/tour-de-force-plaque.glb`, and `src/generated/logo-ascii.js` are deterministic derivatives generated from that alpha mask by `scripts/logo-model.mjs`. The SVG is the loading and failure fallback, the GLB contains the machined plaque geometry, and the ASCII rendition is used by the startup screen.
- `public/images/hero-scope.png` is the user-supplied PNG used as the hero surname background in place of the previous CSS halftone scope.
- Project posters, halftone fields, reticles, UI diagrams, favicon wrapper, and social card are original code/SVG compositions created for this portfolio.
- The engraved plaque uses locally generated contour geometry and procedural Three.js lighting. No third-party 3D model or texture is included or distributed.

## Open-source fonts

- [Manrope](https://github.com/sharanda/manrope), distributed under the SIL Open Font License 1.1.
- [IBM Plex Mono](https://github.com/IBM/plex), distributed under the SIL Open Font License 1.1.

The font files are installed through Fontsource packages and bundled locally.

## Visual research only

- [Aspen Search](https://www.aspensearch.com/) informed the editorial grid, sectional pacing, halftone approach, live clocks, and drawer interaction pattern. No Aspen font, logo, photograph, client mark, testimonial, source asset, or copy is redistributed.
- Riot Games’ [Chamber agent page](https://playvalorant.com/en-us/agents/chamber/) and the community [Tour De Force reference page](https://valorant.fandom.com/wiki/Tour_De_Force) were visual research for the earlier direction only. The shipped object is generated from the user-supplied mark and uses no Riot model, texture, audio, or game file.

VALORANT and Tour De Force are trademarks or creative properties of Riot Games. This personal portfolio is not affiliated with or endorsed by Riot Games, Aspen Search, or the referenced sites.
