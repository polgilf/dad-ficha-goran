
import { pair, type State, type Item } from './model';
export const PROFILE_REVISION='session-3-2026-10-20';
export const confirmedFacts={
 languages:pair('Enano y Élfico, chapurreados. Es un matiz narrativo; no impone penalizaciones inventadas.','Dwarvish and Elvish, haltingly spoken. This is narrative flavor, with no invented penalties.'),
 origins:pair('Reconstrucción propuesta: Granjero → Atletismo y Trato con animales; clase → Intimidación; humano/subfacción de mesa → Acrobacias; concesión del máster → Sigilo. Para conservar las cinco marcas, se supone un solapamiento del otro hueco de clase con Atletismo, sin sumar competencia dos veces ni conceder una habilidad nueva. Duro se atribuye a Granjero y Matón de taberna al humano. Estas procedencias son supuestos, no recuerdos confirmados ni una subespecie oficial nueva.','Proposed reconstruction: Farmer → Athletics and Animal Handling; class → Intimidation; Human/table subfaction → Acrobatics; DM concession → Stealth. To retain the five marks, the other class slot is assumed to overlap Athletics, without double proficiency or a new skill. Tough is attributed to Farmer and Tavern Brawler to Human. These origins are assumptions, not confirmed recollections or a new official subspecies.'),
 faith:pair('Goran cree en las Dracocoins. Su mesías es Amadeo Draco, también conocido como el Maestro del Dragón Astral. Lleva una moneda Dracocoin colgada como símbolo divino. Estas creencias no confirman un juramento ni una fuente real de magia.','Goran believes in Dracocoins. His messiah is Amadeo Draco, also known as the Master of the Astral Dragon. He wears a Dracocoin as his divine symbol. These beliefs do not establish an oath or a real source of magic.'),
 slots:pair('Regla del máster: cada grupo de hasta cinco unidades marcado 1A ocupa 1 slot. 5 → 1; 6 → 2; 10 → 2. Capacidad declarada: Fuerza + Bandolera (10) + Cinturón de campeón (2) = 20. El total es editable; no se deriva otra fórmula de la puntuación o modificador de Fuerza. Revisa la capacidad si cambias esos elementos.','DM rule: each group of up to five units marked 1A uses 1 slot. 5 → 1; 6 → 2; 10 → 2. Declared capacity: Strength + Bandolier (10) + Champion belt (2) = 20. The total is editable; no extra formula is inferred from Strength score or modifier. Review capacity when those items change.')
};
export function confirmSessionThree(base:State):State {
 const s=structuredClone(base),c=s.character;
 c.profileRevision=PROFILE_REVISION;
 c.weaponMasteries=['maul','crossbow'];
 c.hp={method:'fixed',roll:null,manual:null,conAtConfirmation:3};
 c.prepared=['cure-wounds','bless','divine-favor'];
 c.languages=['Enano','Élfico'];
 c.style='pending';c.cantrips=[];
 c.details.religion='Dracocoins. Amadeo Draco (Maestro del Dragón Astral).';
 c.details.symbol='Moneda Dracocoin colgada; valor para Bendición pendiente.';
 c.provenance={...c.provenance,hp:'confirmed',prepared:'confirmed',bless:'confirmed','divine-favor':'confirmed',languages:'confirmed',religion:'confirmed',symbol:'confirmed',weaponMasteries:'confirmed',skillOrigins:'proposed',featOrigins:'proposed',session:'confirmed',slotCapacity:'confirmed'};
 c.modifications={...c.modifications,confirmationDate:'2026-10-20'};
 const quantities:Record<string,number>={tinderbox:1,cooks:1,hammer:1,carpenters:1,torches:5,rations:5,spikes:5,balm:1,arrows:5,knife:1,bedroll:1,waterskin:1,bandolier:1,helmet:1,jerkin:1,splint:1,gloves:1,boots:1,cloak:1,'champion-belt':1,symbol:1,crossbow:1};
 const costs:Record<string,number>={tinderbox:1,cooks:2,hammer:1,carpenters:3,torches:1,rations:1,spikes:1,balm:1,arrows:1,knife:1,bedroll:2,waterskin:2};
 const stacked=['torches','rations','spikes','arrows'];
 const worn=['helmet','jerkin','splint','gloves','boots','cloak','champion-belt','symbol','bandolier'];
 const additions:[string,string,string][]=[
 ['carpenters','Herramientas de carpintero','Carpenter’s tools'],['bedroll','Saco de dormir','Bedroll'],['waterskin','Odre de agua','Waterskin'],['bandolier','Bandolera','Bandolier'],['helmet','Yelmo','Helmet'],['jerkin','Jubón','Jerkin'],['splint','Armadura de láminas','Splint armor'],['gloves','Guantes','Gloves'],['boots','Botas','Boots'],['cloak','Capa','Cloak'],['champion-belt','Cinturón de campeón','Champion belt']
 ];
 for(const [id,es,en] of additions)s.inventory.push({id,name:pair(es,en),quantity:null,historicalQuantity:null,weight:null,possession:'unknown',equipped:false,notes:'',provenance:'pending'});
 s.inventory=s.inventory.map((item):Item=>{
  const known=item.id in quantities;
  return {...item,quantity:known?quantities[item.id]:item.quantity,possession:known?'owned':item.possession,provenance:known?'confirmed':item.provenance,
   equipped:item.id==='chain-shirt'?false:worn.includes(item.id)||item.equipped,
   weight:null,slotCost:costs[item.id]??null,slotSize:stacked.includes(item.id)?5:1,slotLabel:stacked.includes(item.id)?'1A':item.id in costs?String(costs[item.id]):'',
   name:item.id==='symbol'?pair('Símbolo divino · Dracocoin','Divine symbol · Dracocoin'):item.id==='hammer'?pair('Martillo pequeño','Small hammer'):item.id==='spikes'?pair('Puntas de hierro','Iron spikes'):item.name,
   notes:item.id==='splint'?'Obtenida en una misión.':item.id==='crossbow'?'Conseguida en la sesión 2.':item.notes};
 });
 s.money={cp:null,sp:5,ep:null,gp:24.5,pp:null};
 s.tableRules={...s.tableRules,slotCapacity:20,slotFormula:'Fuerza + Bandolera (10) + Cinturón de campeón (2) = 20'};
 s.session={number:3,hp:26,temp:0,slots:2,lay:10,smite:1,hitDice:2,inspiration:1,deathSuccess:0,deathFail:0,concentration:null,effects:[],notes:'',exhaustion:0};
 return s;
}
export function languageName(value:string,language:'es'|'en'){
 const key=value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(key==='enano'||key==='dwarvish')return language==='es'?'Enano':'Dwarvish';
 if(key==='elfico'||key==='elvish')return language==='es'?'Élfico':'Elvish';
 return value;
}
