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

Open **Datos por confirmar / Pending details** to confirm maximum HP, choose a Fighting Style, record languages, resolve knife equivalence and add missing background details. Fixed level-up HP is a proposal until explicitly accepted. Current HP and remaining resources begin unknown. Use **Iniciar al máximo / Start full** only after confirming the maximum, or record remaining resources manually.

The spell catalog explains Cure Wounds, Bless, Divine Favor, and Divine Smite. Only Cure Wounds starts in the chosen preparation list. Bless and Divine Favor require explicit adoption. Smite is always prepared and has a separate free use. The app tracks resource expenditure, not action legality; check the displayed timing and component requirements.

Choosing Blessed Warrior allows recording two Cleric cantrip names. Their effects are tracked manually using the linked official rules. No cantrips are granted by default.

Inventory distinguishes current quantity, historical quantity, ownership, and equipment. Unknown quantities, weights and money remain unknown. A partial known weight is explicitly labeled partial. Marking custom equipment as equipped does not automatically invent its armor or weapon mechanics; current calculations cover the documented chain shirt and weapons.

Use session controls for damage, healing, replacement temporary HP, death saves, resources, concentration and effects. Recent resource changes can be undone during the current visit. Notes are preserved when undoing resources. Short rests accept physical d10 results, including no dice; long rests show a preview and require confirmation. Rest timing, prerequisites, instant death, and custom effects remain matters for the table.

A local PNG, JPEG, or WebP portrait under 800 KB can be added from History. Images remain in your browser and backups.

## Local storage and backups

**Los cambios se guardan en este navegador y dispositivo. No se sincronizan con GitHub ni entre móvil y ordenador. Exportar/importar JSON permite trasladarlos. Cada visitante modifica su propia copia local.**

Changes are saved in the current browser and device, not to GitHub or other devices. Visitors receive the published initial character and modify a local copy. Use Settings to export or import JSON and print A4 in the selected language and depth.

Schema version 1 exports character data and choices, provenance and local modifications, table rules, inventory, money, session, preferences and export date. Imports are strictly validated, previewed and confirmed. Invalid or future-version backups leave the current state intact. The previous state is recoverable in Settings; if storage fails during backup, it is downloaded and also retained in memory.

Storage keys start with `dad-ficha-goran:v1:`. Character, inventory, money, session, preferences and table rules are written as separate immutable parts. A final head pointer commits the complete generation; the previous generation is retained. Failed writes preserve the preceding complete state. Browser Web Locks serialize saves where available, and revision checks plus storage events detect competing tabs. A conflict pauses saving and offers explicit resolution.

Blocked storage, quota errors or corruption produce a visible warning. Work remains in memory and can be exported. Existing damaged data is not silently replaced. There was no application schema before this release; future breaking changes must introduce a migration before raising the schema version. Additive schema-1 defaults preserve early development backups.

## Code layout

- `src/model.ts`: validated schemas and stable identifiers.
- `src/data.ts`: initial character, provenance and bilingual narrative.
- `src/calculations.ts`: pure derived calculations.
- `src/session.ts`: resource transitions.
- `src/*-rules.ts`, `src/rules.ts`: original bilingual explanations and live examples.
- `src/ui.ts`: shared labels and error translations.
- `src/persistence.ts`: versioned copies and transactional storage.
- `src/store.tsx`: application state, autosave, conflict handling and undo.
- `src/app.test.ts`: calculation, resource, validation and persistence tests.

Edit initial public data in `src/data.ts`. This changes the starting sheet for new visitors, not saved browser sessions. Change shared mechanics in the calculation or rule modules, rather than duplicating the four presentation combinations.

## Publication

GitHub Pages uses the Actions workflow, not raw source HTML. Every push to `main` runs `npm ci`, tests and the production build before deploying `dist`. Vite uses `base: '/dad-ficha-goran/'`. Actions are pinned to official versions referenced in the Vite deployment documentation.

The repository and initial bundle are public. Never commit browser backups, credentials, private test notes or character PDFs.

## Scope

This is a level-2 notebook, not an automated combat referee. Durations, ammunition, custom conditions, requirements and dice are tracked manually. No dice roller, accounts, backend, sync, PWA/offline guarantee, multi-character support or automatic level-up is included.

See [character notes](docs/character-notes.md), [rule sources](docs/rules-sources.md), [verification](docs/verification.md), and [attribution](ATTRIBUTION.md).
