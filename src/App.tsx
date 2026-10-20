import {useMemo,useState} from 'react';
import {useStore} from './store';
import {sections,tr,type Section} from './model';
import {catalog,type RuleCard} from './rules';
import {normalize} from './calculations';
import {skills,narrative} from './data';
import {translate,type UIKey} from './ui';
import {Modal} from './widgets';
import goranLogo from './assets/goran-logo.webp';
import {Dashboard} from './Resources';
import {RuleView} from './RuleView';
import {Sheet,SpellSection,TraitsSection,InventorySection,StorySection,CombatSection,Notes,PrintInventory} from './Sections';
import {Settings} from './Settings';
import {ProfileUpdate} from './ProfileUpdate';
export default function App(){
 const store=useStore(),{state,update}=store,lang=state.preferences.language,t=(es:string,en:string)=>lang==='es'?es:en;
 const [query,setQuery]=useState(''),[searchOpen,setSearchOpen]=useState(false),[selected,setSelected]=useState<string|null>(null);
 const cards=useMemo(()=>catalog(state),[state]),norm=normalize(query.trim()),selectedCard=cards.find(c=>c.id===selected);
 const openRule=(id:string)=>setSelected(id);
 const matches=(s:string)=>!norm||normalize(s).includes(norm);
 const resultCards=cards.filter(c=>matches([c.id,c.name.es,c.name.en,c.quick.es,c.quick.en,...c.aliases].join(' ')));
 const resultItems=state.inventory.filter(i=>matches(i.name.es+' '+i.name.en+' '+i.notes));
 const resultSkills=skills.filter(s=>matches(s.name.es+' '+s.name.en));
 const storyMatch=norm&&matches(Object.values(narrative).map(x=>x.es+' '+x.en).join(' '));
 const go=(section:Section)=>{update(s=>({...s,preferences:{...s.preferences,section}}));setSearchOpen(false);};
 const section=state.preferences.section;
 return <div className={'app '+state.preferences.depth}>
 <a className="skip-link" href="#content">{t('Saltar a la ficha','Skip to sheet')}</a>
 <header className="masthead"><div className="identity"><img className="brand-logo" src={goranLogo} width={54} height={54} alt={t('Emblema de Goran: dragón dorado','Goran emblem: golden dragon')}/><div><h1>Goran<span aria-hidden="true">.</span></h1><p>{t('Humano · Paladín 2','Human · Paladin 2')}</p></div></div>
 <div className="preferences"><label><span className="sr-only">{t('Idioma','Language')}</span><select aria-label={t('Idioma','Language')} value={lang} onChange={e=>update(s=>({...s,preferences:{...s.preferences,language:e.target.value as 'es'|'en'}}))}><option value="es">Español</option><option value="en">English</option></select></label><label><span className="sr-only">{t('Profundidad','Depth')}</span><select aria-label={t('Profundidad','Depth')} value={state.preferences.depth} onChange={e=>update(s=>({...s,preferences:{...s.preferences,depth:e.target.value as 'quick'|'detailed'}}))}><option value="quick">{t('Sintético','Quick')}</option><option value="detailed">{t('Detallado','Detailed')}</option></select></label></div></header>
 <div className="toolbar interactive"><button className="search-trigger" onClick={()=>setSearchOpen(true)}><span aria-hidden="true">⌕</span> {translate(lang,'search')}</button><button onClick={()=>{setQuery('');setSearchOpen(true);}}>{translate(lang,'glossary')}</button></div>
 {store.failure&&<aside className="storage-warning" role="alert"><p>{translate(lang,store.failure as UIKey)}</p><div className="actions"><button onClick={store.exportCurrent}>{t('Exportar mi copia','Export my copy')}</button>{store.failure==='conflict'?<><button onClick={store.restoreOther}>{t('Cargar la otra pestaña','Load the other tab')}</button><button onClick={async()=>{if(await store.ask(t('¿Conservar esta copia y guardar la otra como recuperable?','Keep this copy and preserve the other as recovery?')))store.keepLocal();}}>{t('Conservar esta copia','Keep this copy')}</button></>:<><button onClick={store.exportRaw}>{t('Exportar datos originales','Export original data')}</button><button onClick={async()=>{if(await store.ask(t('¿Intentar guardar esta copia? Antes se exportarán los datos dañados si existen.','Try saving this copy? Damaged data will be exported first if present.')))store.keepLocal();}}>{t('Reintentar guardado','Retry saving')}</button></>}</div></aside>}
 <ProfileUpdate/>
 <Dashboard openRule={openRule}/>
 <nav className="tabs interactive" aria-label={t('Secciones','Sections')}>{sections.map(id=><button key={id} onClick={()=>go(id)} aria-current={section===id?'page':undefined}>{translate(lang,id)}</button>)}</nav>
 <main id="content" tabIndex={-1}>
 <div className={section==='sheet'?'page-section':'page-section inactive'}><Sheet openRule={openRule}/></div>
 <div className={section==='combat'?'page-section':'page-section inactive'}><CombatSection/></div>
 <div className={section==='spells'?'page-section':'page-section inactive'}><SpellSection/></div>
 <div className={section==='traits'?'page-section':'page-section inactive'}><TraitsSection/></div>
 <div className={section==='inventory'?'page-section':'page-section inactive'}><InventorySection/><PrintInventory/></div>
 <div className={section==='story'?'page-section':'page-section inactive'}><StorySection/></div>
 <div className={section==='settings'?'page-section settings-section':'page-section settings-section inactive'}><Settings/></div>
 <Notes/>
 </main>
 <footer><span className="save-status" role="status">{translate(lang,store.status as UIKey)}</span><span>{t('Cuaderno de aventurero · Reglas 2024','Adventurer’s notebook · 2024 rules')}</span><a href="https://github.com/polgilf/dad-ficha-goran" target="_blank" rel="noreferrer">GitHub ↗</a></footer>
 {store.notice&&<div className="toast" role="alert"><span>{store.notice}</span><button aria-label={translate(lang,'close')} onClick={()=>store.notify('')}>×</button></div>}
 {searchOpen&&<Modal title={t('Búsqueda y glosario','Search and glossary')} close={()=>setSearchOpen(false)}><label className="field"><span>{t('Español o inglés; sin importar tildes','Spanish or English; accents ignored')}</span><input autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('Castigo, Divine Smite, derribar…','Smite, Castigo, Topple…')}/></label>
 <p className="muted">{t('Reglas y términos','Rules and terms')} · {resultCards.length}</p><div className="search-results">{resultCards.map(c=><button key={c.id} onClick={()=>{setSearchOpen(false);openRule(c.id);}}><b>{tr(c.name,lang)}</b><small>{lang==='es'?c.name.en:c.name.es}</small><span aria-hidden="true">↗</span></button>)}</div>
 {norm&&resultSkills.length>0&&<><h3>{t('Habilidades','Skills')}</h3>{resultSkills.map(s=><button key={s.id} onClick={()=>go('sheet')}>{tr(s.name,lang)}</button>)}</>}
 {norm&&resultItems.length>0&&<><h3>{translate(lang,'inventory')}</h3>{resultItems.map(i=><button key={i.id} onClick={()=>go('inventory')}>{tr(i.name,lang)}</button>)}</>}
 {storyMatch&&<button onClick={()=>go('story')}>{translate(lang,'story')}</button>}
 {!resultCards.length&&!resultItems.length&&!resultSkills.length&&!storyMatch&&<p>{translate(lang,'noResults')}</p>}
 </Modal>}
 {selectedCard&&<Modal title={tr(selectedCard.name,lang)} close={()=>setSelected(null)}><RuleView card={selectedCard} force/><div className="related-terms"><strong>{t('Términos relacionados','Related terms')}</strong>{(['checks','dc-ac','advantage','concentration','prone','rests','zero-hp'] as const).filter(id=>id!==selected).map(id=>{const c=cards.find(c=>c.id===id) as RuleCard;return <button key={id} onClick={()=>setSelected(id)}>{tr(c.name,lang)}</button>;})}</div></Modal>}
 </div>;
}
