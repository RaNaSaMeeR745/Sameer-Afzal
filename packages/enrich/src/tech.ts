/** Lightweight technology fingerprinting from HTML and headers. */

export interface TechFingerprint {
  generator: string | null;
  cmsHints: string[];
  analyticsHints: string[];
  hasGoogleAnalytics: boolean;
  hasGoogleTagManager: boolean;
  hasFacebookPixel: boolean;
}

export function fingerprintTech(
  html: string,
  headers?: Record<string, string>,
): TechFingerprint {
  const lower = html.toLowerCase();
  const cmsHints: string[] = [];
  const analyticsHints: string[] = [];

  if (/wp-content|wordpress/i.test(html)) {
    cmsHints.push("wordpress");
  }
  if (/cdn\.shopify\.com|myshopify\.com/i.test(html)) {
    cmsHints.push("shopify");
  }
  if (/wix\.com|wixstatic/i.test(html)) {
    cmsHints.push("wix");
  }
  if (/squarespace/i.test(html)) {
    cmsHints.push("squarespace");
  }
  if (/webflow/i.test(html)) {
    cmsHints.push("webflow");
  }

  const hasGoogleAnalytics =
    /google-analytics\.com|gtag\(|googletagmanager\.com\/gtag/i.test(html);
  const hasGoogleTagManager = /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i.test(
    html,
  );
  const hasFacebookPixel =
    /connect\.facebook\.net\/.*fbevents|fbq\s*\(/i.test(html);

  if (hasGoogleAnalytics) {
    analyticsHints.push("google_analytics");
  }
  if (hasGoogleTagManager) {
    analyticsHints.push("google_tag_manager");
  }
  if (hasFacebookPixel) {
    analyticsHints.push("facebook_pixel");
  }

  let generator: string | null = null;
  const genMatch = html.match(
    /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i,
  );
  if (genMatch?.[1]) {
    generator = genMatch[1].trim();
  } else if (headers?.["x-powered-by"]) {
    generator = headers["x-powered-by"];
  }

  return {
    generator,
    cmsHints: [...new Set(cmsHints)],
    analyticsHints: [...new Set(analyticsHints)],
    hasGoogleAnalytics,
    hasGoogleTagManager,
    hasFacebookPixel,
  };
}
