export type DealStage = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
export interface Deal { id:string; name:string; company:string; owner:string; stage:DealStage; value:number; probability:number; createdAt:string; closeDate:string; lastActivityAt:string; contactId:string; }
export interface Contact { id:string; name:string; email:string; company:string; role:string; }
export interface Activity { id:string; dealId:string; type:"Call"|"Email"|"Meeting"|"Task"; title:string; owner:string; occurredAt:string; completed:boolean; }
export interface Alert { id:string; severity:"high"|"medium"|"low"; title:string; description:string; dealId?:string; createdAt:string; }
export interface Kpis { pipelineValue:number; weightedForecast:number; closedRevenue:number; winRate:number; openDeals:number; staleDeals:number; activityCompletion:number; avgDealSize:number; }
