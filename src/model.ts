import { z } from 'zod';
export const abilityIds = ['str','dex','con','int','wis','cha'] as const;
export type Ability = typeof abilityIds[number];
export const skillIds = ['acrobatics','athletics','arcana','deception','history','performance','intimidation','investigation','sleight','medicine','nature','perception','insight','persuasion','religion','stealth','survival','animal'] as const;
export const styleIds = ['pending','defense','great-weapon','archery','two-weapon','dueling','blind','interception','protection','thrown','unarmed'] as const;
export const spellIds = ['cure-wounds','bless','divine-favor'] as const;
export const sections = ['sheet','combat','spells','traits','inventory','story','settings'] as const;
export type Section = typeof sections[number];
export const provenanceSchema = z.enum(['confirmed','imported','calculated','proposed','pending']);
export type Provenance = z.infer<typeof provenanceSchema>;
const text = z.string().max(20000);
const nullableInt = (max: number) => z.number().int().min(0).max(max).nullable();
const abilities = z.object({str:z.number().int().min(1).max(30),dex:z.number().int().min(1).max(30),con:z.number().int().min(1).max(30),int:z.number().int().min(1).max(30),wis:z.number().int().min(1).max(30),cha:z.number().int().min(1).max(30)}).strict();
const unique = (values: string[]) => new Set(values).size === values.length;
export const characterSchema = z.object({
 profileRevision:z.string().max(100).optional(), weaponMasteries:z.array(z.enum(['maul','crossbow'])).max(2).refine(unique).optional(),
 name:z.literal('Goran'), fullName:z.literal('Goran Gork'), player:z.literal('Pol'), level:z.literal(2),
 abilities, skills:z.array(z.enum(skillIds)).max(18).refine(unique), saves:z.array(z.enum(abilityIds)).max(6).refine(unique),
 hp:z.object({method:z.enum(['pending','fixed','rolled','manual']),roll:nullableInt(10),manual:nullableInt(9999),conAtConfirmation:z.number().int().min(-5).max(10)}).strict().refine(h=>h.method!=='rolled'||(h.roll!==null&&h.roll>=1)).refine(h=>h.method!=='manual'||(h.manual!==null&&h.manual>=1)),
 style:z.enum(styleIds), cantrips:z.array(z.string().min(1).max(100)).max(0),
 prepared:z.array(z.enum(spellIds)).max(3).refine(unique),
 daggerConfirmed:z.boolean(), languages:z.tuple([z.string().max(100),z.string().max(100)]),
 details:z.object({weight:text,religion:text,oath:text,allies:text,skillOrigins:text,balm:text,symbol:text,rope:text,treasure:text}).strict(),
 portrait:z.string().max(1200000).refine(s=>s===''||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s)),
 provenance:z.record(z.string().max(100),provenanceSchema), modifications:z.record(z.string().max(100),text)
}).strict();
export const itemSchema = z.object({
 id:z.string().min(1).max(100), name:z.object({es:z.string().min(1).max(200),en:z.string().min(1).max(200)}).strict(),
 quantity:nullableInt(99999),historicalQuantity:nullableInt(99999),weight:z.number().finite().min(0).max(99999).nullable(),
 slotCost:z.number().finite().min(0).max(99999).nullable().optional(),slotSize:z.number().int().min(1).max(99999).optional(),slotLabel:z.string().max(100).optional(),
 possession:z.enum(['historical','owned','absent','unknown']),equipped:z.boolean(),notes:text,provenance:provenanceSchema
}).strict().refine(i=>!i.equipped||i.possession!=='absent');
export const sessionSchema = z.object({
 number:nullableInt(9999).optional(),hp:nullableInt(9999),temp:nullableInt(9999),slots:nullableInt(2),lay:nullableInt(10),smite:nullableInt(1),hitDice:nullableInt(2),inspiration:nullableInt(1),
 deathSuccess:nullableInt(3),deathFail:nullableInt(3),
 concentration:z.string().max(200).nullable(),effects:z.array(z.object({id:z.string().max(100),name:z.string().min(1).max(200),duration:z.string().max(200)}).strict()).max(100),
 notes:text,exhaustion:nullableInt(6)
}).strict();
export const preferencesSchema = z.object({language:z.enum(['es','en']),depth:z.enum(['quick','detailed']),section:z.enum(sections)}).strict();
export const stateSchema = z.object({
 character:characterSchema,session:sessionSchema,preferences:preferencesSchema,
 inventory:z.array(itemSchema).max(500).refine(items=>unique(items.map(i=>i.id))),
 money:z.object({cp:nullableInt(999999),sp:nullableInt(999999),ep:nullableInt(999999),gp:z.number().finite().min(0).max(999999).multipleOf(0.01).nullable(),pp:nullableInt(999999)}).strict(),
 tableRules:z.object({farmerAthletics:z.literal(true),slotCapacity:nullableInt(99999).optional(),slotFormula:text.optional(),notes:text}).strict()
}).strict();
export const backupSchema = z.object({schemaVersion:z.literal(2),exportedAt:z.string().datetime(),state:stateSchema}).strict();
export type Character=z.infer<typeof characterSchema>;
export type Item=z.infer<typeof itemSchema>;
export type Session=z.infer<typeof sessionSchema>;
export type Preferences=z.infer<typeof preferencesSchema>;
export type State=z.infer<typeof stateSchema>;
export type Language=Preferences['language'];
export type Resource='hp'|'temp'|'slots'|'lay'|'smite'|'hitDice'|'inspiration'|'deathSuccess'|'deathFail'|'exhaustion';
export type Localized={es:string;en:string};
export const tr=(s:Localized,lang:Language)=>s[lang];
export const pair=(es:string,en:string):Localized=>({es,en});
