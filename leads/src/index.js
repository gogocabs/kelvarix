/**
 * kelvarix-leads — contact-form backend for kelvarix.in
 *
 * POST /api/leads  public (CORS allowlist) → validate → D1 → Telegram fan-out
 * GET  /           admin (HTTP Basic)      → leads table UI
 * GET  /api/leads  admin (HTTP Basic)      → JSON feed (?q= search, ?limit=, ?offset=)
 * GET  /health     public                  → 200 ok
 *
 * Secrets (wrangler secret put, never git): TELEGRAM_BOT_TOKEN,
 * TELEGRAM_CHAT_ID ("PENDING" until verified), ADMIN_USER, ADMIN_PASS,
 * TURNSTILE_SECRET (later — hook below is ready).
 */

const LIMITS = { name: [2, 80], business: [0, 120], email: [5, 254], phone: [4, 24], message: [10, 2000] };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map(); // ip -> number[] (best-effort, per isolate)

/* ---------- Turnstile hook: dormant until TURNSTILE_SECRET is set ---------- */
async function verifyTurnstile(secret, token, ip) {
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, error: "missing-token" };
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || "" }),
    });
    const data = await res.json();
    return data.success ? { ok: true } : { ok: false, error: "bad-token" };
  } catch {
    return { ok: false, error: "verify-failed" };
  }
}

/* ---------- helpers ---------- */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

async function sha256Hex(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function checkAuth(request, env) {
  if (!env.ADMIN_USER || !env.ADMIN_PASS) return false;
  const m = /^Basic (.+)$/.exec(request.headers.get("Authorization") || "");
  if (!m) return false;
  let decoded;
  try { decoded = atob(m[1]); } catch { return false; }
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  const [u, p] = [await sha256Hex(decoded.slice(0, i)), await sha256Hex(decoded.slice(i + 1))];
  return timingEqual(u, await sha256Hex(env.ADMIN_USER)) &&
         timingEqual(p, await sha256Hex(env.ADMIN_PASS));
}

const unauthorized = () => new Response("Login required", {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="kelvarix-leads"', "Content-Type": "text/plain" },
});

function cors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const h = { Vary: "Origin" };
  if (origin && allowed.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RATE_MAX;
}

/* ---------- Telegram fan-out (fire-and-forget via ctx.waitUntil) ---------- */
async function sendTelegram(env, lead) {
  const token = env.TELEGRAM_BOT_TOKEN, chat = env.TELEGRAM_CHAT_ID;
  if (!token || !chat || chat === "PENDING") return { sent: false, reason: "not-configured" };
  const text = [
    "<b>New lead — Kelvarix</b>",
    `Name: ${esc(lead.name)}`,
    `Business: ${esc(lead.business || "—")}`,
    `Email: ${esc(lead.email)}`,
    `Phone: ${esc(lead.phone)}`,
    "",
    esc(lead.message),
  ].join("\n").slice(0, 4000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML" }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.ok ? { sent: true } : { sent: false, reason: `tg-${res.status}` };
  } catch {
    return { sent: false, reason: "network" };
  }
}

/* ---------- POST /api/leads ---------- */
async function handleLead(request, env, ctx) {
  const baseHeaders = { "Content-Type": "application/json", ...cors(request, env) };
  const ip = request.headers.get("CF-Connecting-IP") || "";
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, error: "rate-limited" }), { status: 429, headers: baseHeaders });
  }

  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ ok: false, error: "bad-json" }), { status: 400, headers: baseHeaders }); }

  // Honeypot: bots fill it; pretend success without storing.
  if (body.company_website) {
    return new Response(JSON.stringify({ ok: true, id: 0 }), { status: 201, headers: baseHeaders });
  }

  const ts = await verifyTurnstile(env.TURNSTILE_SECRET, body["cf-turnstile-response"], ip);
  if (!ts.ok) {
    return new Response(JSON.stringify({ ok: false, error: "captcha" }), { status: 403, headers: baseHeaders });
  }

  const name = String(body.name || "").trim();
  const business = String(body.business || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  // Phone arrives combined ("+91 9876543210"); India needs exactly 10 digits,
  // any other country code skips the length check (no OTP flow to verify).
  const rawPhone = String(body.phone || "").trim().replace(/\s+/g, " ");
  const digits = rawPhone.replace(/\D/g, "");
  const cc = (rawPhone.match(/^\+?(\d{1,4})[\s-]/) || [])[1] || "";
  const national = cc && digits.startsWith(cc) ? digits.slice(cc.length) : digits;
  const indian = cc === "" || cc === "91";
  const phone = rawPhone.slice(0, LIMITS.phone[1]);
  const problems = [];
  if (name.length < LIMITS.name[0] || name.length > LIMITS.name[1]) problems.push("name");
  if (business.length > LIMITS.business[1]) problems.push("business");
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email[1]) problems.push("email");
  if (indian ? national.length !== 10 : national.length < 4) problems.push("phone");
  if (message.length < LIMITS.message[0] || message.length > LIMITS.message[1]) problems.push("message");
  if (problems.length) {
    return new Response(JSON.stringify({ ok: false, error: "validation", fields: problems }), { status: 422, headers: baseHeaders });
  }

  const ipHash = ip ? (await sha256Hex(`kelvarix-leads|${ip}`)).slice(0, 16) : "";
  const source = String(body.source || "kelvarix.in").slice(0, 60);
  let id;
  try {
    const r = await env.DB.prepare(
      "INSERT INTO leads (name, business, email, phone, message, source, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(name, business, email, phone, message, source, ipHash).run();
    id = r.meta.last_row_id;
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "db" }), { status: 500, headers: baseHeaders });
  }

  const lead = { id, name, business, email, phone, message };
  ctx.waitUntil((async () => {
    const t = await sendTelegram(env, lead);
    if (t.sent) {
      await env.DB.prepare("UPDATE leads SET telegram_ok = 1 WHERE id = ?").bind(id).run().catch(() => {});
    }
  })());

  return new Response(JSON.stringify({ ok: true, id }), { status: 201, headers: baseHeaders });
}

/* ---------- admin: JSON feed ---------- */
async function handleFeed(request, env, url) {
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1), 200);
  const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);
  let rows;
  if (q) {
    rows = (await env.DB.prepare(
      "SELECT id, created_at, name, business, email, phone, message, source, telegram_ok FROM leads WHERE name LIKE ? OR email LIKE ? OR business LIKE ? OR message LIKE ? OR phone LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?",
    ).bind(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, limit, offset).all()).results;
  } else {
    rows = (await env.DB.prepare(
      "SELECT id, created_at, name, business, email, phone, message, source, telegram_ok FROM leads ORDER BY id DESC LIMIT ? OFFSET ?",
    ).bind(limit, offset).all()).results;
  }
  const total = (await env.DB.prepare("SELECT COUNT(*) AS n FROM leads").first()).n;
  return Response.json({ ok: true, total, rows });
}

/* ---------- admin: HTML page ---------- */
function adminPage(url) {
  const q = esc(url.searchParams.get("q") || "");
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Kelvarix Leads</title>
<style>
body{font-family:system-ui,sans-serif;background:#0E2740;color:#FCFCFB;margin:0;padding:24px}
h1{font-size:20px;margin:0 0 4px}.sub{color:#A8BACB;font-size:13px;margin-bottom:16px}
form{display:flex;gap:8px;margin-bottom:16px}
input{flex:1;padding:8px 12px;border-radius:8px;border:1px solid #2A5B7D;background:#173B57;color:#fff}
button{padding:8px 16px;border-radius:8px;border:0;background:#D9A441;color:#0E2740;font-weight:700;cursor:pointer}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #2A5B7D;vertical-align:top}
th{color:#2AA8A8;text-transform:uppercase;font-size:11px;letter-spacing:.08em}
.msg{max-width:340px;white-space:pre-wrap}.ok{color:#2AA8A8}.no{color:#D9A441}
a{color:#2AA8A8}.meta{color:#A8BACB;font-size:12px;margin-top:16px}
</style></head><body>
<h1>Kelvarix Leads</h1><div class="sub">Internal — do not share this URL.</div>
<form method="get"><input name="q" placeholder="Search name, email, business…" value="${q}"><button>Search</button></form>
<table><thead><tr><th>#</th><th>Time (UTC)</th><th>Name</th><th>Business</th><th>Email</th><th>Phone</th><th>Message</th><th>TG</th></tr></thead>
<tbody id="rows"><tr><td colspan="8">Loading…</td></tr></tbody></table>
<div class="meta" id="meta"></div>
<p class="meta"><a href="#" id="logout">Log out</a> (clears saved login)</p>
<script>
const q = new URLSearchParams(location.search).get("q") || "";
fetch("/api/leads?q=" + encodeURIComponent(q) + "&limit=100").then(r => r.json()).then(d => {
  document.getElementById("meta").textContent = d.total + " lead(s) total";
  document.getElementById("rows").innerHTML = d.rows.map(r =>
    "<tr><td>" + r.id + "</td><td>" + r.created_at.replace("T"," ").slice(0,19) +
    "</td><td>" + e(r.name) + "</td><td>" + e(r.business || "—") +
    "</td><td><a href='mailto:" + e(r.email) + "'>" + e(r.email) + "</a>" +
    "</td><td><a href='tel:" + e(r.phone.replace(/[^+\\d]/g, "")) + "'>" + e(r.phone || "—") + "</a>" +
    "</td><td class='msg'>" + e(r.message) + "</td>" +
    "<td class='" + (r.telegram_ok ? "ok'>✓" : "no'>…") + "</td></tr>").join("") || "<tr><td colspan='8'>No leads yet.</td></tr>";
});
function e(s){return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("logout").onclick = (ev) => {
  ev.preventDefault();
  fetch(location.href, { headers: { Authorization: "Basic bG9nb3V0Onh6eg==" } }).finally(() => location.reload());
};
</script></body></html>`, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" } });
}

/* ---------- router ---------- */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(request, env) });
    }
    if (url.pathname === "/health") {
      return new Response("ok", { headers: { "Content-Type": "text/plain" } });
    }
    if (url.pathname === "/api/leads" && request.method === "POST") {
      return handleLead(request, env, ctx);
    }
    if (url.pathname === "/" && request.method === "GET") {
      if (!(await checkAuth(request, env))) return unauthorized();
      return adminPage(url);
    }
    if (url.pathname === "/api/leads" && request.method === "GET") {
      if (!(await checkAuth(request, env))) return unauthorized();
      try { return await handleFeed(request, env, url); }
      catch { return Response.json({ ok: false, error: "db" }, { status: 500 }); }
    }
    return new Response("Not found", { status: 404 });
  },
};
