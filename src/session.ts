import type { State, Session, Resource } from './model';
import { maxHp, mod, resourceMax, rules } from './calculations';
export class RuleError extends Error {}
export function setResource(state:State,key:Resource,value:number|null):Session {
 const max=resourceMax(key,state);
 if(value!==null&&(!Number.isInteger(value)||value<0||(max!==null&&value>max)))throw new RuleError('bounds');
 if(key==='hp'&&value!==null&&max===null)throw new RuleError('resolveHp');
 const next={...state.session,[key]:value};
 if(key==='hp'&&value!==null&&value>0){next.deathSuccess=0;next.deathFail=0;}
 if(key==='hp'&&value===0)next.concentration=null;
 return next;
}
export function spend(state:State,key:'slots'|'lay'|'smite'|'hitDice'|'inspiration',amount=1):Session {
 const value=state.session[key];
 if(value===null)throw new RuleError('unknownResource');
 if(!Number.isInteger(amount)||amount<1||amount>value)throw new RuleError('notEnough');
 return {...state.session,[key]:value-amount};
}
export function damage(state:State,amount:number):Session {
 const s=state.session;
 if(s.hp===null||s.temp===null)throw new RuleError('unknownHp');
 if(!Number.isInteger(amount)||amount<1)throw new RuleError('positive');
 const absorbed=Math.min(s.temp,amount),hp=Math.max(0,s.hp-(amount-absorbed));
 return {...s,temp:s.temp-absorbed,hp,concentration:hp===0?null:s.concentration};
}
export function heal(state:State,amount:number):Session {
 if(state.session.hp===null||maxHp(state.character)===null)throw new RuleError('unknownHp');
 if(!Number.isInteger(amount)||amount<1)throw new RuleError('positive');
 return {...state.session,hp:Math.min(maxHp(state.character)!,state.session.hp+amount),deathSuccess:0,deathFail:0};
}
export function fullResources(state:State):Session {
 const hp=maxHp(state.character);
 if(hp===null)throw new RuleError('resolveHp');
 return {...state.session,hp,temp:0,slots:rules.slots,lay:rules.lay,smite:rules.smite,hitDice:rules.hitDice,inspiration:1,deathSuccess:0,deathFail:0};
}
export function longRest(state:State):Session {
 if(state.session.hp===null||state.session.hp<1)throw new RuleError('restHp');
 return {...fullResources(state),concentration:null,effects:state.session.effects.filter(e=>e.id!=='divine-favor'),exhaustion:state.session.exhaustion===null?null:Math.max(0,state.session.exhaustion-1)};
}
export function shortRest(state:State,rolls:number[]):Session {
 if(rolls.length>2||rolls.some(r=>!Number.isInteger(r)||r<1||r>rules.hitDie))throw new RuleError('dice');
 const used=rolls.length?spend(state,'hitDice',rolls.length):state.session;
 const healing=rolls.reduce((sum,roll)=>sum+Math.max(0,roll+mod(state.character.abilities.con)),0);
 const next=healing?heal({...state,session:used},healing):used;
 return {...next,concentration:next.concentration==='bless'?null:next.concentration,effects:next.effects.filter(e=>e.id!=='divine-favor')};
}
export function cast(state:State,id:string,free=false):Session {
 if(id!=='divine-smite'&&!state.character.prepared.includes(id as State['character']['prepared'][number]))throw new RuleError('notPrepared');
 if(free&&id!=='divine-smite')throw new RuleError('notFree');
 let next=spend(state,free?'smite':'slots');
 if(id==='bless')next={...next,concentration:'bless'};
 if(id==='divine-favor')next={...next,effects:[...next.effects.filter(e=>e.id!=='divine-favor'),{id:'divine-favor',name:'divine-favor',duration:'1 min'}]};
 return next;
}
