import { z } from "zod";
import type { ModeKey } from "./modes.js";

/** Service catalog keys: what the tenant sells. */
export const ServiceKeySchema = z.enum([
  "seo",
  "technical_seo",
  "local_seo",
  "aeo_geo",
  "content_marketing",
  "copywriting",
  "blog_article_production",
  "paid_search",
  "paid_social",
  "tiktok_ads",
  "youtube_video_ads",
  "social_media_management",
  "influencer_ugc",
  "email_marketing",
  "sms_whatsapp_marketing",
  "marketing_automation_crm",
  "whatsapp_bots_crm",
  "web_design",
  "web_development",
  "shopify_ecommerce_development",
  "conversion_rate_optimization",
  "analytics_tracking",
  "branding_logo_design",
  "graphic_design",
  "video_production",
  "photography",
  "pr_digital_pr",
  "online_reputation_review_management",
  "marketplace_management",
  "app_development",
  "ai_automation_chatbots",
  "outbound_lead_generation",
  "event_webinar_marketing",
]);
export type ServiceKey = z.infer<typeof ServiceKeySchema>;

export interface ServiceDefinition {
  readonly key: ServiceKey;
  readonly label: string;
  /** Modes where this service commonly applies. */
  readonly applicableModes: readonly ModeKey[];
  /** Detectable problems that map to this service (evidence rules). */
  readonly detectableProblems: readonly string[];
}

export const SERVICES: readonly ServiceDefinition[] = [
  {
    key: "seo",
    label: "SEO",
    applicableModes: ["local_business", "ecommerce_brand", "b2b_company", "agency"],
    detectableProblems: [
      "Missing or duplicate titles and meta",
      "No schema",
      "Thin content",
      "No FAQ or answer blocks",
    ],
  },
  {
    key: "technical_seo",
    label: "Technical SEO",
    applicableModes: ["ecommerce_brand", "b2b_company", "agency"],
    detectableProblems: [
      "Failing Core Web Vitals",
      "No HTTPS",
      "Blocked crawlers",
      "Broken canonicals",
    ],
  },
  {
    key: "local_seo",
    label: "Local SEO",
    applicableModes: ["local_business"],
    detectableProblems: [
      "Weak or missing website",
      "No Google Business optimization signals",
      "Inconsistent NAP",
      "Review problems",
    ],
  },
  {
    key: "aeo_geo",
    label: "AEO and GEO (AI search visibility)",
    applicableModes: ["b2b_company", "agency", "ecommerce_brand"],
    detectableProblems: [
      "No schema",
      "No llms.txt",
      "Blocked AI crawlers in robots.txt",
      "Not cited in AI answers for category queries",
      "No FAQ or answer blocks",
    ],
  },
  {
    key: "content_marketing",
    label: "Content marketing",
    applicableModes: ["b2b_company", "ecommerce_brand", "agency"],
    detectableProblems: ["Thin content", "No blog", "No topical authority pages"],
  },
  {
    key: "copywriting",
    label: "Copywriting",
    applicableModes: ["local_business", "ecommerce_brand", "b2b_company"],
    detectableProblems: ["Weak product pages", "Unclear value proposition", "No clear call to action"],
  },
  {
    key: "blog_article_production",
    label: "Blog and article production",
    applicableModes: ["b2b_company", "agency"],
    detectableProblems: ["No blog", "Thin content", "Irregular publishing signals"],
  },
  {
    key: "paid_search",
    label: "Paid search",
    applicableModes: ["ecommerce_brand", "b2b_company", "local_business"],
    detectableProblems: [
      "Ads running with no pixel",
      "Ads sending traffic to slow or broken pages",
      "Ads with no tracking parameters",
    ],
  },
  {
    key: "paid_social",
    label: "Paid social",
    applicableModes: ["ecommerce_brand", "b2b_company", "local_business"],
    detectableProblems: [
      "Ads running with no pixel",
      "One creative running 60 or more days",
      "Ads with no tracking parameters",
    ],
  },
  {
    key: "tiktok_ads",
    label: "TikTok ads",
    applicableModes: ["ecommerce_brand", "local_business"],
    detectableProblems: ["Ads running with no pixel", "No tracking parameters"],
  },
  {
    key: "youtube_video_ads",
    label: "YouTube and video ads",
    applicableModes: ["ecommerce_brand", "b2b_company"],
    detectableProblems: ["Ads running with no pixel", "No tracking parameters"],
  },
  {
    key: "social_media_management",
    label: "Social media management",
    applicableModes: ["local_business", "ecommerce_brand", "agency"],
    detectableProblems: ["Inactive social profiles", "Inconsistent brand presence"],
  },
  {
    key: "influencer_ugc",
    label: "Influencer and UGC",
    applicableModes: ["ecommerce_brand"],
    detectableProblems: ["No UGC or review widgets", "Weak social proof"],
  },
  {
    key: "email_marketing",
    label: "Email marketing",
    applicableModes: ["ecommerce_brand", "b2b_company", "local_business"],
    detectableProblems: ["No email capture", "No abandoned cart flow"],
  },
  {
    key: "sms_whatsapp_marketing",
    label: "SMS and WhatsApp marketing",
    applicableModes: ["local_business", "ecommerce_brand", "agency"],
    detectableProblems: [
      "Contact via phone only",
      "No chat channel",
      "Large volume of inbound messages visible publicly",
    ],
  },
  {
    key: "marketing_automation_crm",
    label: "Marketing automation and CRM",
    applicableModes: ["b2b_company", "agency", "ecommerce_brand"],
    detectableProblems: ["No CRM signals", "No automation flows", "Phone-only contact"],
  },
  {
    key: "whatsapp_bots_crm",
    label: "WhatsApp bots and CRM",
    applicableModes: ["local_business", "agency", "ecommerce_brand"],
    detectableProblems: [
      "No WhatsApp or chat",
      "Agency in a WhatsApp-heavy region",
      "No CRM or WhatsApp offer",
    ],
  },
  {
    key: "web_design",
    label: "Web design",
    applicableModes: ["local_business", "b2b_company", "ecommerce_brand"],
    detectableProblems: [
      "Not mobile responsive",
      "Outdated builder",
      "No clear call to action",
      "Inconsistent or dated visual identity",
    ],
  },
  {
    key: "web_development",
    label: "Web development",
    applicableModes: ["b2b_company", "ecommerce_brand", "local_business"],
    detectableProblems: [
      "Failing Core Web Vitals",
      "No HTTPS",
      "Broken pages",
      "Outdated stack",
    ],
  },
  {
    key: "shopify_ecommerce_development",
    label: "Shopify and e-commerce development",
    applicableModes: ["ecommerce_brand"],
    detectableProblems: [
      "Weak product pages",
      "No reviews widget",
      "No abandoned cart flow",
      "No email capture",
    ],
  },
  {
    key: "conversion_rate_optimization",
    label: "Conversion rate optimization",
    applicableModes: ["ecommerce_brand", "b2b_company", "local_business"],
    detectableProblems: [
      "No clear call to action",
      "Slow mobile pages",
      "Weak product pages",
      "No A/B testing signals",
    ],
  },
  {
    key: "analytics_tracking",
    label: "Analytics and tracking (GA4, server-side, CAPI)",
    applicableModes: ["ecommerce_brand", "b2b_company", "local_business", "agency"],
    detectableProblems: [
      "No GA4",
      "No tag manager",
      "Pixel present but no purchase event",
      "No server-side setup",
    ],
  },
  {
    key: "branding_logo_design",
    label: "Branding and logo design",
    applicableModes: ["local_business", "b2b_company", "ecommerce_brand"],
    detectableProblems: [
      "Inconsistent or dated visual identity",
      "Missing logo variants",
      "Poor social profile assets",
    ],
  },
  {
    key: "graphic_design",
    label: "Graphic design",
    applicableModes: ["local_business", "ecommerce_brand", "agency"],
    detectableProblems: ["Poor social profile assets", "Inconsistent visual identity"],
  },
  {
    key: "video_production",
    label: "Video production",
    applicableModes: ["ecommerce_brand", "b2b_company", "local_business"],
    detectableProblems: ["No product or brand video", "Weak media assets"],
  },
  {
    key: "photography",
    label: "Photography",
    applicableModes: ["local_business", "ecommerce_brand"],
    detectableProblems: ["Weak product or venue imagery", "Stock-only visuals"],
  },
  {
    key: "pr_digital_pr",
    label: "PR and digital PR",
    applicableModes: ["b2b_company", "agency"],
    detectableProblems: ["No press presence", "Low authority mentions"],
  },
  {
    key: "online_reputation_review_management",
    label: "Online reputation and review management",
    applicableModes: ["local_business", "ecommerce_brand"],
    detectableProblems: ["Rating drop", "Unanswered reviews", "Review problems"],
  },
  {
    key: "marketplace_management",
    label: "Marketplace management (Amazon, Daraz, Etsy)",
    applicableModes: ["ecommerce_brand"],
    detectableProblems: ["Weak marketplace listings", "No review management on marketplaces"],
  },
  {
    key: "app_development",
    label: "App development",
    applicableModes: ["b2b_company", "ecommerce_brand"],
    detectableProblems: ["No mobile app where expected", "Broken app store presence"],
  },
  {
    key: "ai_automation_chatbots",
    label: "AI automation and chatbots",
    applicableModes: ["b2b_company", "agency", "local_business", "ecommerce_brand"],
    detectableProblems: [
      "No chat channel",
      "Phone-only contact",
      "No automation or bot signals",
    ],
  },
  {
    key: "outbound_lead_generation",
    label: "Outbound lead generation",
    applicableModes: ["agency", "b2b_company"],
    detectableProblems: ["Agency with no outbound offer", "Hiring for SDR or lead gen roles"],
  },
  {
    key: "event_webinar_marketing",
    label: "Event and webinar marketing",
    applicableModes: ["b2b_company", "agency"],
    detectableProblems: ["No event or webinar funnel", "Hiring for event marketing"],
  },
] as const;

const SERVICE_BY_KEY: ReadonlyMap<ServiceKey, ServiceDefinition> = new Map(
  SERVICES.map((s) => [s.key, s]),
);

export function getService(key: ServiceKey): ServiceDefinition {
  const service = SERVICE_BY_KEY.get(key);
  if (!service) {
    throw new Error(`Unknown service key: ${key}`);
  }
  return service;
}

export function servicesForMode(mode: ModeKey): readonly ServiceDefinition[] {
  return SERVICES.filter((s) => s.applicableModes.includes(mode));
}

export function isValidServiceKey(value: string): value is ServiceKey {
  return ServiceKeySchema.safeParse(value).success;
}
