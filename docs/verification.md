# Verification

## Automated checks

39 Vitest tests pass. Coverage includes the six attributes and saves, all 18 skills, STR dependencies, independent spell DC, HP confirmation and Constitution adjustments, Fighting Style conditions, unknown inventory and money, partial weights, resource bounds, temporary HP absorption/replacement, separate free Smite and slots, preparation checks, concentration/Favor coexistence, short/long rests, JSON validation, corrupt and future-version rejection, quota-safe writes, recovery copies, conflicting tabs, bilingual search normalization and complete rule text in all four presentation combinations.

TypeScript checking and the Vite production build pass. The generated entry and assets use the project base path. The dependency installation reported no vulnerabilities.

## Browser checks

The real application was reviewed in the available in-app browser, including desktop and 390 px / 360 px layouts. The initial screen exposes HP, AC, all primary resource counters and the maul shortcut. There was no horizontal document overflow at the tested mobile widths; section navigation scrolls horizontally.

Verified through the UI: explicit acceptance of fixed 26 HP; explicit full-resource initialization; 8 damage resulting in 18/26 HP; preserving those values and the active section across language/depth changes; adopting the proposed prepared trio; persistence after reload on a hash section.

Additional results are recorded below.

## Practical limits

This is a manual play aid. The browser was tested with the available desktop engine and mobile viewport sizes, not on physical iOS/Android hardware. Native printing and browser storage behavior can vary by browser. No offline/PWA, synchronization or automatic encounter arbitration is claimed.

## Additional browser results

All four language/depth combinations were exercised. English Quick survived reload with the chosen trio, active Spells section and 18/26 HP. A free Smite changed only its free-use pool; a slot-based Smite changed only slots; Undo restored the last resource change. Searching CASTIGO while in English found Divine Smite. Full detail opened without changing global Quick mode. Escape closed the dialog and focus returned. Spanish Detailed at 768 px retained the section and resources without document overflow.

A temporary development-only React context error occurred during hot module replacement after editing the provider; a full reload restored the application. Production console status is checked separately.

The print stylesheet declares A4, exposes all character sections in the selected language/depth and suppresses controls. Native print-preview pagination and physical output were not visually verified: the available browser API does not expose print-to-PDF or native printer controls. Full keyboard traversal and the JSON file-picker roundtrip were not exhaustively exercised in the browser; validation, roundtrip and recovery failure paths are covered by automated tests. Physical mobile devices were not available.

A clean npm ci completed successfully, followed by all 39 tests and a production build.

The production build was opened from the project subdirectory in a fresh browser tab. It rendered the initial pending HP and resources correctly with no console errors or warnings. Export JSON produced a browser download successfully.
