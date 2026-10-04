/** Extract public contact hints from HTML. Business contacts only. */

export interface ExtractedContact {
  email: string | null;
  phone: string | null;
  role: string | null;
  source: "mailto" | "tel" | "text";
}

const EMAIL_RE =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const ROLE_LOCAL_PARTS = new Set([
  "info",
  "contact",
  "hello",
  "support",
  "sales",
  "admin",
  "office",
  "team",
  "enquiries",
  "inquiry",
  "bookings",
  "booking",
]);

/**
 * Extract public emails and tel links from HTML.
 * Prefers role-based local parts typical of business contact pages.
 * Does not claim verification; callers run verification separately.
 */
export function extractContacts(html: string): ExtractedContact[] {
  const results: ExtractedContact[] = [];
  const seen = new Set<string>();

  const mailtoRe = /mailto:([^"'?\s>]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = mailtoRe.exec(html)) !== null) {
    const email = decodeURIComponent(m[1]).trim().toLowerCase();
    if (!EMAIL_RE.test(email) || seen.has(email)) {
      EMAIL_RE.lastIndex = 0;
      continue;
    }
    EMAIL_RE.lastIndex = 0;
    seen.add(email);
    results.push({
      email,
      phone: null,
      role: roleFromLocal(email),
      source: "mailto",
    });
  }

  const telRe = /tel:([^"'\s>]+)/gi;
  while ((m = telRe.exec(html)) !== null) {
    const phone = decodeURIComponent(m[1]).trim();
    if (!phone || seen.has(`tel:${phone}`)) {
      continue;
    }
    seen.add(`tel:${phone}`);
    results.push({
      email: null,
      phone,
      role: null,
      source: "tel",
    });
  }

  // Text emails only if few mailto found
  if (results.filter((c) => c.email).length < 3) {
    const textEmails = html.match(EMAIL_RE) ?? [];
    for (const raw of textEmails) {
      const email = raw.toLowerCase();
      if (seen.has(email)) {
        continue;
      }
      // Skip common asset false positives
      if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(email)) {
        continue;
      }
      seen.add(email);
      results.push({
        email,
        phone: null,
        role: roleFromLocal(email),
        source: "text",
      });
      if (results.filter((c) => c.email).length >= 5) {
        break;
      }
    }
  }

  return results;
}

function roleFromLocal(email: string): string | null {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (ROLE_LOCAL_PARTS.has(local)) {
    return local;
  }
  return null;
}
