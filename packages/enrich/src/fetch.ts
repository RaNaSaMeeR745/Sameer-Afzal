const USER_AGENT =
  "ScoutlineBot/0.0.1 (+https://github.com/RaNaSaMeeR745/Sameer-Afzal; polite lead research)";

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_BYTES = 1_500_000;

export interface FetchPageOptions {
  /** Absolute URL to fetch. */
  url: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
  timeoutMs?: number;
  maxBytes?: number;
  /** When true, skip robots.txt check (tests only). */
  skipRobots?: boolean;
}

export interface FetchedPage {
  url: string;
  finalUrl: string;
  statusCode: number;
  html: string;
  contentType: string | null;
  headers: Record<string, string>;
  fetchedAt: string;
  robotsAllowed: boolean;
}

/**
 * Politely fetch a public HTML page.
 * - Sends a clear User-Agent
 * - Respects robots.txt Disallow for the User-agent path when reachable
 * - Caps response size and timeout
 * - Does not follow into private IP ranges (basic SSRF guard)
 */
export async function fetchPage(options: FetchPageOptions): Promise<FetchedPage> {
  const url = normalizeUrl(options.url);
  assertPublicHostname(url);

  const fetchImpl = options.fetchImpl ?? fetch;
  const userAgent = options.userAgent ?? USER_AGENT;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;

  let robotsAllowed = true;
  if (!options.skipRobots) {
    robotsAllowed = await isAllowedByRobots(url, userAgent, fetchImpl);
    if (!robotsAllowed) {
      throw new Error(`Fetch blocked by robots.txt for ${url}`);
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent": userAgent,
      },
    });

    const finalUrl = response.url || url;
    assertPublicHostname(finalUrl);

    const contentType = response.headers.get("content-type");
    const headerMap: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerMap[key.toLowerCase()] = value;
    });

    const buffer = await readLimited(response, maxBytes);
    const html = buffer;

    return {
      url,
      finalUrl,
      statusCode: response.status,
      html,
      contentType,
      headers: headerMap,
      fetchedAt: new Date().toISOString(),
      robotsAllowed,
    };
  } finally {
    clearTimeout(timer);
  }
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("fetchPage requires a non-empty url");
  }
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const parsed = new URL(withScheme);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Unsupported protocol: ${parsed.protocol}`);
  }
  return parsed.toString();
}

function assertPublicHostname(urlString: string): void {
  const { hostname } = new URL(urlString);
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "0.0.0.0" ||
    lower === "::1" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal")
  ) {
    throw new Error(`Refusing to fetch private host: ${hostname}`);
  }
  // Block obvious private IPv4 ranges
  if (/^(10\.|192\.168\.|169\.254\.)/.test(lower)) {
    throw new Error(`Refusing to fetch private IP: ${hostname}`);
  }
  const m = lower.match(/^172\.(\d+)\./);
  if (m) {
    const second = Number(m[1]);
    if (second >= 16 && second <= 31) {
      throw new Error(`Refusing to fetch private IP: ${hostname}`);
    }
  }
}

async function isAllowedByRobots(
  pageUrl: string,
  userAgent: string,
  fetchImpl: typeof fetch,
): Promise<boolean> {
  const parsed = new URL(pageUrl);
  const robotsUrl = `${parsed.origin}/robots.txt`;
  try {
    const res = await fetchImpl(robotsUrl, {
      method: "GET",
      headers: { "User-Agent": userAgent, Accept: "text/plain" },
    });
    if (!res.ok) {
      // Missing robots.txt is treated as allow
      return true;
    }
    const text = await res.text();
    return robotsAllowsPath(text, parsed.pathname || "/", userAgent);
  } catch {
    return true;
  }
}

/**
 * Minimal robots.txt evaluator for User-agent: * and matching UA token.
 * Public for unit tests.
 */
export function robotsAllowsPath(
  robotsTxt: string,
  path: string,
  userAgent: string,
): boolean {
  const lines = robotsTxt.split(/\r?\n/);
  let inRelevant = false;
  const disallows: string[] = [];
  const allows: string[] = [];
  const uaToken = userAgent.split(/[\s/]/)[0]?.toLowerCase() ?? "*";

  for (const raw of lines) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) {
      continue;
    }
    const uaMatch = line.match(/^user-agent:\s*(.+)$/i);
    if (uaMatch) {
      const agent = uaMatch[1].trim().toLowerCase();
      inRelevant = agent === "*" || uaToken.includes(agent) || agent.includes(uaToken);
      continue;
    }
    if (!inRelevant) {
      continue;
    }
    const dis = line.match(/^disallow:\s*(.*)$/i);
    if (dis) {
      disallows.push(dis[1].trim());
      continue;
    }
    const all = line.match(/^allow:\s*(.*)$/i);
    if (all) {
      allows.push(all[1].trim());
    }
  }

  // Empty Disallow means allow all
  for (const rule of allows) {
    if (rule && path.startsWith(rule)) {
      return true;
    }
  }
  for (const rule of disallows) {
    if (rule === "") {
      continue;
    }
    if (path.startsWith(rule)) {
      return false;
    }
  }
  return true;
}

async function readLimited(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    return text.slice(0, maxBytes);
  }
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (!value) {
      continue;
    }
    total += value.byteLength;
    if (total > maxBytes) {
      chunks.push(value.slice(0, Math.max(0, maxBytes - (total - value.byteLength))));
      break;
    }
    chunks.push(value);
  }
  const merged = concatUint8(chunks);
  return new TextDecoder("utf-8", { fatal: false }).decode(merged);
}

function concatUint8(chunks: Uint8Array[]): Uint8Array {
  const len = chunks.reduce((n, c) => n + c.byteLength, 0);
  const out = new Uint8Array(len);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.byteLength;
  }
  return out;
}
