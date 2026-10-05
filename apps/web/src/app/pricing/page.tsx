import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@scoutline/billing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Scoutline pricing for marketing agencies. Flat per workspace, unlimited seats. Trial, Starter, Growth, and Agency plans with credits for evidence-backed leads.",
};

const bestFor: Record<string, string> = {
  trial: "Best for evaluating the pipeline on real searches",
  starter: "Best for solo operators and small shops",
  growth: "Best for growing agencies using all modes",
  agency: "Best for multi-brand agencies needing API and exclusivity",
};

export default function PricingPage() {
  return (
    <>
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          padding: "0.85rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#0f172a" }}>
          Scoutline
        </Link>
        <Link href="/sign-up" style={{ color: "#0ea5e9", textDecoration: "none" }}>
          Start free trial
        </Link>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <h1 style={{ marginTop: 0 }}>Pricing</h1>
        <p style={{ color: "#475569", maxWidth: 560 }}>
          Flat per workspace, unlimited seats. One credit equals one fully enriched,
          scored, evidence-backed lead. Annual billing includes two months free when
          checkout is enabled.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.85rem",
            marginTop: "1.5rem",
          }}
        >
          {PLANS.map((plan) => (
            <article
              key={plan.key}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "1.15rem",
                background: plan.key === "growth" ? "#f0f9ff" : "#fff",
              }}
            >
              <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem" }}>{plan.label}</h2>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#0ea5e9", fontWeight: 600 }}>
                {bestFor[plan.key]}
              </p>
              <p style={{ margin: "0.6rem 0", fontSize: "1.6rem", fontWeight: 700 }}>
                {plan.monthlyPriceUsd === 0 ? "Free" : `$${plan.monthlyPriceUsd}`}
                {plan.monthlyPriceUsd > 0 ? (
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>
                    /mo
                  </span>
                ) : null}
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 0.75rem" }}>
                {plan.creditsPerMonth.toLocaleString()} credits
                {plan.modeLimit === "all" ? " · all modes" : ` · ${plan.modeLimit} modes`}
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.88rem", lineHeight: 1.55 }}>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section style={{ marginTop: "2.5rem" }}>
          <h2>FAQ</h2>
          <details style={{ marginBottom: "0.5rem" }}>
            <summary style={{ fontWeight: 600 }}>Is there a free trial?</summary>
            <p style={{ color: "#475569" }}>
              Yes. 14 days and 25 credits with no card required.
            </p>
          </details>
          <details style={{ marginBottom: "0.5rem" }}>
            <summary style={{ fontWeight: 600 }}>What counts as a credit?</summary>
            <p style={{ color: "#475569" }}>
              One fully enriched, scored, evidence-backed lead delivered to your
              workspace.
            </p>
          </details>
        </section>
      </main>
    </>
  );
}
