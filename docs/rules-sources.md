# Rule sources and editorial decisions

Consulted October 17, 2026. Rules edition: 2024, SRD 5.2.1. Explanations are original paraphrases. No manuals or private PDFs are bundled.

## Primary references

- [SRD landing page](https://www.dndbeyond.com/srd).
- [English SRD 5.2.1](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf).
- [Spanish SRD 5.2.1](https://media.dndbeyond.com/compendium-images/srd/5.2/SP_SRD_CC_v5.2.1.pdf).
- [2024 classes](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes), Paladin levels 1 and 2, class table, Spellcasting, Lay on Hands, Fighting Style and Paladin's Smite.
- [2024 spells](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions), Cure Wounds, Bless, Divine Favor, Divine Smite.
- [2024 glossary](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary), actions, conditions, Unarmed Strike, concentration and rests.
- [2024 feats](https://www.dndbeyond.com/sources/dnd/br-2024/feats), SRD Fighting Styles.
- Licensed Player's Handbook (2024) text in Roll20: [Tavern Brawler](https://roll20.net/compendium/dnd5e/Feats:Tavern%20Brawler?expansion=32231), [Tough](https://roll20.net/compendium/dnd5e/Feats:Tough?expansion=32231), [Dueling](https://roll20.net/compendium/dnd5e/Feats:Dueling?expansion=32231), [Blind Fighting](https://roll20.net/compendium/dnd5e/Feats:Blind%20Fighting?expansion=32231), [Interception](https://roll20.net/compendium/dnd5e/Feats:Interception?expansion=32231), [Protection](https://roll20.net/compendium/dnd5e/Feats:Protection?expansion=32231), [Thrown Weapon Fighting](https://roll20.net/compendium/dnd5e/Feats:Thrown%20Weapon%20Fighting?expansion=32231), [Unarmed Fighting](https://roll20.net/compendium/dnd5e/Feats:Unarmed%20Fighting?expansion=32231). Tough and Tavern Brawler are not presented as SRD feats.

## Sections and checked corrections

| Topic | Source section | Implemented rule |
| --- | --- | --- |
| Skills, saves, proficiency | SRD Playing the Game, pp. 6-8 | Proficiency once; final creation scores are not modified again |
| Action economy | SRD Combat; Paladin | One Attack-action attack at level 2; bonus actions remain limited |
| Topple and Slow | SRD Equipment, p. 90 | Target CON save, weapon-based DC; Slow needs hit and damage, no save, at most 10 ft reduction |
| Weapons and chain shirt | SRD Equipment, pp. 89-92 | Loading is a firing limit, not a separate full reload action; armor caps positive DEX at 2 |
| Unarmed, grapple, shove | SRD Rules Glossary | Target STR/DEX save; no 2014 contested grapple check |
| Tavern Brawler | Licensed PHB 2024, feat | d4 replacement, damage-1 reroll, improvised proficiency, once-per-turn push on own Attack action |
| Tough | Licensed PHB 2024, feat | +2 maximum HP per character level; no Hit Die healing bonus |
| Human | SRD Character Origins, p. 86 | Skill, Origin feat and Heroic Inspiration on long rest |
| Paladin resources | SRD Paladin, pp. 53-55 | Three chosen preparations, Smite always prepared; two slots and a separate free use |
| Cure Wounds | SRD spell entry | Action, touch, 2d8 + CHA, no concentration |
| Bless | SRD spell entry | Action, three targets, attacks and saves only; concentration; holy symbol worth 5+ GP, not consumed |
| Divine Favor | SRD spell entry | Bonus action, one minute, weapon attacks only, no concentration |
| Divine Smite | SRD spell entry | Bonus action immediately after qualifying hit, 2d8 radiant plus 1d8 against Fiends/Undead; free use retains requirements |
| Slot limit | SRD Spells, p. 105 | At most one spell slot spent to cast spells on a turn, not one spell per turn |
| Concentration | SRD Glossary, p. 179 | CON save after damage, higher of 10 or half damage rounded down, capped at 30; new concentration/incapacitation/death ends it |
| Critical hits | SRD Damage and Healing | Double attack damage dice, not flat modifiers |
| Rests | SRD Glossary, Long Rest p. 185 | Long rest restores all Hit Dice; short rest does not restore paladin spell slots or Lay on Hands |
| Zero HP and temporary HP | SRD Damage and Healing, pp. 17-18 | Temporary pools do not stack; manual death-save tracking with explicit exceptions |
| Rocks and tools | SRD Equipment and Improvised Weapons | DM adjudication; no invented giant-rock damage or cooking proficiency |

Spanish terminology was contrasted with the Spanish SRD, especially Maza a dos manos, Derribar and Ralentizar. Canonical English names are retained as aliases. The player's familiar terms remain searchable.

## Table rules

The confirmed Farmer substitution (Nature to Athletics) and the historical DM equipment pack are character/table inputs, not official defaults. Additional table notes are stored separately and do not automatically create mechanics. The balm's unspecified properties, holy-symbol value and knife equivalence remain unresolved.

## Technical references

- [Vite static deployment](https://vite.dev/guide/static-deploy), GitHub Pages base and official pinned workflow actions.
- [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), browser-local persistence and storage exceptions.

See [ATTRIBUTION.md](../ATTRIBUTION.md) for the SRD license notice.

## October 20, 2026 update

The player's October 20 confirmations and 1A clarification supply the new character data and slot rules. They are separate from official encumbrance weights. No official kg weights are imported into the slot system. Capacity 20 is recorded as declared, rather than inferred from Strength.

The [2024 Equipment armor table](https://www.dndbeyond.com/sources/dnd/br-2024/equipment) was checked for Splint Armor: AC 17 without DEX, Heavy armor, STR 15, Stealth disadvantage; below the Strength requirement speed falls by 10 ft. Defense adds 1 while wearing armor. Clothes, helmet and champion belt add no invented AC bonus.