import type {State} from './model';
import {PROFILE_REVISION} from './confirmed-data';
import {adoptConfirmedProfile} from './profile-update';
import type {Repository} from './persistence';
export const DEFAULT_APPLIED_KEY='session3DefaultApplied';
/** An explicit import/restore is a choice, not a candidate for automatic replacement. */
export function markProfileChoice(state:State):State {
 return {...state,character:{...state.character,modifications:{...state.character.modifications,[DEFAULT_APPLIED_KEY]:PROFILE_REVISION}}};
}
/** Read-only preparation. The old profile is backed up inside the save lock, before commit. */
export function prepareStartup(repo:Repository){
 const loaded=repo.load();
 const recovery=repo.recovery();
 let previous=repo.previousProfile()??(recovery&&recovery.character.profileRevision!==PROFILE_REVISION?recovery:null);
 const savedPayload=loaded.revision?JSON.stringify(loaded.state):null;
 if(loaded.error||loaded.state.character.modifications[DEFAULT_APPLIED_KEY]===PROFILE_REVISION)
  return {...loaded,previous,savedPayload};
 const needsUpgrade=loaded.revision!==null&&loaded.state.character.profileRevision!==PROFILE_REVISION;
 if(needsUpgrade)previous=loaded.state;
 const state=markProfileChoice(needsUpgrade?adoptConfirmedProfile(loaded.state):loaded.state);
 return {...loaded,state,previous,savedPayload};
}
export function saveStartupState(repo:Repository,state:State,revision:string|null,previous:State|null){
 if(repo.head()!==revision)throw new Error('conflict');
 if(previous)repo.ensurePreviousProfile(previous);
 return repo.save(state,revision);
}
