import Link from "next/link";
import { PLANS } from "@scoutline/billing";
import { MODES } from "@scoutline/core";

const faq = [
  {
    q: "How is Scoutline different from Apollo or Clay?",
    a: "Apollo and Clay sell contact databases and enrichment workflows. Scoutline finds leads from fresh public signals, verifies gaps with evidence, builds a proof report, and drafts a personalized message matched to the service you sell.",
  },
  {
    q: "What is a credit?",
    a: "One credit equals one fully enriched, scored, evidence-backed lead. Proof reports and message drafts are included in plan quotas.",
  },
  {
    q: "Do you sell the same lists to every agency?",
    a: "No. Leads are signal-based and freshness-classified. Only fresh leads are pushed by default. Contested leads are optional. Served leads are filtered out.",
  },
  {
    q: "Which agency types is Scoutline for?",
    a: "SEO, PPC, web design, Shopify, social, branding, video, PR, WhatsApp automation, and agencies selling AEO or white-label tools.",
  },
] as const;

export default function HomePage() {
  const starter = PLANS.find((p) => p.key === "starter");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Scoutline",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Signal-based lead generation for marketing agencies with evidence, proof reports, and personalized messages.",
        offers: {
          "@type": "Offer",
          price: String(starter?.monthlyPriceUsd ?? 39),
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          padding: "0.85rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <strong style={{ fontSize: "1.1rem" }}>Scoutline</strong>
        <nav style={{ display: "flex", gap: "1rem", fontSize: "0.95rem" }}>
          <Link href="/pricing" style={{ color: "#334155", textDecoration: "none" }}>
            Pricing
          </Link>
          <Link href="/sign-in" style={{ color: "#334155", textDecoration: "none" }}>
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              color: "#fff",
              background: "#0ea5e9",
              textDecoration: "none",
              padding: "0.4rem 0.75rem",
              borderRadius: 8,
            }}
          >
            Start free trial
          </Link>
        </nav>
      </header>

      <main>
        <section
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "3.5rem 1.25rem 2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#0ea5e9",
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              margin: "0 0 0.75rem",
            }}
          >
            Lead generation for marketing agencies
          </p>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", margin: "0 0 1rem", lineHeight: 1.2 }}>
            Find agency clients that nobody else has pitched yet, with the proof already
            built.
          </h1>
          <p style={{ color: "#475569", fontSize: "1.1rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            Scoutline discovers real businesses from public signals, verifies service gaps
            with evidence, scores fit, generates a proof report, and drafts a personalized
            outreach message. Not another shared contact database.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/sign-up"
              style={{
                background: "#0ea5e9",
                color: "#fff",
                textDecoration: "none",
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Start 14-day trial
            </Link>
            <Link
              href="/pricing"
              style={{
                border: "1px solid #cbd5e1",
                color: "#0f172a",
                textDecoration: "none",
                padding: "0.7rem 1.2rem",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              View pricing
            </Link>
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.85rem" }}>
            25 trial credits · no card required · unlimited seats
          </p>
        </section>

        <section
          style={{
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
            padding: "2.5rem 1.25rem",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", marginTop: 0 }}>How it works</h2>
            <ol
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                listStyle: "none",
                padding: 0,
                margin: "1.25rem 0 0",
              }}
            >
              {[
                "Discover from public signals (maps, registries, jobs, ads, search).",
                "Enrich and audit the site for gaps matched to your service.",
                "Score need, timing, budget, reach, and fit with evidence links.",
                "Deliver a proof report and a 3-step personalized message.",
              ].map((step, i) => (
                <li
                  key={step}
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "1rem",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0ea5e9", marginBottom: "0.35rem" }}>
                    {i + 1}
                  </div>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
          <h2 style={{ marginTop: 0 }}>Modes built for agencies</h2>
          <p style={{ color: "#475569" }}>
            Target local businesses, ecommerce brands, B2B companies, hiring teams, or
            other agencies across {MODES.length} modes.
          </p>
          <ul style={{ lineHeight: 1.7 }}>
            {MODES.map((m) => (
              <li key={m.key}>
                <strong>{m.label}</strong> ({m.type}): {m.whoItFinds}
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            padding: "2.5rem 1.25rem",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ marginTop: 0 }}>Frequently asked questions</h2>
            {faq.map((item) => (
              <details
                key={item.q}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "0.85rem 1rem",
                  marginBottom: "0.6rem",
                }}
              >
                <summary style={{ fontWeight: 600, cursor: "pointer" }}>{item.q}</summary>
                <p style={{ margin: "0.6rem 0 0", color: "#475569", lineHeight: 1.55 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <footer
          style={{
            padding: "1.5rem 1.25rem",
            borderTop: "1px solid #e2e8f0",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.85rem",
          }}
        >
          <Link href="/pricing" style={{ color: "#64748b" }}>
            Pricing
          </Link>
          {" · "}
          <Link href="/sign-up" style={{ color: "#64748b" }}>
            Trial
          </Link>
          {" · "}
          Scoutline {new Date().getFullYear()}
        </footer>
      </main>
    </>
  );
}
