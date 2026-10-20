import { pair, type Localized } from './model';
export type RuleCard={id:string;name:Localized;group:'combat'|'spells'|'traits'|'glossary';quick:Localized;explanation:Localized;steps:Localized;example:Localized;mistakes:Localized;source:string;section:string;aliases:string[];consultedAt?:string};
export const sources={
srd:{name:'SRD 5.2.1 · 2024',url:'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf'},
classes:{name:'D&D Beyond · Basic Rules 2024',url:'https://www.dndbeyond.com/sources/dnd/br-2024/character-classes'},
tavern:{name:'Player’s Handbook 2024 · Roll20 (licensed)',url:'https://roll20.net/compendium/dnd5e/Feats:Tavern%20Brawler?expansion=32231'},
tough:{name:'Player’s Handbook 2024 · Roll20 (licensed)',url:'https://roll20.net/compendium/dnd5e/Feats:Tough?expansion=32231'}
};
export const consulted='2026-10-17';
export function card(id:string,es:string,en:string,group:RuleCard['group'],quick:Localized,explanation:Localized,steps:Localized,example:Localized,mistakes:Localized,section:string,source='srd',aliases:string[]=[]):RuleCard{return {id,name:pair(es,en),group,quick,explanation,steps,example,mistakes,section,source,aliases};}
