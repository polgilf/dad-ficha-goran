import {useStore} from './store';
import {PROFILE_REVISION} from './confirmed-data';
import {adoptConfirmedProfile} from './profile-update';
import {derive} from './calculations';
export function ProfileUpdate({force=false}:{force?:boolean}){
 const {state,ask,importState}=useStore(),lang=state.preferences.language,t=(es:string,en:string)=>lang==='es'?es:en;
 if(!force&&state.character.profileRevision===PROFILE_REVISION)return null;
 const apply=async()=>{
  const next=adoptConfirmedProfile(state),ac=derive(next).ac;
  if(await ask(t('Cargar las confirmaciones del 20/10/2026 e iniciar sesión 3:\n26/26 PG, recursos completos, sin efectos ni agotamiento; CA ','Load the 2026-10-20 confirmations and start session 3:\n26/26 HP, full resources, no effects or exhaustion; AC ')+ac+t('; conjuros e idiomas confirmados; inventario actualizado en slots; 24,5 po y 5 pp.\nSe aplican los datos confirmados del personaje. Se conservan tu estilo, notas, retrato, preferencias, objetos añadidos y aclaraciones no sustituidas. La copia anterior queda recuperable en Ajustes.','; confirmed spells and languages; updated slot inventory; 24.5 GP and 5 SP.\nConfirmed character data is applied. Your style, notes, portrait, preferences, added items and unreplaced clarifications are kept. The previous copy remains recoverable in Settings.')))importState(next);
 };
 return <aside className="panel profile-update interactive"><strong>{t('Ficha confirmada · Sesión 3','Confirmed sheet · Session 3')}</strong><p>{t('La ficha de sesión 3 se carga por defecto una sola vez. Desde aquí puedes restablecer sus datos y recursos.','The session 3 sheet is loaded by default once. Here you can reset its data and resources.')}</p><button className="primary" onClick={apply}>{t('Cargar ficha de sesión 3','Load session 3 sheet')}</button></aside>;
}
