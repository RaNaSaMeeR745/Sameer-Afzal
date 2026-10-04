import Link from "next/link";
import { PLANS } from "@scoutline/billing";

export default function DashboardOverviewPage() {
  const trial = PLANS.find((p) => p.key === "trial");

  return (
    <main>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>Overview</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Find agency clients that nobody else has pitched yet, with the proof already
        built.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          marginTop: "1.5rem",
        }}
      >
        <StatCard label="Ready leads" value="0" hint="Above your score threshold" />
        <StatCard
          label="Credits"
          value={String(trial?.creditsPerMonth ?? 25)}
          hint="Trial grant when workspace is created"
        />
        <StatCard label="Active searches" value="0" hint="Saved discovery configs" />
      </section>

      <section
        style={{
          marginTop: "1.75rem",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <h2 style={{ fontSize: "1.05rem", margin: "0 0 0.75rem" }}>Get started</h2>
        <ol style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.7 }}>
          <li>
            <Link href="/dashboard/searches">Create a search</Link> with mode,
            geography, and service.
          </li>
          <li>
            Pipeline runs discover, enrich, audit, score, prove, and message jobs.
          </li>
          <li>
            Review <Link href="/dashboard/leads">leads</Link> with evidence and proof
            reports.
          </li>
          <li>
            Upgrade under <Link href="/dashboard/billing">Billing</Link> when you need
            more credits.
          </li>
        </ol>
      </section>
    </main>
  );
}

function StatCard(props: { label: string; value: string; hint: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "1rem",
      }}
    >
      <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase" }}>
        {props.label}
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.25rem 0" }}>
        {props.value}
      </div>
      <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{props.hint}</div>
    </div>
  );
}
