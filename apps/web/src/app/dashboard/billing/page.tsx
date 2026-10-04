import { PLANS } from "@scoutline/billing";

export default function BillingPage() {
  return (
    <main>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>Billing</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Flat per workspace, unlimited seats. One credit equals one fully enriched,
        scored, evidence-backed lead.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.75rem",
          marginTop: "1.25rem",
        }}
      >
        {PLANS.map((plan) => (
          <article
            key={plan.key}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "1.1rem",
            }}
          >
            <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.05rem" }}>{plan.label}</h2>
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
              {plan.monthlyPriceUsd === 0 ? "Free" : `$${plan.monthlyPriceUsd}`}
              {plan.monthlyPriceUsd > 0 ? (
                <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#64748b" }}>
                  /mo
                </span>
              ) : null}
            </p>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
              {plan.creditsPerMonth.toLocaleString()} credits
              {plan.modeLimit === "all" ? " · all modes" : ` · ${plan.modeLimit} modes`}
            </p>
            <ul
              style={{
                margin: "0.75rem 0 0",
                paddingLeft: "1.1rem",
                fontSize: "0.85rem",
                lineHeight: 1.5,
              }}
            >
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p style={{ marginTop: "1.25rem", color: "#64748b", fontSize: "0.9rem" }}>
        Checkout uses Paddle. Webhook signature verification is implemented in{" "}
        @scoutline/billing; the notification HTTP route will complete in the public API
        phase.
      </p>
    </main>
  );
}
