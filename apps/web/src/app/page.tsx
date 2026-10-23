"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, Bot, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Command, Download, Filter, LayoutDashboard, LifeBuoy, Menu, MoreHorizontal, Search, Settings2, Sparkles, Target, TrendingUp, Users, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { API_URL, getDashboard } from "@/lib/api";

type DashboardData = {
  filters: { period: string; manager: string; stage: string };
  kpis: { pipelineValue: number; weightedForecast: number; closedRevenue: number; winRate: number; openDeals: number; staleDeals: number; activityCompletion: number; avgDealSize: number };
  funnel: { stage: string; count: number; value: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  alerts: { id: string; severity: string; title: string; description: string }[];
  deals: { id: string; name: string; company: string; owner: string; stage: string; value: number; probability: number; closeDate: string }[];
  managers: string[]; stages: string[];
  totals: { deals: number; won: number; lost: number };
};
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const compactMoney = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
const initials = (name: string) => name.split(" ").map(part => part[0]).slice(0, 2).join("");
const colors = ["#8170f2", "#24b983", "#edac54", "#438bf4"];
const stageColor: Record<string, string> = { Lead:"gray", Qualified:"blue", Proposal:"purple", Negotiation:"orange", Won:"green", Lost:"red" };

function MetricCard({ title, value, delta, positive, icon, foot }: { title: string; value: string; delta: string; positive: boolean; icon: React.ReactNode; foot: string }) {
  return <article className="metric-card"><div className="metric-top"><span>{title}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span className={positive ? "delta positive" : "delta negative"}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {delta}</span><span className="muted">{foot}</span></div></article>;
}
export default function DashboardPage() {
  const [period,setPeriod]=useState("30d"),[manager,setManager]=useState("all"),[stage,setStage]=useState("all");
  const [data,setData]=useState<DashboardData|null>(null),[error,setError]=useState(""),[loading,setLoading]=useState(true);
  const [agentBusy,setAgentBusy]=useState(false),[agentSummary,setAgentSummary]=useState("");
  const [chatOpen,setChatOpen]=useState(false),[message,setMessage]=useState(""),[chatReply,setChatReply]=useState(""),[chatBusy,setChatBusy]=useState(false),[mobileNav,setMobileNav]=useState(false);
  const refresh=useCallback(async()=>{setLoading(true);setError("");try{setData(await getDashboard({period,manager,stage}) as DashboardData);}catch{setError("Could not connect to the demo API. Start it with npm run dev:api.");}finally{setLoading(false);}},[period,manager,stage]);
  useEffect(()=>{void refresh();},[refresh]);
  const totalPipeline=useMemo(()=>data?.funnel.reduce((sum,item)=>sum+item.value,0)||0,[data]);
  async function runAgent(){setAgentBusy(true);try{const response=await fetch(API_URL+"/api/agent/run",{method:"POST"});const result=await response.json();setAgentSummary(result.summary||"Agent run completed.");await refresh();}catch{setAgentSummary("Unable to run the agent. Check the API connection.");}finally{setAgentBusy(false);}}
  async function sendChat(e:React.FormEvent){e.preventDefault();if(!message.trim())return;setChatBusy(true);setChatReply("");try{const response=await fetch(API_URL+"/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});const result=await response.json();setChatReply(result.answer||result.error);}catch{setChatReply("Could not reach the SalesPilot API.");}finally{setChatBusy(false);}}
  return <div className="app-shell">
    <aside className={"sidebar "+(mobileNav?"sidebar-open":"")}>
      <div className="brand"><div className="brand-mark"><Sparkles size={19}/></div><span>salespilot<span className="brand-ai">.ai</span></span><button className="close-nav" onClick={()=>setMobileNav(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">N</div><div className="workspace-text"><strong>Northstar Inc.</strong><span>Growth workspace</span></div><ChevronDown size={15}/></div>
      <div className="nav-label">WORKSPACE</div><nav className="side-nav">
        <a className="nav-item active" href="#"><LayoutDashboard size={17}/> Overview <span className="nav-pip"/></a>
        <a className="nav-item" href="#deals"><Target size={17}/> Deals <span className="nav-count">{data?.totals.deals??"—"}</span></a>
        <a className="nav-item" href="#team"><Users size={17}/> Team performance</a><a className="nav-item" href="#activity"><Activity size={17}/> Activities</a>
        <a className="nav-item" href="#alerts"><Bell size={17}/> Alerts <span className="nav-count">{data?.alerts.length??"—"}</span></a>
      </nav>
      <div className="nav-label ai-label">AI TOOLS</div><button className="nav-item nav-button" onClick={()=>setChatOpen(true)}><Bot size={17}/> Sales assistant <span className="new-pill">NEW</span></button>
      <button className="nav-item nav-button" onClick={runAgent}><Sparkles size={17}/> Run insight agent</button>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-ico"><LifeBuoy size={17}/></div><strong>Need a hand?</strong><span>Explore your AI workspace</span><button onClick={()=>setChatOpen(true)}>Ask the assistant <span>↗</span></button></div>
        <a className="nav-item" href="#settings"><Settings2 size={17}/> Settings</a><div className="profile-row"><div className="profile-avatar">DC</div><div className="profile-copy"><strong>Daniel Carter</strong><span>Sales administrator</span></div><MoreHorizontal size={19}/></div>
      </div>
    </aside>
    {mobileNav&&<button className="nav-backdrop" aria-label="Close navigation" onClick={()=>setMobileNav(false)}/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={()=>setMobileNav(true)} aria-label="Open menu"><Menu size={19}/></button><span className="breadcrumbs">Workspace <span>/</span> <strong>Overview</strong></span><span className="demo-indicator"><i/> Demo data</span></div>
        <div className="topbar-actions"><button className="icon-button search-shortcut" aria-label="Search"><Search size={17}/><kbd>⌘ K</kbd></button><button className="icon-button notification-btn" aria-label="Notifications"><Bell size={18}/><i/></button><div className="top-avatar">DC</div></div>
      </header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> SALES INTELLIGENCE</div><h1>Good morning, Daniel <span className="wave">✳</span></h1><p className="page-subtitle">Here’s what’s happening across your pipeline today.</p></div><div className="welcome-actions"><button className="btn btn-light" onClick={()=>void refresh()}><Download size={16}/> Refresh data</button><button className="btn btn-primary" onClick={runAgent} disabled={agentBusy}><Sparkles size={16}/>{agentBusy?"Analyzing…":"Generate insights"}</button></div></section>
        <section className="filters-row"><div className="updated"><span className="live-dot"/> Last synced just now <span className="v-divider"/> <CalendarDays size={14}/> Oct 2026</div><div className="filter-controls"><label><Filter size={14}/><select value={period} onChange={e=>setPeriod(e.target.value)} aria-label="Period"><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="all">All time</option></select></label><label><Users size={14}/><select value={manager} onChange={e=>setManager(e.target.value)} aria-label="Manager"><option value="all">All managers</option>{(data?.managers||[]).map(item=><option key={item}>{item}</option>)}</select></label><label><Target size={14}/><select value={stage} onChange={e=>setStage(e.target.value)} aria-label="Stage"><option value="all">All stages</option>{(data?.stages||[]).map(item=><option key={item}>{item}</option>)}</select></label></div></section>
        {error&&<div className="error-banner"><CircleHelp size={17}/>{error}<button onClick={()=>void refresh()}>Retry</button></div>}
        {loading&&!data&&<div className="loading-panel">Loading sales intelligence…</div>}
        {data&&<>
          <section className="metric-grid">
            <MetricCard title="Open pipeline" value={compactMoney(data.kpis.pipelineValue)} delta="+12.8%" positive icon={<Target size={17}/>} foot="vs. previous period"/>
            <MetricCard title="Weighted forecast" value={compactMoney(data.kpis.weightedForecast)} delta="+8.4%" positive icon={<TrendingUp size={17}/>} foot="vs. previous period"/>
            <MetricCard title="Closed revenue" value={compactMoney(data.kpis.closedRevenue)} delta="+4.6%" positive icon={<Command size={17}/>} foot="vs. previous period"/>
            <MetricCard title="Win rate" value={data.kpis.winRate.toFixed(1)+"%"} delta="-2.1%" positive={false} icon={<Activity size={17}/>} foot="vs. previous period"/>
          </section>
          <section className="charts-grid">
            <div className="panel revenue-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p>Closed-won revenue over the last 6 months</p></div><button className="dots-btn" aria-label="Revenue options"><MoreHorizontal size={19}/></button></div>
              <div className="chart-legend"><span><i className="legend-mint"/> Revenue</span><span className="chart-caption">Monthly · USD</span></div>
              <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.monthlyRevenue} margin={{top:10,right:8,left:0,bottom:0}}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#36c98e" stopOpacity={.23}/><stop offset="95%" stopColor="#36c98e" stopOpacity={.01}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"#929bad",fontSize:11}} dy={10}/><YAxis axisLine={false} tickLine={false} tickFormatter={v=>compactMoney(Number(v))} tick={{fill:"#929bad",fontSize:11}} width={53}/><Tooltip formatter={value=>money(Number(value))} contentStyle={{border:"1px solid #e8edf3",borderRadius:12,fontSize:12,boxShadow:"0 8px 25px #17203312"}}/><Area type="monotone" dataKey="revenue" stroke="#23b47e" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{r:5,strokeWidth:0,fill:"#169e6b"}}/></AreaChart></ResponsiveContainer></div>
            </div>
            <div className="panel funnel-panel"><div className="panel-heading"><div><h2>Pipeline by stage</h2><p>Opportunity distribution</p></div><button className="dots-btn" aria-label="Pipeline options"><MoreHorizontal size={19}/></button></div>
              <div className="funnel-total"><div><span>Total pipeline</span><strong>{compactMoney(totalPipeline)}</strong></div><span className="funnel-legend"><i/> Value</span></div>
              <div className="funnel-bars">{data.funnel.map((item,index)=><div className="funnel-item" key={item.stage}><div className="funnel-label"><span>{item.stage}</span><span>{compactMoney(item.value)} <b>· {item.count}</b></span></div><div className="bar-track"><div className="bar-fill" style={{width:(totalPipeline?item.value/Math.max(...data.funnel.map(x=>x.value),1)*100:0)+"%",background:colors[index%colors.length]}}/></div></div>)}</div>
            </div>
          </section>
          {agentSummary&&<section className="agent-summary"><div className="agent-summary-icon"><Sparkles size={17}/></div><div><strong>SalesPilot insight</strong><p>{agentSummary}</p></div><button onClick={()=>setAgentSummary("")} aria-label="Dismiss"><X size={16}/></button></section>}
          <section className="lower-grid">
            <div className="panel deals-panel" id="deals"><div className="panel-heading"><div><h2>Priority opportunities</h2><p>Deals that may need your attention</p></div><a className="text-link" href="#all-deals">View all <span>↗</span></a></div>
              <div className="table-wrap"><table><thead><tr><th>OPPORTUNITY</th><th>OWNER</th><th>STAGE</th><th>VALUE</th><th>CLOSE DATE</th></tr></thead><tbody>{data.deals.map(deal=><tr key={deal.id}><td><div className="deal-name">{deal.name}</div><div className="deal-company">{deal.company}</div></td><td><div className="owner-cell"><span className={"owner-avatar avatar-"+(deal.owner.length%4)}>{initials(deal.owner)}</span>{deal.owner.split(" ")[0]}</div></td><td><span className={"stage-pill stage-"+(stageColor[deal.stage]||"gray")}><i/>{deal.stage}</span></td><td className="value-cell">{money(deal.value)}</td><td className="date-cell">{new Date(deal.closeDate).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</td></tr>)}</tbody></table>{data.deals.length===0&&<div className="empty-state">No opportunities match these filters.</div>}</div>
              <div className="table-footer"><span>Showing <strong>{data.deals.length}</strong> of <strong>{data.totals.deals}</strong> opportunities</span><div><button disabled>‹</button><button className="pager-active">1</button><button disabled>›</button></div></div>
            </div>
            <div className="right-stack">
              <div className="panel alerts-panel" id="alerts"><div className="panel-heading"><div><h2>Needs attention <span className="alert-badge">{data.alerts.length}</span></h2><p>AI-detected risks in your pipeline</p></div><button className="dots-btn" aria-label="More alerts"><MoreHorizontal size={19}/></button></div>
                <div className="alert-list">{data.alerts.slice(0,3).map((alert,i)=><div className="alert-item" key={alert.id}><div className={"alert-symbol alert-"+alert.severity}>{alert.severity==="high"?<Bell size={15}/>:<Clock3 size={15}/>}</div><div className="alert-copy"><strong>{alert.title}</strong><p>{alert.description}</p><span>{i===0?"Needs review":"Suggested next step"}</span></div><button className="alert-more" aria-label="Alert options"><MoreHorizontal size={17}/></button></div>)}</div><button className="view-alerts" onClick={()=>setChatOpen(true)}>Review with AI assistant <span>→</span></button>
              </div>
              <div className="agent-card"><div className="agent-card-top"><span className="agent-orb"><Sparkles size={18}/></span><span className="agent-status"><i/> READY TO ANALYZE</span></div><h3>Your AI sales analyst</h3><p>Spot pipeline risks, summarize performance, and decide what to do next.</p><button onClick={()=>setChatOpen(true)}>Ask SalesPilot <span>↗</span></button><div className="agent-card-sparkle">✳</div></div>
            </div>
          </section>
          <section className="panel performance-panel" id="team"><div className="panel-heading"><div><h2>Team snapshot</h2><p>High-level activity from the demo CRM dataset</p></div></div><div className="team-stats"><div><span>Open opportunities</span><strong>{data.kpis.openDeals}</strong><small><Target size={13}/> Active pipeline</small></div><div><span>Activity completion</span><strong>{data.kpis.activityCompletion.toFixed(0)}%</strong><small><Check size={13}/> Tasks marked complete</small></div><div><span>Stale opportunities</span><strong>{data.kpis.staleDeals}</strong><small><Clock3 size={13}/> No activity in 14+ days</small></div><div><span>Average deal size</span><strong>{compactMoney(data.kpis.avgDealSize)}</strong><small><TrendingUp size={13}/> All records</small></div></div></section>
        </>}
        <footer className="page-footer"><span>© 2026 SalesPilot AI <i/> Built for sharper sales decisions</span><span><a href="#docs">Documentation</a><a href="#privacy">Privacy</a><a href="#help"><CircleHelp size={14}/> Help</a></span></footer>
      </div>
    </main>
    {chatOpen&&<div className="chat-overlay" role="dialog" aria-modal="true" aria-label="SalesPilot assistant"><button className="chat-scrim" onClick={()=>setChatOpen(false)} aria-label="Close assistant"/><section className="chat-panel"><header><div className="chat-title-icon"><Bot size={20}/></div><div><strong>SalesPilot assistant</strong><span><i/> Using demo CRM data</span></div><button onClick={()=>setChatOpen(false)} aria-label="Close"><X size={19}/></button></header><div className="chat-body"><div className="assistant-message"><span className="assistant-mini"><Sparkles size={15}/></span><div><strong>Hi Daniel, what are we solving today?</strong><p>I can help you explore pipeline health, understand risks, or prepare next steps for your team.</p></div></div><div className="quick-prompts"><button onClick={()=>setMessage("What deals are at risk?")}>What deals are at risk?</button><button onClick={()=>setMessage("Summarize the pipeline forecast")}>Summarize the forecast</button><button onClick={()=>setMessage("What is our win rate?")}>Explain our win rate</button></div>{chatReply&&<div className="assistant-reply">{chatReply}</div>}{chatBusy&&<div className="typing">Analyzing CRM metrics…</div>}</div><form className="chat-compose" onSubmit={sendChat}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about your sales data…" maxLength={1000}/><button type="submit" disabled={chatBusy||!message.trim()} aria-label="Send message"><ArrowUpRight size={18}/></button></form><div className="chat-disclaimer">Answers are grounded in synthetic demo records.</div></section></div>}
  </div>;
}
