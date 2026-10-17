import {useState} from 'react';
import {useStore} from './store';
import {sources,consulted,type RuleCard} from './rules';
import {tr} from './model';
import {translate} from './ui';
export function RuleView({card,force=false,children}:{card:RuleCard;force?:boolean;children?:React.ReactNode}){
 const {state}=useStore(),lang=state.preferences.language;
 const [expanded,setExpanded]=useState(false),detailed=force||expanded||state.preferences.depth==='detailed';
 const source=sources[card.source as keyof typeof sources]??sources.srd;
 return <article className={'rule-card '+(card.id==='maul'?'signature':'')} id={'rule-'+card.id}>
 <div className="rule-heading"><span className="eyebrow">{translate(lang,card.group==='glossary'?'glossary':card.group)}</span><h3>{tr(card.name,lang)}</h3>{lang==='es'&&card.name.es!==card.name.en&&<span className="canonical">{card.name.en}</span>}</div>
 <p className="rule-quick">{tr(card.quick,lang)}</p>{children}
 {detailed&&<div className="rule-detail"><p>{tr(card.explanation,lang)}</p><h4>{translate(lang,'steps')}</h4><p>{tr(card.steps,lang)}</p><div className="example"><h4>{translate(lang,'example')}</h4><p>{tr(card.example,lang)}</p></div><h4>{translate(lang,'mistakes')}</h4><p>{tr(card.mistakes,lang)}</p><p className="source">{translate(lang,'source')}: <a href={source.url} target="_blank" rel="noreferrer">{source.name}</a> · {card.section} · {consulted}</p></div>}
 {!force&&state.preferences.depth==='quick'&&<button className="text-button detail-toggle" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{translate(lang,expanded?'hide':'detail')} <span aria-hidden="true">{expanded?'−':'+'}</span></button>}
 </article>;
}
