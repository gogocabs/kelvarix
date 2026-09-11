/**
 * kelvarix site worker — static assets + same-origin API proxy.
 *
 * Why the proxy: the contact form POSTs to /api/leads on the SAME origin so
 * in-app browsers (Instagram/Facebook webviews) never hit cross-origin CORS
 * preflights, which they notoriously fail. Requests are forwarded to the
 * kelvarix-leads backend with the real client IP + a shared proxy secret.
 *
 * With `run_worker_first = ["/api/*"]`, all other requests serve static
 * assets directly without touching this code.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/leads") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: sameOriginCors(request) });
      }
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ ok: false, error: "method" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...sameOriginCors(request) },
        });
      }
      const clientIp =
        request.headers.get("CF-Connecting-IP") ||
        (request.headers.get("X-Forwarded-For") || "").split(",")[0].trim();
      let body = "";
      try {
        body = await request.text();
        JSON.parse(body); // reject non-JSON early, same as the backend would
      } catch {
        return new Response(JSON.stringify({ ok: false, error: "bad-json" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...sameOriginCors(request) },
        });
      }
      try {
        const upstream = await fetch(`${env.LEADS_API}/api/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Client-Ip": clientIp,
            "X-Proxy-Secret": env.PROXY_SECRET || "",
          },
          body,
        });
        const out = await upstream.text();
        return new Response(out, {
          status: upstream.status,
          headers: { "Content-Type": "application/json", ...sameOriginCors(request) },
        });
      } catch {
        return new Response(JSON.stringify({ ok: false, error: "upstream" }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...sameOriginCors(request) },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};

function sameOriginCors(request) {
  const origin = request.headers.get("Origin") || "";
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
