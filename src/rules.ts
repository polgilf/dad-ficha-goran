import type { State, Localized } from './model';
import {derive,rules,signed} from './calculations';
import {languageName} from './confirmed-data';
import {combatCards} from './combat-rules';
import {spellCards} from './spell-rules';
import {glossaryCards} from './glossary-rules';
export {sources,consulted,type RuleCard} from './rule-types';
export {spellNames} from './spell-rules';
export function catalog(state:State){
const d=derive(state);
const crossbow=state.inventory.find(i=>i.id==='crossbow');
const values:Record<string,string|number>={crossbowEs:crossbow?.possession==='owned'?'Posesión confirmada':'Posesión no confirmada',crossbowEn:crossbow?.possession==='owned'?'Ownership confirmed':'Ownership not confirmed',hpStatusEs:d.maxHp===null?'PG de nivel 2 pendientes.':'PG máximos actuales confirmados: '+d.maxHp+'.',hpStatusEn:d.maxHp===null?'Level 2 HP pending.':'Current confirmed maximum HP: '+d.maxHp+'.',languagesEs:'Idiomas adicionales registrados: '+(state.character.languages.filter(Boolean).map(v=>languageName(v,'es')).join(', ')||'pendientes')+'.',languagesEn:'Additional recorded languages: '+(state.character.languages.filter(Boolean).map(v=>languageName(v,'en')).join(', ')||'pending')+'.',str:signed(d.modifiers.str),dex:signed(d.modifiers.dex),cha:signed(d.modifiers.cha),con:signed(d.modifiers.con),conRaw:d.modifiers.con,conSave:signed(d.saves.con),melee:signed(d.melee),ranged:signed(d.ranged),topple:d.topple,ac:d.ac,spellAttack:signed(d.spellAttack),spellDc:d.spellDc,pb:rules.proficiency,slotsMax:rules.slots,layMax:rules.lay,preparedMax:rules.prepared,toughTotal:rules.toughPerLevel*rules.level,fixedHp:d.fixedHp,skillCount:state.character.skills.length,unarmedDie:d.unarmedDie,athletics:signed(d.skills.athletics),nature:signed(d.skills.nature),passive:d.passive,attackExample:12+d.melee,cureExample:Math.max(0,9+d.modifiers.cha),hitDieExample:Math.max(0,6+d.modifiers.con),daggerDamage:signed(d.daggerDamage),thrownDamage:signed(d.modifiers.str+(state.character.style==='thrown'?2:0)),daggerEs:state.character.daggerConfirmed?'Equivalencia confirmada.':'Equivalencia pendiente.',daggerEn:state.character.daggerConfirmed?'Equivalence confirmed.':'Equivalence pending.',greatEs:state.character.style==='great-weapon'?'Estilo: trata 1 y 2 del daño como 3.':'',greatEn:state.character.style==='great-weapon'?'Style: treat damage rolls of 1 and 2 as 3.':'',heavyEs:state.character.abilities.str<13?'FUE menor que 13: desventaja por Pesada.':'',heavyEn:state.character.abilities.str<13?'STR below 13: disadvantage from Heavy.':''};
const replace=(t:string)=>t.replace(/\{(\w+)\}/g,(_,key:string)=>String(values[key]??'{'+key+'}'));
const localized=(t:Localized):Localized=>({es:replace(t.es),en:replace(t.en)});
return [...combatCards,...spellCards,...glossaryCards].map(c=>({...c,consultedAt:c.id==='dc-ac'?'2026-10-20':undefined,quick:localized(c.quick),explanation:localized(c.explanation),steps:localized(c.steps),example:localized(c.example),mistakes:localized(c.mistakes)}));
}
