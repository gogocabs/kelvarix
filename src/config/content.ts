/** Page copy. Structure only — no styling decisions live here. */

export const hero = {
  status: "Agents on shift",
  eyebrow: "AI operations studio",
  headline: ["Your business,", "run by Kelvarix agents."],
  lead: "Kelvarix agents absorb the busywork — the follow-ups, the chasing, the copy-paste — and do it inside the tools you already use. Ten desks of chaos, managed automatically.",
  primaryCta: "Map my busiest workflow",
  secondaryCta: "See what it takes over",
  footnote: "One 30-minute call · 10× your business improvement",
} as const;

/** Channels the agent covers, drawn as the hero's circuit diagram. */
export const channels = [
  "Calls",
  "Chats",
  "Invoices",
  "Inbox",
  "Leads",
  "Reports",
] as const;

export const operations = [
  { icon: "mail",         pain: "Leads sitting unread till Monday",       outcome: "Every enquiry scored, routed and replied in seconds",                       stat: "<60s response"    },
  { icon: "calendar",     pain: "Chasing follow-ups and bookings",        outcome: "Agent follows up, books the calendar, logs it in your CRM",                stat: "0 leads dropped"  },
  { icon: "phone",        pain: "Calls with no notes or next step",       outcome: "Calls answered, transcribed, requirements extracted",                       stat: "100% captured"    },
  { icon: "file-text",    pain: "Invoices generated and chased by hand",  outcome: "Auto-generated, sent, reminded and reconciled",                            stat: "−80% admin hours" },
  { icon: "message",      pain: "WhatsApp inbox chaos",                   outcome: "Intent classified — auto-replied or escalated with context",                stat: "24/7 coverage"    },
  { icon: "headphones",   pain: "Tier-1 support eating the day",          outcome: "Resolved instantly; clean handoff with full transcript",                    stat: "−60% ticket load" },
  { icon: "refresh",      pain: "Copy-paste between five tools",          outcome: "CRM, calendar, inbox and sheets stay in sync on their own",                 stat: "0 double-entry"   },
  { icon: "bar-chart",    pain: "No idea what the numbers say",           outcome: "A plain-English daily digest — risks flagged, wins listed",                stat: "1 glance / day"   },
  { icon: "credit-card",  pain: "Paying per invoice on a SaaS tool",      outcome: "Custom invoice system built to your exact workflow, owned by you",         stat: "−70% tool cost"   },
  { icon: "mic",          pain: "Call recordings never analysed",         outcome: "AI extracts insights, trends and actions from every recording",             stat: "100% analysed"    },
  { icon: "database",     pain: "Paying for a CRM that doesn't fit",      outcome: "Custom CRM built to your data model — no seats, no lock-in",               stat: "−60% CRM cost"    },
  { icon: "trending-up",  pain: "Website not converting visitors",        outcome: "Clean, fast, conversion-optimised redesign — shipped in weeks",             stat: "2× conversion"    },
  { icon: "search",       pain: "SEO / GEO / AEO flying blind",           outcome: "Automated system tracks rankings and reports changes daily",                stat: "0 blind spots"    },
  { icon: "eye",          pain: "Competitor research done by hand",       outcome: "Agent monitors competitors and delivers structured reports automatically",  stat: "0 manual scans"   },
] as const;

export const steps = [
  {
    n: "01",
    title: "Tell us how work gets done",
    text: "A 30-minute call. Walk us through your busiest workflow the way you'd brief a new hire — no tech prep needed.",
  },
  {
    n: "02",
    title: "We map the highest-ROI bottleneck",
    text: "You get a written blueprint: what the agent handles, what it escalates, and the KPI we'll be judged on.",
  },
  {
    n: "03",
    title: "Your agent goes live in weeks",
    text: "Wired into your tools, tested on real cases, reporting to a dashboard you can read in one glance.",
  },
] as const;

export const metrics = [
  { value: "10×", label: "output on the same headcount" },
  { value: "24/7", label: "coverage — nights, weekends, holidays" },
  { value: "−60%", label: "operating cost on repeat work" },
  { value: "0 days", label: "training time. It ships trained" },
] as const;

export const industries = [
  {
    name: "Real Estate",
    points: [
      "Buyer enquiries qualified in seconds",
      "Viewings booked without phone tag",
      "Every viewing followed up automatically",
    ],
  },
  {
    name: "E-commerce",
    points: [
      "Order questions answered instantly",
      "Abandoned carts recovered on autopilot",
      "Returns triaged before they reach you",
    ],
  },
  {
    name: "Healthcare",
    points: [
      "Appointments booked and confirmed",
      "Reminders cut no-shows",
      "Intake forms pre-filled and filed",
    ],
  },
  {
    name: "Law Firms",
    points: [
      "Client intake structured at midnight or midday",
      "Contracts summarised to one page",
      "Matters triaged to the right fee-earner",
    ],
  },
  {
    name: "Agencies",
    points: [
      "Inbound leads scored before standup",
      "Reporting drafted from live data",
      "Client updates sent without chasing",
    ],
  },
] as const;

export const faqs = [
  {
    q: "Is this just a chatbot?",
    a: "No. Chatbots answer questions when prompted. Our agents own a job: they watch your inbox, calendar and CRM, take action across tools, and report back — around the clock.",
  },
  {
    q: "What if the agent gets something wrong?",
    a: "Every agent ships with explicit escalation rules: anything sensitive, uncertain or out-of-scope goes to a human with full context. You set the boundaries in the blueprint.",
  },
  {
    q: "Do you wire existing tools or build new ones?",
    a: "Both. We wire into what you already use — CRM, calendar, inbox, WhatsApp, sheets — through native integrations and APIs. Where no tool fits, we build one for you. Either way, the goal is the same: your operations run faster and fully automated.",
  },
  {
    q: "How fast do we see results?",
    a: "Focused builds go live in weeks. We agree one measurable KPI up front (response time, qualified leads, hours saved) and prove ROI on one workflow before anything scales.",
  },
  {
    q: "How much does it cost?",
    a: "Fixed-scope pricing agreed before we build — no hourly billing, no surprises. The number depends on workflow and integrations, quoted after the free mapping call.",
  },
] as const;

export const contact = {
  eyebrow: "Start here",
  heading: "Bring us your busiest workflow.",
  body: "Tell us how work gets done today. We'll reply within 24 hours with honest first thoughts — even if the answer is \"don't automate this yet.\"",
  whatsappCta: "Chat on WhatsApp",
  whatsappImmediate: "For immediate start — fastest on WhatsApp.",
} as const;
