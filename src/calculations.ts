import type { Character, State, Resource } from './model';
import { abilityIds } from './model';
import { skills } from './data';
export const rules = {proficiency:2,level:2,lay:10,slots:2,smite:1,hitDice:2,hitDie:10,inspiration:1,prepared:3,toughPerLevel:2,speedFeet:30,armorBase:13,armorDexCap:2,dcBase:8};
export const mod=(score:number)=>Math.floor((score-10)/2);
export const signed=(n:number)=>n>=0?'+'+n:String(n);
export function maxHp(c:Character):number|null {
 const con=mod(c.abilities.con);
 if(c.hp.method==='pending')return null;
 if(c.hp.method==='manual')return Math.max(1,(c.hp.manual??1)+rules.level*(con-c.hp.conAtConfirmation));
 return Math.max(1,10+(c.hp.method==='fixed'?6:c.hp.roll??6)+rules.level*(con+rules.toughPerLevel));
}
export function derive(state:State) {
 const c=state.character;
 const modifiers=Object.fromEntries(abilityIds.map(a=>[a,mod(c.abilities[a])])) as Record<typeof abilityIds[number],number>;
 const trained=(id:string)=>c.skills.includes(id as Character['skills'][number]);
 const equipped=(id:string)=>state.inventory.some(i=>i.id===id&&i.equipped&&i.possession!=='absent');
 const armor=equipped('chain-shirt');
 const skillBonuses=Object.fromEntries(skills.map(s=>[s.id,modifiers[s.ability]+(trained(s.id)?rules.proficiency:0)]));
 const saves=Object.fromEntries(abilityIds.map(a=>[a,modifiers[a]+(c.saves.includes(a)?rules.proficiency:0)]));
 const maulEquipped=equipped('maul');
 return {modifiers,saves,skills:skillBonuses,maxHp:maxHp(c),fixedHp:10+6+rules.level*(modifiers.con+rules.toughPerLevel),
 ac:armor?rules.armorBase+Math.min(rules.armorDexCap,modifiers.dex)+(c.style==='defense'?1:0):10+modifiers.dex,
 armor,initiative:modifiers.dex,passive:10+skillBonuses.perception,
 melee:modifiers.str+rules.proficiency,ranged:modifiers.dex+rules.proficiency+(c.style==='archery'?2:0),
 topple:rules.dcBase+modifiers.str+rules.proficiency,spellDc:rules.dcBase+modifiers.cha+rules.proficiency,spellAttack:modifiers.cha+rules.proficiency,
 unarmedDie:c.style==='unarmed'?(state.inventory.some(i=>i.equipped&&['maul','shortbow','crossbow','knife'].includes(i.id))?6:8):4,
 daggerDamage:modifiers.str+(c.style==='dueling'&&!maulEquipped&&!equipped('shortbow')&&!equipped('crossbow')&&equipped('knife')?2:0)
 };
}
export function resourceMax(key:Resource,state:State):number|null {
 return key==='hp'?maxHp(state.character):key==='temp'?9999:key==='deathSuccess'||key==='deathFail'?3:key==='exhaustion'?6:rules[key];
}
export const concentrationDc=(damage:number)=>Math.min(30,Math.max(10,Math.floor(damage/2)));
export function weightTotal(state:State) {
 let known=0,partial=false;
 for(const i of state.inventory.filter(i=>i.possession!=='absent')) {
  if(i.quantity===null||i.weight===null||i.possession!=='owned'){partial=true;continue;}
  known+=i.quantity*i.weight;
 }
 return {known,partial};
}
export const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
