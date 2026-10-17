import { backupSchema, stateSchema, type State } from './model';
import { initialState } from './data';
import { maxHp } from './calculations';
export const PREFIX='dad-ficha-goran:v1:';
export const HEAD=PREFIX+'head', RECOVERY=PREFIX+'recovery';
const parts=['character','session','preferences','inventory','money','tableRules'] as const;
export class PersistenceError extends Error {}
export function validateState(input:unknown):State {
 const state=stateSchema.parse(input);
 const max=maxHp(state.character);
 if(state.session.hp!==null&&(max===null||state.session.hp>max))throw new PersistenceError('invalid');
 return state;
}
export function exportJson(state:State):string {
 return JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),state},null,2);
}
export function parseBackup(raw:string):State {
 if(raw.length>4000000)throw new PersistenceError('fileSize');
 let value:unknown;
 try{value=JSON.parse(raw);}catch{throw new PersistenceError('invalid');}
 if(typeof value==='object'&&value!==null&&'schemaVersion' in value&&Number(value.schemaVersion)>1)throw new PersistenceError('future');
 try{return validateState(backupSchema.parse(value).state);}catch{throw new PersistenceError('invalid');}
}
export class Repository {
 constructor(public storage:Storage|null) {}
 head():string|null {
  if(!this.storage)throw new PersistenceError('storage');
  return this.storage.getItem(HEAD);
 }
 load():{state:State;revision:string|null;error:string|null} {
  try{
   const revision=this.head();
   if(!revision)return {state:initialState(),revision:null,error:null};
   const parsed=JSON.parse(revision);
   if(parsed.schemaVersion!==1||typeof parsed.id!=='string')throw new Error('invalid');
   const state:Record<string,unknown>={};
   for(const part of parts){const raw=this.storage!.getItem(PREFIX+parsed.id+':'+part);if(raw===null)throw new Error('missing');state[part]=JSON.parse(raw);}
   return {state:validateState(state),revision,error:null};
  }catch{return {state:initialState(),revision:null,error:'storageLoad'};}
 }
 save(state:State,expected:string|null):string {
  validateState(state);
  if(this.head()!==expected)throw new PersistenceError('conflict');
  const id=crypto.randomUUID(),written:string[]=[];
  let previousId:string|null=null,obsolete:string|null=null;
  try{if(expected){const old=JSON.parse(expected);if(typeof old.id==='string')previousId=old.id;if(typeof old.previous==='string')obsolete=old.previous;}}catch{/* Explicit recovery may replace a damaged head. */}
  try{
   for(const part of parts){const key=PREFIX+id+':'+part;this.storage!.setItem(key,JSON.stringify(state[part]));written.push(key);}
   if(this.head()!==expected)throw new PersistenceError('conflict');
   const revision=JSON.stringify({schemaVersion:1,id,previous:previousId});
   this.storage!.setItem(HEAD,revision);
   // The pointer is the commit. Retain the previous complete generation.
   if(obsolete)for(const part of parts){try{this.storage!.removeItem(PREFIX+obsolete+':'+part);}catch{/* harmless stale snapshot */}}
   return revision;
  }catch(error){
   for(const key of written){try{this.storage!.removeItem(key);}catch{/* preserve readable data */}}
   if(error instanceof PersistenceError)throw error;
   throw new PersistenceError('storage');
  }
 }
 backup(state:State){if(!this.storage)throw new PersistenceError('storage');this.storage.setItem(RECOVERY,exportJson(state));}
 recovery():State|null{try{const raw=this.storage?.getItem(RECOVERY);return raw?parseBackup(raw):null;}catch{return null;}}
 raw():string {
  const data:Record<string,string|null>={};
  if(this.storage)for(let i=0;i<this.storage.length;i++){const key=this.storage.key(i);if(key?.startsWith('dad-ficha-goran:'))data[key]=this.storage.getItem(key);}
  return JSON.stringify(data,null,2);
 }
}
export function browserRepository():Repository {
 try{return new Repository(window.localStorage);}catch{return new Repository(null);}
}
export function download(name:string,text:string,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type}));
 const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
