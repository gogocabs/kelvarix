/** Page copy. Structure only — no styling decisions live here. */

export const hero = {
  status: "Agents on shift",
  eyebrow: "AI operations studio",
  headline: ["Your business,", "run by one tireless agent."],
  lead: "Kelvarix absorbs the busywork — the follow-ups, the chasing, the copy-paste — and does it inside the tools you already use. Ten desks of chaos, handled by one calm machine.",
  primaryCta: "Map my busiest workflow",
  secondaryCta: "See what it takes over",
  footnote: "Free 30-minute call · one workflow, one KPI, fixed scope",
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
  {
    pain: "Leads sitting unread till Monday",
    outcome: "Every enquiry scored, routed and replied in seconds",
    stat: "<60s response",
  },
  {
    pain: "Chasing follow-ups and bookings",
    outcome: "Agent follows up, books the calendar, logs it in your CRM",
    stat: "0 leads dropped",
  },
  {
    pain: "Calls with no notes or next step",
    outcome: "Calls answered, transcribed, requirements extracted",
    stat: "100% captured",
  },
  {
    pain: "Invoices generated and chased by hand",
    outcome: "Auto-generated, sent, reminded and reconciled",
    stat: "−80% admin hours",
  },
  {
    pain: "WhatsApp inbox chaos",
    outcome: "Intent classified — auto-replied or escalated with context",
    stat: "24/7 coverage",
  },
  {
    pain: "Tier-1 support eating the day",
    outcome: "Resolved instantly; clean handoff with full transcript",
    stat: "−60% ticket load",
  },
  {
    pain: "Copy-paste between five tools",
    outcome: "CRM, calendar, inbox and sheets stay in sync on their own",
    stat: "0 double-entry",
  },
  {
    pain: "No idea what the numbers say",
    outcome: "A plain-English daily digest — risks flagged, wins listed",
    stat: "1 glance / day",
  },
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
    q: "Do we need to change our tools?",
    a: "No. We wire into what you already use — CRM, calendar, inbox, WhatsApp, sheets — through native integrations and APIs.",
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
} as const;
