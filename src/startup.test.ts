import {describe,it,expect} from 'vitest';
import {initialState,legacyInitialState} from './data';
import {Repository,HEAD,PREVIOUS_PROFILE} from './persistence';
import {prepareStartup,saveStartupState,markProfileChoice,DEFAULT_APPLIED_KEY} from './startup';
import {PROFILE_REVISION} from './confirmed-data';
class MemoryStorage implements Storage{
 map=new Map<string,string>();fail=false;
 get length(){return this.map.size;}
 clear(){this.map.clear();}
 getItem(k:string){return this.map.get(k)??null;}
 key(i:number){return [...this.map.keys()][i]??null;}
 removeItem(k:string){this.map.delete(k);}
 setItem(k:string,v:string){if(this.fail)throw new Error('quota');this.map.set(k,v);}
}
describe('Default session three and persistent rollback',()=>{
 it('upgrades an old profile automatically while preparing its exact previous state',()=>{
  const repo=new Repository(new MemoryStorage()),old=legacyInitialState();old.session.slots=1;old.session.notes='Keep this note';repo.save(old,null);
  const before=repo.head(),boot=prepareStartup(repo);
  expect(boot.state.character.profileRevision).toBe(PROFILE_REVISION);expect(boot.state.session).toMatchObject({hp:26,slots:2,number:3,notes:'Keep this note'});
  expect(boot.previous).toEqual(old);expect(repo.head()).toBe(before);
  saveStartupState(repo,boot.state,boot.revision,boot.previous);
  expect(repo.previousProfile()).toEqual(old);expect(repo.load().state.session.hp).toBe(26);
 });
 it('does not reset an existing session-three character on first load of this release',()=>{
  const repo=new Repository(new MemoryStorage()),current=initialState();current.session.hp=7;current.session.slots=0;repo.save(current,null);
  const boot=prepareStartup(repo);expect(boot.state.session.hp).toBe(7);expect(boot.state.session.slots).toBe(0);
  expect(boot.state.character.modifications[DEFAULT_APPLIED_KEY]).toBe(PROFILE_REVISION);
 });
 it('does not reset resources on subsequent reloads',()=>{
  const repo=new Repository(new MemoryStorage());repo.save(legacyInitialState(),null);
  const boot=prepareStartup(repo);let revision=saveStartupState(repo,boot.state,boot.revision,boot.previous);
  boot.state.session.hp=11;revision=repo.save(boot.state,revision);
  expect(prepareStartup(repo).state.session.hp).toBe(11);expect(repo.head()).toBe(revision);
 });
 it('keeps the restored previous sheet active after a reload',()=>{
  const repo=new Repository(new MemoryStorage()),old=legacyInitialState();old.session.notes='Previous notes';repo.save(old,null);
  const boot=prepareStartup(repo),revision=saveStartupState(repo,boot.state,boot.revision,boot.previous);
  repo.backup(boot.state);repo.save(markProfileChoice(repo.previousProfile()!),revision);
  const restored=prepareStartup(repo);expect(restored.state.character.profileRevision).toBeUndefined();expect(restored.state.session.hp).toBeNull();
  expect(restored.state.session.notes).toBe('Previous notes');expect(repo.recovery()!.session.number).toBe(3);
 });
 it('preserves the pre-session-three sheet through unrelated import backups',()=>{
  const repo=new Repository(new MemoryStorage()),old=legacyInitialState();repo.save(old,null);
  const boot=prepareStartup(repo);saveStartupState(repo,boot.state,boot.revision,boot.previous);
  repo.backup(initialState());repo.ensurePreviousProfile(initialState());expect(repo.previousProfile()).toEqual(old);
 });
 it('captures a previous legacy recovery copy for users who already adopted session three',()=>{
  const repo=new Repository(new MemoryStorage()),old=legacyInitialState();old.session.slots=1;repo.backup(old);repo.save(initialState(),null);
  const boot=prepareStartup(repo);saveStartupState(repo,boot.state,boot.revision,boot.previous);
  expect(repo.previousProfile()).toEqual(old);
 });
 it('does not overwrite the old current state if the backup cannot be saved',()=>{
  const storage=new MemoryStorage(),repo=new Repository(storage);repo.save(legacyInitialState(),null);
  const originalHead=storage.getItem(HEAD),boot=prepareStartup(repo);storage.fail=true;
  expect(()=>saveStartupState(repo,boot.state,boot.revision,boot.previous)).toThrow();
  expect(repo.head()).toBe(originalHead);expect(repo.load().state.session.hp).toBeNull();expect(storage.getItem(PREVIOUS_PROFILE)).toBeNull();
 });
 it('detects another-tab changes before writing a backup or replacing its state',()=>{
  const storage=new MemoryStorage(),repo=new Repository(storage);repo.save(legacyInitialState(),null);
  const boot=prepareStartup(repo),other=repo.load();other.state.session.slots=1;repo.save(other.state,other.revision);
  expect(()=>saveStartupState(repo,boot.state,boot.revision,boot.previous)).toThrow('conflict');
  expect(repo.previousProfile()).toBeNull();expect(repo.load().state.session.slots).toBe(1);
 });
 it('starts a new browser directly at session three and respects explicit historical imports',()=>{
  const repo=new Repository(new MemoryStorage()),boot=prepareStartup(repo);
  expect(boot.state.session.number).toBe(3);expect(boot.previous).toBeNull();
  const imported=markProfileChoice(legacyInitialState());repo.save(imported,null);
  expect(prepareStartup(repo).state.session.number).toBeUndefined();
 });
});
