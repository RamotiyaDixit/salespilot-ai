# API guide
Base URL: `http://localhost:4000`. All records are synthetic in this prototype.

| Method | Route | Description |
|---|---|---|
| GET | `/health` | API health and mode |
| GET | `/api/dashboard?period=30d&manager=all&stage=all` | KPIs, charts, alerts, filtered deals, and filter options |
| GET | `/api/kpis` | KPI snapshot |
| GET | `/api/alerts` | Current deterministic alerts |
| GET | `/api/crm/deals?manager=...&stage=...` | Filtered deals |
| GET | `/api/crm/contacts` | Demo contacts |
| GET | `/api/crm/activities` | Demo activities |
| POST | `/api/agent/run` | Execute KPI/alert agent loop |
| GET | `/api/agent/runs` | Last 20 in-memory agent runs |
| POST | `/api/chat` | Rule-grounded conversational insights |

Example chat request: `{"message":"What deals are at risk?"}`

The agent result includes `kpis`, `alerts`, `summary`, and a `steps` trace. An optional OpenAI-compatible chat-completions provider can generate its narrative; KPI metrics and rule-based alerts remain local and available without a model key.

Filters: `period` is `7d`, `30d`, `90d`, or `all` (based on creation date); manager is the deal owner or `all`; stage is one of the CRM stages or `all`.

Authentication, tenant isolation, pagination, durable persistence, and CRM OAuth integrations are intentionally omitted from this prototype.
