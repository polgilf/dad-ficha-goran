import {useState} from 'react';
import {useStore} from './store';
import {NumberField,TextField} from './widgets';
import {derive,mod} from './calculations';
import {tr,styleIds,type Character} from './model';
import {styleNames} from './data';
import {styleDescriptions} from './styles-data';
import {translate} from './ui';
import {confirmedFacts} from './confirmed-data';
import {tr as localize} from './model';
export function Pending(){
 const {state,update}=useStore(),lang=state.preferences.language,t=(es:string,en:string)=>lang==='es'?es:en,d=derive(state);
 const [roll,setRoll]=useState<number|null>(null),[manual,setManual]=useState<number|null>(null);
 const change=(patch:Partial<Character>,field:string)=>update(s=>({...s,character:{...s.character,...patch,provenance:{...s.character.provenance,[field]:'confirmed'},modifications:{...s.character.modifications,[field]:new Date().toISOString()}}}));
 const labels:Record<keyof Character['details'],[string,string]>={weight:['Peso corporal','Body weight'],religion:['Religión','Religion'],oath:['Juramento (nivel 3)','Oath (level 3)'],allies:['Aliados','Allies'],skillOrigins:['Origen de Acrobacias, Sigilo, Intimidación y demás competencias','Origins of Acrobatics, Stealth, Intimidation and other proficiencies'],balm:['Bálsamo: efecto, dosis y acción','Balm: effect, doses and action'],symbol:['Símbolo sagrado: valor y componentes','Holy symbol: value and components'],rope:['Longitud de la cuerda','Rope length'],treasure:['Tesoros','Treasure']};
 return <details className="panel pending"><summary>{t('Datos por confirmar','Pending details')} <span>{d.maxHp===null?t('PG · estilo · elecciones','HP · style · choices'):t('Editar y aclarar','Edit and clarify')}</span></summary>
 <p>{t('Referencia: ficha de nivel 1 del 20/09/2026. Nivel 2 confirmado el 04/10/2026. Actualización confirmada el 20/10/2026. Los datos mostrados son los de tu copia local.','Reference: level 1 sheet dated 2026-09-20. Level 2 confirmed on 2026-10-04. Update confirmed on 2026-10-20. Values shown belong to your local copy.')}</p>
 <h3>{t('PG máximos de nivel 2','Level 2 maximum HP')}</h3>
 <p>{t('Históricos: 15 = 10 + CON 3 + Duro 2. Máximo con incremento fijo y tus atributos actuales:','Historical: 15 = 10 + CON 3 + Tough 2. Maximum with fixed increase and current abilities:')} <strong>{d.fixedHp}</strong>. {t('Actual:','Current:')} <strong>{d.maxHp??translate(lang,'pending')}</strong>.</p>
 <button className="primary" onClick={()=>change({hp:{method:'fixed',roll:null,manual:null,conAtConfirmation:mod(state.character.abilities.con)}},'hp')}>{t('Aceptar incremento fijo:','Accept fixed increase:')} {d.fixedHp} {t('PG','HP')}</button>
 <div className="form-grid"><NumberField label={t('Dado real de subida (d10)','Actual level-up die (d10)')} value={roll} min={1} max={10} language={lang} onValue={setRoll}/><button disabled={roll===null} onClick={()=>change({hp:{method:'rolled',roll,manual:null,conAtConfirmation:mod(state.character.abilities.con)}},'hp')}>{t('Confirmar dado','Confirm die')}</button>
 <NumberField label={t('O confirmar un máximo manual','Or confirm a manual maximum')} value={manual} min={1} max={9999} language={lang} onValue={setManual}/><button disabled={manual===null} onClick={()=>change({hp:{method:'manual',roll:null,manual,conAtConfirmation:mod(state.character.abilities.con)}},'hp')}>{t('Confirmar máximo','Confirm maximum')}</button></div>
 <StylePicker/>
 <label className="check"><input type="checkbox" checked={state.character.daggerConfirmed} onChange={e=>change({daggerConfirmed:e.target.checked},'dagger')}/>{t('El máster confirma que el cuchillo cuenta como daga','DM confirms the knife counts as a dagger')}</label>
 <h3>{t('Idiomas adicionales','Additional languages')}</h3><p>{t('Común importado. Enano y Élfico confirmados, chapurreados; sin penalización mecánica inventada.','Common is imported. Dwarvish and Elvish are confirmed, haltingly spoken; no invented mechanical penalty.')}</p><div className="form-grid">{[0,1].map(n=><TextField key={n} label={t('Idioma','Language')+' '+(n+2)} value={state.character.languages[n]} onValue={v=>{const languages=[...state.character.languages] as [string,string];languages[n]=v;change({languages},'languages');}}/>)}</div>
 <p className="muted">{localize(confirmedFacts.origins,lang)}</p>
 {Object.entries(labels).map(([key,label])=><TextField key={key} label={t(...label)} value={state.character.details[key as keyof Character['details']]} onValue={v=>change({details:{...state.character.details,[key]:v}},key)}/>)}
 <p className="muted">{t('Las notas se conservan en el idioma en que las escribas. El juramento no concede rasgos antes del nivel 3.','Notes stay in the language you write. An oath does not grant features before level 3.')}</p>
 </details>;
}
export function StylePicker(){
 const {state,update}=useStore(),c=state.character,lang=state.preferences.language,t=(es:string,en:string)=>lang==='es'?es:en;
 return <div className="style-picker"><label className="field"><span>{t('Estilo de combate','Fighting Style')}</span><select value={c.style} onChange={e=>update(s=>({...s,character:{...s.character,style:e.target.value as Character['style'],provenance:{...s.character.provenance,style:e.target.value==='pending'?'pending':'confirmed'},modifications:{...s.character.modifications,style:new Date().toISOString()}}}))}>{styleIds.map(id=><option key={id} value={id}>{tr(styleNames[id],lang)}</option>)}</select></label><p>{tr(styleDescriptions[c.style],lang)}</p><p className="muted">{t('Guerrero bendito está excluido por elección del jugador. No se conceden trucos.','Blessed Warrior is excluded by the player. No cantrips are granted.')}</p>
 {c.style!=='pending'&&<small><a href={'https://roll20.net/compendium/dnd5e/Feats:'+encodeURIComponent(styleNames[c.style].en)+'?expansion=32231'} target="_blank" rel="noreferrer">{t('Fuente: reglas 2024','Source: 2024 rules')}</a> · 2026-10-17</small>}
 </div>;
}
