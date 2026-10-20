import {initialState} from './data';
import {fullResources} from './session';
import type {State} from './model';
/** Explicit adoption only. Browser load never calls this function. */
export function adoptConfirmedProfile(current:State):State {
 const next=initialState();
 next.preferences={...current.preferences};
 next.character.style=current.character.style;
 next.character.portrait=current.character.portrait;
 next.character.daggerConfirmed=current.character.daggerConfirmed;
 for(const key of Object.keys(next.character.details) as (keyof State['character']['details'])[]){
  if(!next.character.details[key])next.character.details[key]=current.character.details[key];
 }
 next.character.modifications={...current.character.modifications,...next.character.modifications};
 next.tableRules.notes=current.tableRules.notes;
 for(const coin of ['cp','ep','pp'] as const)next.money[coin]=current.money[coin];
 next.inventory=next.inventory.map(item=>{
  const old=current.inventory.find(i=>i.id===item.id);
  if(!old)return item;
  if(item.provenance!=='confirmed')return {...old,equipped:item.id==='chain-shirt'?false:old.equipped};
  return {...item,notes:[item.notes,old.notes].filter((n,i,a)=>n&&a.indexOf(n)===i).join('\n'),weight:old.weight};
 });
 for(const item of current.inventory)if(!next.inventory.some(i=>i.id===item.id))next.inventory.push(structuredClone(item));
 next.session={...fullResources(next),notes:current.session.notes,number:3,exhaustion:0,concentration:null,effects:[]};
 return next;
}
