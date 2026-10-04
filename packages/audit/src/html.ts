/** Lightweight HTML helpers for audit checks. No DOM dependency. */

export function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) {
    return null;
  }
  return decodeBasicEntities(match[1].replace(/\s+/g, " ").trim());
}

export function extractMetaContent(
  html: string,
  nameOrProperty: string,
): string | null {
  const nameRe = new RegExp(
    `<meta[^>]+(?:name|property)=["']${escapeRegExp(nameOrProperty)}["'][^>]+content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${escapeRegExp(nameOrProperty)}["'][^>]*>`,
    "i",
  );
  const a = html.match(nameRe)?.[1] ?? html.match(contentFirst)?.[1];
  return a ? decodeBasicEntities(a.trim()) : null;
}

export function hasCanonical(html: string): boolean {
  return /<link[^>]+rel=["']canonical["'][^>]*>/i.test(html);
}

export function hasViewport(html: string): boolean {
  return /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
}

export function extractH1Texts(html: string): string[] {
  const results: string[] = [];
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = decodeBasicEntities(
      m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    );
    if (text) {
      results.push(text);
    }
  }
  return results;
}

export function hasJsonLd(html: string): boolean {
  return /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(html);
}

export function hasFaqSchema(html: string): boolean {
  return /"@type"\s*:\s*"FAQPage"/i.test(html);
}

export function robotsMetaContent(html: string): string | null {
  return extractMetaContent(html, "robots");
}

export function isHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'");
}
