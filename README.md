# Ficha de Goran

A bilingual, mobile-first character notebook for Goran Gork, Human Paladin 2, using the 2024 rules. Spanish / English and Quick / Detailed are independent preferences. The initial view is Spanish and Quick.

- Application: https://polgilf.github.io/dad-ficha-goran/
- Repository: https://github.com/polgilf/dad-ficha-goran

## Install and develop

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite serves the project under `/dad-ficha-goran/`. Navigation uses hashes, so reloading a section does not need server redirects. The production output is `dist/`.

## Using the notebook

The first screen shows HP, AC, primary resources, and the maul shortcut. The six sections cover the sheet, combat, spells, traits, inventory, and story. Search accepts Spanish and English names and aliases without case or accent sensitivity. Quick cards can open individual explanations without changing the global depth.

Open **Datos por confirmar / Pending details** to confirm maximum HP, choose a Fighting Style, record languages, resolve knife equivalence and add missing background details. The October 20 confirmations start new copies at session 3 with 26 HP and full resources. Existing browser copies are preserved; **Cargar ficha de sesión 3 / Load session 3 sheet** applies the confirmed update explicitly, with a recoverable previous copy.

The spell catalog explains Cure Wounds, Bless, Divine Favor, and Divine Smite. Cure Wounds, Bless and Divine Favor are confirmed and selected in new copies. Smite is always prepared and has a separate free use. The app tracks resource expenditure, not action legality; check the displayed timing and component requirements.

Fighting Style remains selectable without a default bonus. Blessed Warrior is excluded by player choice. No cantrips are granted. Legacy cantrip choices are archived during migration.

Inventory distinguishes current quantity, historical quantity, ownership, and equipment. The DM load system uses slots, not kilograms. Items marked 1A cost one slot per started group of five. Capacity is manually recorded as 20; known load is 17 and remains partial for unspecified costs or ownership. Unknown values remain unknown. Gold accepts decimals; 24.5 GP and 5 SP remain separate entries. Marking custom equipment as equipped does not automatically invent its armor or weapon mechanics; current calculations cover the chain shirt, splint armor and documented weapons. Splint is equipped with AC 17, or 18 if Defense is selected; Dexterity is not added.

Use session controls for damage, healing, replacement temporary HP, death saves, resources, concentration and effects. Recent resource changes can be undone during the current visit. Notes are preserved when undoing resources. Short rests accept physical d10 results, including no dice; long rests show a preview and require confirmation. Rest timing, prerequisites, instant death, and custom effects remain matters for the table.

A local PNG, JPEG, or WebP portrait under 800 KB can be added from History. Images remain in your browser and backups.

## Local storage and backups

**Los cambios se guardan en este navegador y dispositivo. No se sincronizan con GitHub ni entre móvil y ordenador. Exportar/importar JSON permite trasladarlos. Cada visitante modifica su propia copia local.**

Changes are saved in the current browser and device, not to GitHub or other devices. Visitors receive the published initial character and modify a local copy. Use Settings to export or import JSON and print A4 in the selected language and depth.

Schema version 2 exports character data and choices, provenance and local modifications, table rules, inventory, money, session, preferences and export date. Imports are strictly validated, previewed and confirmed. Invalid or future-version backups leave the current state intact. The previous state is recoverable in Settings; if storage fails during backup, it is downloaded and also retained in memory.

Storage keys start with `dad-ficha-goran:v1:`. Character, inventory, money, session, preferences and table rules are written as separate immutable parts. A final head pointer commits the complete generation; the previous generation is retained. Failed writes preserve the preceding complete state. Browser Web Locks serialize saves where available, and revision checks plus storage events detect competing tabs. A conflict pauses saving and offers explicit resolution.

Blocked storage, quota errors or corruption produce a visible warning. Work remains in memory and can be exported. Existing damaged data is not silently replaced. Schema 1 backups and stored generations are migrated on reading. Existing HP, resources, notes and physical weights are preserved; kg are not reinterpreted as slots. The storage-key prefix remains stable for compatibility, while generation headers and exports carry schema version 2.

## Code layout

- `src/model.ts`: validated schemas and stable identifiers.
- `src/data.ts`: historical starting data and bilingual narrative.
- `src/confirmed-data.ts`: October 20 session-3 confirmations, table slots and proposed origins.
- `src/profile-update.ts`: explicit application of confirmed defaults with preserved local fields.
- `src/calculations.ts`: pure derived calculations.
- `src/session.ts`: resource transitions.
- `src/*-rules.ts`, `src/rules.ts`: original bilingual explanations and live examples.
- `src/ui.ts`: shared labels and error translations.
- `src/persistence.ts`: versioned copies and transactional storage.
- `src/store.tsx`: application state, autosave, conflict handling and undo.
- `src/app.test.ts`: historical calculation, resource, validation and persistence regression tests.
- `src/session-three.test.ts`: confirmed defaults, 1A grouping, armor, money, migration and explicit-update tests.

Edit historical data in `src/data.ts` and current confirmed defaults in `src/confirmed-data.ts`. This changes the starting sheet for new visitors, not saved browser sessions. Change shared mechanics in the calculation or rule modules, rather than duplicating the four presentation combinations.

## Publication

GitHub Pages uses the Actions workflow, not raw source HTML. Every push to `main` runs `npm ci`, tests and the production build before deploying `dist`. Vite uses `base: '/dad-ficha-goran/'`. Actions are pinned to official versions referenced in the Vite deployment documentation.

The repository and initial bundle are public. Never commit browser backups, credentials, private test notes or character PDFs.

## Scope

This is a level-2 notebook, not an automated combat referee. Durations, ammunition, custom conditions, requirements and dice are tracked manually. No dice roller, accounts, backend, sync, PWA/offline guarantee, multi-character support or automatic level-up is included.

See [character notes](docs/character-notes.md), [rule sources](docs/rules-sources.md), [verification](docs/verification.md), and [attribution](ATTRIBUTION.md).
