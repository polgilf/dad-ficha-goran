# Goran logo

`src/assets/goran-logo.webp` is the user-supplied golden dragon medallion, prepared with the built-in image editing tool to remove the white exterior while keeping the dark interior and the complete emblem. The production asset is 256 × 256, 31,878 bytes, with alpha transparency.

The header displays it at 54 × 54 CSS pixels on desktop and 44 × 44 on mobile, including screens below 375 px. Alternative text is available in Spanish and English. Vite imports and fingerprints the asset under the configured GitHub Pages base path.

The production preview was visually checked on desktop and at a 320 px viewport: the logo loads, remains visible, has no white background, and causes no horizontal overflow. Browser console checks returned no warnings or errors. All 39 existing tests and the TypeScript / Vite build pass.

## Colors and title

The main accent is `#2c1808`, sampled from the dominant dark interior of the medallion. Highlighted boxes, selected tabs and primary actions use this brown, with sand and copper tones replacing the previous green tints throughout the interface. The browser theme color matches it.

The masthead title uses locally served Cinzel at weight 800, chosen for its sturdy, carved lettering. Only the character name uses this face. The WOFF2 file is 15,260 bytes; its SIL Open Font License is distributed in `public/licenses/Cinzel-OFL.txt`. The production preview was checked on desktop and at 320 px: the font loads, the logo and title fit beside the preferences without overlap, and there is no horizontal document overflow or browser console error. The 39 existing tests and production build pass.

## Image editing prompt

> Use case: background-extraction. Asset type: website header logo. Input image: edit target, the user's supplied golden dragon circular medallion. Remove ONLY the pure white exterior background outside the medallion, replacing it with real alpha transparency. Preserve the complete medallion exactly: golden dragon, star, dark brown interior disk, all circular gold rim details, colors, proportions and orientation. Do not redraw, restyle or reinterpret any part. Keep a clean antialiased outer edge with no white halo, tight centered square framing and small transparent padding. Output transparent PNG, no added elements, no text.

The transparent output was then resized and encoded as WebP for delivery; alpha transparency was retained.
