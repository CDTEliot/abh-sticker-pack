# ABH Holographic Sticker Pack

A locally bundled Three.js experience using the four original supplied Figma exports.

Serve `dist/` with any static web server. No build step or remote runtime dependencies.

## Material

Original artwork and silhouette, neutral vinyl edges, full-face holographic clear coat, UV-anchored microflakes, pearlescent whites, and 4/6-point glints. The shader uses view/light directions and the deformed mesh normals. It has no time input: nothing sparkles independently of the material angle.

## Interaction

- Drag the center to move the whole sticker with inertia and a damped spring return.
- Pull an edge or corner to peel the 2,925-vertex sheet along a cylindrical fold. Arc length is preserved so the material curls without stretching; near-critical damping gives a firm, controlled release.
- Hover to tilt the surface and reveal foil highlights.
- Choose a sticker with the thumbnails, arrows, or keys 1–4.
- Reduced-motion preferences disable idle movement. Direct manipulation remains available.

## Files

`app.js`: rendering, selection, picking, body spring and projected handle.
`sheet.js`: arc-length-preserving peel geometry and damped release.
`material.js`: angle-dependent foil, embedded glitter and clear-coat shading.

Original artwork: Agentic Banking Hackathon / Airwallex, supplied Figma file.
Interaction reference: https://www.bubbbly.com/sticker-pack
Three.js v0.170.0 is bundled locally under the MIT license.
