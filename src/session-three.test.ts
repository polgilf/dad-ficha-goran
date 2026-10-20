import {describe,it,expect} from 'vitest';
import {initialState,legacyInitialState} from './data';
import {PROFILE_REVISION} from './confirmed-data';
import {derive,itemSlots,slotTotal,equipItem} from './calculations';
import {styleIds} from './model';
import {exportJson,parseBackup,Repository,HEAD,PREFIX,validateState} from './persistence';
import {adoptConfirmedProfile} from './profile-update';
import {catalog} from './rules';

describe('Confirmed session 3',()=>{
 it('starts with 26 HP and complete resources without choosing a style',()=>{
  const s=initialState();expect(s.character.profileRevision).toBe(PROFILE_REVISION);
  expect(s.character.hp.method).toBe('fixed');expect(derive(s).maxHp).toBe(26);
  expect(s.session).toMatchObject({number:3,hp:26,temp:0,slots:2,lay:10,smite:1,hitDice:2,inspiration:1,exhaustion:0,deathSuccess:0,deathFail:0,concentration:null,effects:[]});
  expect(s.character.style).toBe('pending');expect(s.character.cantrips).toEqual([]);expect(styleIds).not.toContain('blessed');
 });
 it('records the trio, languages and selected masteries without adding a proficiency',()=>{
  const s=initialState();expect(s.character.prepared).toEqual(['cure-wounds','bless','divine-favor']);
  expect(s.character.languages).toEqual(['Enano','Élfico']);expect(s.character.weaponMasteries).toEqual(['maul','crossbow']);
  expect(s.character.skills).toEqual(legacyInitialState().character.skills);expect(s.character.provenance.skillOrigins).toBe('proposed');
 });
 it('uses splint AC without DEX and adds Defense only on selection',()=>{
  const s=initialState();expect(derive(s)).toMatchObject({ac:17,armorId:'splint',speedFeet:30,stealthDisadvantage:true});
  s.character.abilities.dex=20;expect(derive(s).ac).toBe(17);s.character.style='defense';expect(derive(s).ac).toBe(18);
  expect(derive(equipItem(s,'splint',false)).ac).toBe(15);
 });
 it('reduces speed under the splint STR requirement without changing spell DC',()=>{
  const s=initialState();s.character.abilities.str=14;
  expect(derive(s)).toMatchObject({speedFeet:20,speedMeters:6,spellDc:11});
 });
 it('replacing armor never stacks chain shirt and splint',()=>{
  const s=equipItem(initialState(),'chain-shirt',true);
  expect(s.inventory.find(i=>i.id==='splint')!.equipped).toBe(false);expect(derive(s).ac).toBe(15);
  const next=equipItem(s,'splint',true);expect(next.inventory.find(i=>i.id==='chain-shirt')!.equipped).toBe(false);expect(derive(next).ac).toBe(17);
 });
 it.each([[0,0],[1,1],[5,1],[6,2],[10,2],[11,3]])('1A: %i units use %i slots',(quantity,slots)=>{
  const arrow={...initialState().inventory.find(i=>i.id==='arrows')!,quantity};expect(itemSlots(arrow)).toBe(slots);
 });
 it('sums 17 known slots but does not invent the remaining unknown load',()=>{
  const s=initialState();const total=slotTotal(s);expect(total).toMatchObject({known:17,capacity:20,partial:true});expect(total.unknown).toContain('crossbow');
  const arrows=s.inventory.find(i=>i.id==='arrows')!;arrows.quantity=6;expect(slotTotal(s).known).toBe(18);
  expect(s.tableRules.slotFormula).toContain('= 20');
 });
 it('records current equipment without inventing bolts or discarding historical gear',()=>{
  const s=initialState();expect(s.inventory.find(i=>i.id==='crossbow')).toMatchObject({quantity:1,possession:'owned',slotCost:null});
  expect(s.inventory.some(i=>i.id==='bolts')).toBe(false);
  expect(s.inventory.find(i=>i.id==='shortbow')?.possession).toBe('historical');
  expect(s.inventory.find(i=>i.id==='chain-shirt')?.equipped).toBe(false);
  expect(s.inventory.find(i=>i.id==='carpenters')).toMatchObject({quantity:1,slotCost:3});
  expect(s.inventory.find(i=>i.id==='bandolier')?.equipped).toBe(true);
 });
 it('roundtrips fractional gold without merging the separately recorded silver',()=>{
  const s=initialState();expect(s.money).toEqual({cp:null,sp:5,ep:null,gp:24.5,pp:null});
  expect(parseBackup(exportJson(s))).toEqual(s);s.money.gp=24.75;expect(validateState(s).money.gp).toBe(24.75);
  s.money.gp=-1;expect(()=>validateState(s)).toThrow();
 });
 it('replaces stale ownership and language warnings in both rule languages',()=>{
  const cards=catalog(initialState());
  expect(cards.find(c=>c.id==='crossbow')!.quick.es).toContain('Posesión confirmada');
  expect(cards.find(c=>c.id==='crossbow')!.quick.en).toContain('Ownership confirmed');
  expect(cards.find(c=>c.id==='tough')!.explanation.es).toContain('26');
  expect(cards.find(c=>c.id==='human')!.mistakes.en).toContain('Dwarvish, Elvish');
 });
});
describe('Version 1 migration and explicit profile adoption',()=>{
 const envelope=(state:unknown)=>JSON.stringify({schemaVersion:1,exportedAt:'2026-10-17T12:00:00.000Z',state});
 it('does not replace a legacy session or interpret kg as slots',()=>{
  const s=legacyInitialState();s.session.notes='Local note';s.session.slots=1;s.inventory[0].weight=9;
  const migrated=parseBackup(envelope(s));expect(migrated).toEqual(s);expect(migrated.inventory[0].slotCost).toBeUndefined();expect(migrated.character.profileRevision).toBeUndefined();
 });
 it('archives excluded Blessed Warrior and cantrips rather than granting them',()=>{
  const s=legacyInitialState();const raw={...s,character:{...s.character,style:'blessed',cantrips:['Guidance','Sacred Flame']}};
  const migrated=parseBackup(envelope(raw));expect(migrated.character.style).toBe('pending');expect(migrated.character.cantrips).toEqual([]);
  expect(migrated.character.modifications.legacyBlessedWarrior).toContain('Guidance');
  expect(raw.character.style).toBe('blessed');
 });
 it('preserves recorded choices and notes on explicit adoption, with a fresh session',()=>{
  const s=legacyInitialState();s.character.style='defense';s.session.notes='My session notes';s.character.details.weight='110 kg';
  s.preferences={language:'en',depth:'detailed',section:'inventory'};s.tableRules.notes='House note';s.money.cp=9;
  const next=adoptConfirmedProfile(s);expect(next.session.hp).toBe(26);expect(next.session.notes).toBe('My session notes');
  expect(next.character.style).toBe('defense');expect(derive(next).ac).toBe(18);expect(next.preferences).toEqual(s.preferences);
  expect(next.character.details.weight).toBe('110 kg');expect(next.tableRules.notes).toBe('House note');expect(next.money.cp).toBe(9);
  expect(s.session.hp).toBeNull();expect(s.character.profileRevision).toBeUndefined();
 });
 it('loads old stored generations without rewriting or resetting them',()=>{
  const map=new Map<string,string>(),storage:Storage={get length(){return map.size;},clear:()=>map.clear(),getItem:k=>map.get(k)??null,key:i=>[...map.keys()][i]??null,removeItem:k=>{map.delete(k);},setItem:(k,v)=>{map.set(k,v);}};
  const legacy=legacyInitialState();legacy.session.slots=1;
  const head=JSON.stringify({schemaVersion:1,id:'old',previous:null});storage.setItem(HEAD,head);
  for(const [key,value]of Object.entries(legacy))storage.setItem(PREFIX+'old:'+key,JSON.stringify(value));
  const repo=new Repository(storage),loaded=repo.load();expect(loaded.error).toBeNull();expect(loaded.state.session.slots).toBe(1);expect(repo.head()).toBe(head);
  repo.backup(loaded.state);repo.save(adoptConfirmedProfile(loaded.state),loaded.revision);
  expect(repo.recovery()!.session.slots).toBe(1);expect(repo.load().state.session.number).toBe(3);
 });
});
