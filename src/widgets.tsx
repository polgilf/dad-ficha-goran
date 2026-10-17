import {useEffect,useRef,useState,type ReactNode} from 'react';
import type {Language} from './model';
import {translate} from './ui';
export function Modal({title,close,children}:{title:string;close:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;ref.current?.showModal();return()=>previous?.focus();},[]);
 return <dialog ref={ref} onCancel={e=>{e.preventDefault();close();}} aria-label={title}><div className="dialog-head"><h2>{title}</h2><button onClick={close} aria-label={document.documentElement.lang==='es'?'Cerrar':'Close'}>×</button></div>{children}</dialog>;
}
export function NumberField({label,value,onValue,min=0,max=9999,nullable=true,language}:{label:string;value:number|null;onValue:(n:number|null)=>void;min?:number;max?:number;nullable?:boolean;language:Language}){
 const [draft,setDraft]=useState(value===null?'':String(value)),[error,setError]=useState(false);
 useEffect(()=>{setDraft(value===null?'':String(value));setError(false);},[value]);
 const commit=()=>{if(draft===''&&nullable){onValue(null);setDraft(value===null?'':String(value));setError(false);return;}const n=Number(draft);if(draft===''||!Number.isFinite(n)||!Number.isInteger(n)||n<min||n>max){setError(true);return;}if(n!==value)onValue(n);setDraft(value===null?'':String(value));setError(false);};
 return <label className="field"><span>{label}</span><input type="number" inputMode="numeric" min={min} max={max} value={draft} placeholder={nullable?translate(language,'unknown'):undefined} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}} aria-invalid={error}/>{error&&<small className="error">{translate(language,'bounds')} ({min}–{max})</small>}</label>;
}
export function TextField({label,value,onValue,rows}:{label:string;value:string;onValue:(s:string)=>void;rows?:number}){
 return <label className="field"><span>{label}</span>{rows?<textarea rows={rows} value={value} maxLength={20000} onChange={e=>onValue(e.target.value)}/>:<input value={value} maxLength={200} onChange={e=>onValue(e.target.value)}/>}</label>;
}
export function Rock({large=false}:{large?:boolean}){return <svg className={large?'rock large':'rock'} viewBox="0 0 72 72" aria-hidden="true"><path d="M11 48 19 24 43 13 61 32 65 53 40 63 14 59Z" fill="currentColor" opacity=".16"/><path d="m11 48 8-24 24-11 18 19 4 21-25 10-26-4Z M19 24l20 14 22-6M39 38l1 25M11 48l28-10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m52 12 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="currentColor"/></svg>;}
