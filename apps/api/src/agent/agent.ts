import { activities, deals } from "../data/demo.js";
import type { Alert, Deal, Kpis } from "../types.js";
export interface AgentRun { id:string; startedAt:string; completedAt:string; status:"completed"; source:"demo"; kpis:Kpis; alerts:Alert[]; summary:string; steps:{name:string;detail:string;status:"complete"}[]; }
const now=()=>new Date().toISOString(); const daysSince=(iso:string)=>(Date.now()-new Date(iso).getTime())/86400000;
const money=(v:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v);
export function calculateKpis(records:Deal[]=deals):Kpis{
 const won=records.filter(d=>d.stage==="Won"),lost=records.filter(d=>d.stage==="Lost"),open=records.filter(d=>!["Won","Lost"].includes(d.stage)),decided=won.length+lost.length;
 return {pipelineValue:open.reduce((s,d)=>s+d.value,0),weightedForecast:open.reduce((s,d)=>s+d.value*d.probability,0),closedRevenue:won.reduce((s,d)=>s+d.value,0),winRate:decided?won.length/decided*100:0,openDeals:open.length,staleDeals:open.filter(d=>daysSince(d.lastActivityAt)>=14).length,activityCompletion:activities.length?activities.filter(a=>a.completed).length/activities.length*100:0,avgDealSize:records.length?records.reduce((s,d)=>s+d.value,0)/records.length:0};
}
function buildAlerts(records:Deal[]):Alert[]{
 const stale=records.filter(d=>!["Won","Lost"].includes(d.stage)&&daysSince(d.lastActivityAt)>=14);
 const negotiationValue=stale.filter(d=>d.stage==="Negotiation").reduce((s,d)=>s+d.value,0);
 const alerts:Alert[]=stale.map(d=>({id:"stale-"+d.id,severity:daysSince(d.lastActivityAt)>=17?"high":"medium",title:"No recent activity: "+d.company,description:d.name+" has had no logged activity for "+Math.floor(daysSince(d.lastActivityAt))+" days. Schedule a follow-up and confirm the close date.",dealId:d.id,createdAt:now()}));
 if(negotiationValue>200000) alerts.unshift({id:"pipeline-risk-negotiation",severity:"high",title:"Negotiation pipeline needs attention",description:"Stale negotiation deals represent "+money(negotiationValue)+" in potential value. Review decision makers, blockers, and next steps.",createdAt:now()});
 return alerts.length?alerts:[{id:"healthy-activity",severity:"low",title:"Pipeline activity looks healthy",description:"No open deals have crossed the stale-activity threshold.",createdAt:now()}];
}
async function narrative(kpis:Kpis,alerts:Alert[]):Promise<string>{
 if(!process.env.LLM_API_KEY)return "The team has "+money(kpis.pipelineValue)+" in open pipeline with a "+money(kpis.weightedForecast)+" probability-weighted forecast. "+kpis.staleDeals+" open deal(s) need follow-up. Prioritize aged negotiations, then confirm next steps on proposal-stage opportunities.";
 const base=(process.env.LLM_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,"");
 const response=await fetch(base+"/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+process.env.LLM_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.LLM_MODEL||"gpt-4o-mini",temperature:.2,messages:[{role:"system",content:"You are a sales operations analyst. Summarize only the supplied metrics and alerts; do not invent numbers. Give two concise actionable sentences."},{role:"user",content:JSON.stringify({kpis,alerts:alerts.map(({title,severity,description})=>({title,severity,description}))})}]}),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error("LLM provider HTTP "+response.status);
 const data=await response.json() as {choices?:{message?:{content?:string}}[]};
 return data.choices?.[0]?.message?.content?.trim()||"Metrics calculated. Review the alerts and assign a clear next action to each owner.";
}
const history:AgentRun[]=[];
export async function runAgent():Promise<AgentRun>{
 const startedAt=now(),kpis=calculateKpis(),alerts=buildAlerts(deals); let summary:string;
 try{summary=await narrative(kpis,alerts);}catch{summary="Deterministic fallback: "+money(kpis.pipelineValue)+" open pipeline and "+kpis.staleDeals+" stale deals. The optional model provider was unavailable, so computed metrics and alerts were retained.";}
 const run:AgentRun={id:"run-"+Date.now(),startedAt,completedAt:now(),status:"completed",source:"demo",kpis,alerts,summary,steps:[
 {name:"Fetch CRM records",detail:deals.length+" deals and "+activities.length+" activities loaded from the demo adapter.",status:"complete"},
 {name:"Calculate KPIs",detail:"Computed pipeline, weighted forecast, closed revenue, win rate, activity completion, and stale deals.",status:"complete"},
 {name:"Evaluate thresholds",detail:alerts.length+" alert(s) generated from deterministic rules.",status:"complete"},
 {name:"Generate summary",detail:process.env.LLM_API_KEY?"Attempted configured LLM; deterministic fallback is used on errors.":"Used local grounded summary (no LLM key configured).",status:"complete"},
 {name:"Save run",detail:"Stored in process memory for this prototype; use durable storage in production.",status:"complete"}]};
 history.unshift(run); if(history.length>20)history.length=20; return run;
}
export const getRunHistory=()=>history;
export const getCurrentAlerts=()=>buildAlerts(deals);
