/**
 * Same-origin API proxy for Vercel. The SPA calls `/api/v1/...`; this function
 * forwards to `API_ORIGIN` so the auth cookie stays first-party.
 *
 * Set `API_ORIGIN` in the Vercel project (e.g. https://echoes-engine.onrender.com).
 * Keep `VITE_API_BASE_URL=/api/v1`.
 */

export const config = {
  runtime: "edge",
};

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
]);

export default async function handler(request: Request): Promise<Response> {
  const apiOrigin = process.env.API_ORIGIN?.trim().replace(/\/+$/, "");
  if (!apiOrigin) {
    return Response.json({ error: "API_ORIGIN is not configured" }, { status: 500 });
  }

  const incoming = new URL(request.url);
  const target = new URL(`${incoming.pathname}${incoming.search}`, `${apiOrigin}/`);

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  headers.set("host", new URL(apiOrigin).host);

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      responseHeaders.append(key, value);
    }
  });

  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];
  for (const cookie of setCookies) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
