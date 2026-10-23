import type { Activity, Contact, Deal } from "../types.js";
const now=new Date(); const date=(daysAgo:number)=>new Date(now.getTime()-daysAgo*86400000).toISOString(); const future=(daysAhead:number)=>new Date(now.getTime()+daysAhead*86400000).toISOString();
export const contacts:Contact[]=[
{id:"c1",name:"Priya Shah",email:"priya@northstar.example",company:"Northstar Health",role:"VP Operations"},
{id:"c2",name:"Arjun Mehta",email:"arjun@bluepeak.example",company:"BluePeak Systems",role:"CFO"},
{id:"c3",name:"Maya Patel",email:"maya@orbit.example",company:"Orbit Retail",role:"Head of Digital"},
{id:"c4",name:"Rohan Desai",email:"rohan@evergreen.example",company:"Evergreen Labs",role:"CEO"},
{id:"c5",name:"Sara Khan",email:"sara@apex.example",company:"Apex Logistics",role:"Procurement Lead"},
{id:"c6",name:"Neil Joshi",email:"neil@cloudline.example",company:"Cloudline AI",role:"CTO"},
{id:"c7",name:"Isha Trivedi",email:"isha@meridian.example",company:"Meridian Finance",role:"Director, IT"},
{id:"c8",name:"Kabir Rao",email:"kabir@redwood.example",company:"Redwood Energy",role:"Program Manager"}];
export const deals:Deal[]=[
{id:"d1",name:"Enterprise workflow rollout",company:"Northstar Health",owner:"Avery Chen",stage:"Negotiation",value:148000,probability:.78,createdAt:date(38),closeDate:future(9),lastActivityAt:date(18),contactId:"c1"},
{id:"d2",name:"Cloud modernization",company:"BluePeak Systems",owner:"Jordan Lee",stage:"Proposal",value:112000,probability:.62,createdAt:date(28),closeDate:future(16),lastActivityAt:date(4),contactId:"c2"},
{id:"d3",name:"Retail analytics suite",company:"Orbit Retail",owner:"Avery Chen",stage:"Qualified",value:84000,probability:.38,createdAt:date(17),closeDate:future(29),lastActivityAt:date(3),contactId:"c3"},
{id:"d4",name:"Lab automation platform",company:"Evergreen Labs",owner:"Morgan Diaz",stage:"Negotiation",value:96000,probability:.81,createdAt:date(48),closeDate:future(5),lastActivityAt:date(16),contactId:"c4"},
{id:"d5",name:"Fleet visibility program",company:"Apex Logistics",owner:"Jordan Lee",stage:"Won",value:76000,probability:1,createdAt:date(51),closeDate:date(7),lastActivityAt:date(7),contactId:"c5"},
{id:"d6",name:"AI support workspace",company:"Cloudline AI",owner:"Morgan Diaz",stage:"Proposal",value:132000,probability:.57,createdAt:date(23),closeDate:future(21),lastActivityAt:date(2),contactId:"c6"},
{id:"d7",name:"Risk intelligence portal",company:"Meridian Finance",owner:"Avery Chen",stage:"Lead",value:64000,probability:.15,createdAt:date(10),closeDate:future(40),lastActivityAt:date(5),contactId:"c7"},
{id:"d8",name:"Energy reporting cloud",company:"Redwood Energy",owner:"Jordan Lee",stage:"Lost",value:58000,probability:0,createdAt:date(40),closeDate:date(13),lastActivityAt:date(13),contactId:"c8"},
{id:"d9",name:"Data governance package",company:"Northstar Health",owner:"Morgan Diaz",stage:"Qualified",value:91000,probability:.4,createdAt:date(20),closeDate:future(27),lastActivityAt:date(6),contactId:"c1"},
{id:"d10",name:"Omnichannel CRM refresh",company:"Orbit Retail",owner:"Jordan Lee",stage:"Proposal",value:104000,probability:.6,createdAt:date(33),closeDate:future(12),lastActivityAt:date(1),contactId:"c3"},
{id:"d11",name:"Security operations upgrade",company:"BluePeak Systems",owner:"Avery Chen",stage:"Won",value:89000,probability:1,createdAt:date(66),closeDate:date(19),lastActivityAt:date(19),contactId:"c2"},
{id:"d12",name:"Supply chain dashboard",company:"Apex Logistics",owner:"Morgan Diaz",stage:"Negotiation",value:118000,probability:.72,createdAt:date(46),closeDate:future(7),lastActivityAt:date(3),contactId:"c5"},
{id:"d13",name:"Customer data platform",company:"Cloudline AI",owner:"Jordan Lee",stage:"Qualified",value:72000,probability:.42,createdAt:date(14),closeDate:future(33),lastActivityAt:date(2),contactId:"c6"},
{id:"d14",name:"Payments reconciliation",company:"Meridian Finance",owner:"Avery Chen",stage:"Negotiation",value:68000,probability:.68,createdAt:date(36),closeDate:future(10),lastActivityAt:date(17),contactId:"c7"},
{id:"d15",name:"Field service automation",company:"Evergreen Labs",owner:"Morgan Diaz",stage:"Proposal",value:99000,probability:.55,createdAt:date(25),closeDate:future(20),lastActivityAt:date(1),contactId:"c4"},
{id:"d16",name:"Digital onboarding",company:"Redwood Energy",owner:"Jordan Lee",stage:"Won",value:54000,probability:1,createdAt:date(72),closeDate:date(28),lastActivityAt:date(28),contactId:"c8"}];
export const activities:Activity[]=[
{id:"a1",dealId:"d1",type:"Meeting",title:"Commercial terms review",owner:"Avery Chen",occurredAt:date(18),completed:true},
{id:"a2",dealId:"d2",type:"Email",title:"Proposal follow-up",owner:"Jordan Lee",occurredAt:date(4),completed:true},
{id:"a3",dealId:"d3",type:"Call",title:"Discovery call",owner:"Avery Chen",occurredAt:date(3),completed:true},
{id:"a4",dealId:"d4",type:"Meeting",title:"Scope and delivery review",owner:"Morgan Diaz",occurredAt:date(16),completed:false},
{id:"a5",dealId:"d5",type:"Task",title:"Hand over implementation plan",owner:"Jordan Lee",occurredAt:date(7),completed:true},
{id:"a6",dealId:"d6",type:"Call",title:"Technical validation",owner:"Morgan Diaz",occurredAt:date(2),completed:true},
{id:"a7",dealId:"d7",type:"Email",title:"Initial outreach",owner:"Avery Chen",occurredAt:date(5),completed:false},
{id:"a8",dealId:"d9",type:"Meeting",title:"Requirements workshop",owner:"Morgan Diaz",occurredAt:date(6),completed:true},
{id:"a9",dealId:"d10",type:"Email",title:"Revised quote sent",owner:"Jordan Lee",occurredAt:date(1),completed:true},
{id:"a10",dealId:"d12",type:"Meeting",title:"Procurement checkpoint",owner:"Morgan Diaz",occurredAt:date(3),completed:false},
{id:"a11",dealId:"d14",type:"Call",title:"Decision timeline check",owner:"Avery Chen",occurredAt:date(17),completed:false},
{id:"a12",dealId:"d15",type:"Task",title:"Send implementation outline",owner:"Morgan Diaz",occurredAt:date(1),completed:true},
{id:"a13",dealId:"d11",type:"Meeting",title:"Security sign-off",owner:"Avery Chen",occurredAt:date(19),completed:true},
{id:"a14",dealId:"d16",type:"Task",title:"Project kickoff",owner:"Jordan Lee",occurredAt:date(28),completed:true}];
