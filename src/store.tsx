import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {browserRepository,validateState,exportJson,download,HEAD} from './persistence';
import {maxHp} from './calculations';
import {sections,type State,type Session} from './model';
import {translate,type UIKey} from './ui';
import {Modal} from './widgets';
import {prepareStartup,saveStartupState,markProfileChoice} from './startup';
import {legacyInitialState} from './data';
type Store={state:State;update:(fn:(s:State)=>State)=>void;resource:(fn:(s:State)=>Session)=>void;undo:()=>void;canUndo:boolean;notice:string;notify:(s:string)=>void;status:string;failure:string|null;ask:(text:string)=>Promise<boolean>;restoreOther:()=>void;keepLocal:()=>void;importState:(s:State)=>void;previousProfile:State|null;restorePreviousProfile:()=>void;recovery:State|null;exportRecovery:()=>void;exportRaw:()=>void;exportCurrent:()=>void};
const Context=createContext<Store|null>(null);
export function useStore(){const c=useContext(Context);if(!c)throw new Error('Missing provider');return c;}
export function Provider({children}:{children:ReactNode}){
 const [repo]=useState(browserRepository),[loaded]=useState(()=>prepareStartup(repo));
 const [state,setState]=useState<State>(()=>{const s=structuredClone(loaded.state);const hash=location.hash.slice(1);if(sections.includes(hash as typeof sections[number]))s.preferences.section=hash as typeof sections[number];return s;});
 const ref=useRef(state),revision=useRef(loaded.revision),history=useRef<Session[]>([]),savedPayload=useRef(loaded.savedPayload);
 const [previousProfile]=useState(loaded.previous);
 const [failure,setFailure]=useState<string|null>(loaded.error),[status,setStatus]=useState(loaded.error?'memory':'saved'),[notice,setNotice]=useState(''),[undoCount,setUndoCount]=useState(0),[recovery,setRecovery]=useState<State|null>(()=>repo.recovery());
 const [confirmation,setConfirmation]=useState<{text:string;resolve:(b:boolean)=>void}|null>(null);
 const lang=state.preferences.language;
 const error=(e:unknown)=>{const key=e instanceof Error?e.message:'invalid';setNotice(translate(ref.current.preferences.language,(key in messages?key:'invalid') as UIKey));};
 const messages={bounds:1,resolveHp:1,unknownResource:1,notEnough:1,unknownHp:1,positive:1,dice:1,restHp:1,notPrepared:1,notFree:1,invalid:1,future:1,fileSize:1};
 const update=(fn:(s:State)=>State)=>{try{const next=fn(ref.current);const max=maxHp(next.character);if(next.session.hp!==null&&(max===null||next.session.hp>max))next.session={...next.session,hp:max};validateState(next);ref.current=next;setState(next);}catch(e){error(e);}};
 const resource=(fn:(s:State)=>Session)=>{try{const session=fn(ref.current);const next={...ref.current,session};validateState(next);history.current=[...history.current.slice(-19),structuredClone(ref.current.session)];setUndoCount(history.current.length);ref.current=next;setState(next);}catch(e){error(e);}};
 const undo=()=>{const session=history.current.pop();if(session){update(s=>({...s,session:{...session,notes:s.session.notes}}));setUndoCount(history.current.length);}};
 const preserve=()=>{const copy=structuredClone(ref.current);setRecovery(copy);try{repo.backup(copy);}catch{download('goran-before-import.json',exportJson(copy));}};
 const importState=(s:State)=>{preserve();history.current=[];setUndoCount(0);update(()=>markProfileChoice(s));setNotice(lang==='es'?'Copia importada. La versión anterior está disponible en Ajustes.':'Backup imported. The previous version is available in Settings.');};
 const restorePreviousProfile=()=>{const previous=structuredClone(previousProfile??legacyInitialState());previous.preferences={...ref.current.preferences};importState(previous);};
 const restoreOther=()=>{const other=repo.load();if(other.error){setFailure(other.error);return;}preserve();revision.current=other.revision;ref.current=other.state;setState(other.state);setFailure(null);history.current=[];setUndoCount(0);};
 const keepLocal=()=>{try{const other=repo.load();if(!other.error){setRecovery(other.state);repo.backup(other.state);}else{download('goran-original-storage.json',repo.raw());}revision.current=repo.head();setFailure(null);savedPayload.current=null;const next={...ref.current};ref.current=next;setState(next);}catch{setFailure('storage');}};
 useEffect(()=>{document.documentElement.lang=lang;},[lang]);
 useEffect(()=>{historyReplace(state.preferences.section);},[state.preferences.section]);
 useEffect(()=>{const changed=()=>{const section=location.hash.slice(1);if(sections.includes(section as typeof sections[number]))update(s=>({...s,preferences:{...s.preferences,section:section as typeof sections[number]}}));};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
 useEffect(()=>{
  if(failure){setStatus('memory');return;}
  const payload=JSON.stringify(state);if(payload===savedPayload.current){setStatus('saved');return;}
  let canceled=false;setStatus('saving');
  const save=()=>{if(canceled||ref.current!==state)return;try{revision.current=saveStartupState(repo,state,revision.current,previousProfile);savedPayload.current=payload;setStatus('saved');}catch(e){setFailure(e instanceof Error&&e.message==='conflict'?'conflict':'storage');setStatus('memory');}};
  if(navigator.locks)navigator.locks.request('dad-ficha-goran-save',save).catch(()=>{setFailure('storage');setStatus('memory');});else save();
  return()=>{canceled=true;};
 },[state,failure,repo,previousProfile]);
 useEffect(()=>{const external=(event:StorageEvent)=>{if(event.key===HEAD&&event.newValue!==revision.current){setFailure('conflict');setStatus('memory');}};window.addEventListener('storage',external);return()=>window.removeEventListener('storage',external);},[]);
 useEffect(()=>{const leaving=(e:BeforeUnloadEvent)=>{if(status!=='saved'){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',leaving);return()=>window.removeEventListener('beforeunload',leaving);},[status]);
 const ask=(text:string)=>new Promise<boolean>(resolve=>setConfirmation({text,resolve}));
 const answer=(value:boolean)=>{confirmation?.resolve(value);setConfirmation(null);};
 return <Context.Provider value={{state,update,resource,undo,canUndo:undoCount>0,notice,notify:setNotice,status,failure,ask,restoreOther,keepLocal,importState,previousProfile,restorePreviousProfile,recovery,exportRecovery:()=>{if(recovery)download('goran-recovery.json',exportJson(recovery));},exportRaw:()=>{try{download('goran-original-storage.json',repo.raw());}catch{setNotice(translate(lang,'storage'));}},exportCurrent:()=>download('goran-backup.json',exportJson(ref.current))}}>{children}{confirmation&&<Modal title={lang==='es'?'Confirmar':'Confirm'} close={()=>answer(false)}><p className="prewrap">{confirmation.text}</p><div className="actions"><button className="primary" onClick={()=>answer(true)}>{lang==='es'?'Confirmar':'Confirm'}</button><button onClick={()=>answer(false)}>{translate(lang,'cancel')}</button></div></Modal>}</Context.Provider>;
}
function historyReplace(section:string){if(location.hash!=='#'+section)window.history.replaceState(null,'','#'+section);}
