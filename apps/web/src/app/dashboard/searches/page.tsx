import { MODES, SERVICES } from "@scoutline/core";

export default function SearchesPage() {
  return (
    <main>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>Searches</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Saved discovery configs (mode, geography, niche, service). Each run queues
        discover jobs against verified sources.
      </p>

      <section
        style={{
          marginTop: "1.25rem",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <h2 style={{ fontSize: "1rem", margin: "0 0 0.75rem" }}>Available modes</h2>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.6 }}>
          {MODES.map((m) => (
            <li key={m.key}>
              <strong>{m.label}</strong> ({m.leadType}) — {m.description}
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          marginTop: "1rem",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <h2 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>
          Service catalog ({SERVICES.length})
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: 0 }}>
          Searches target one service key so audit findings and messages stay matched
          to what you sell.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginTop: "0.75rem",
          }}
        >
          {SERVICES.slice(0, 24).map((s) => (
            <span
              key={s.key}
              style={{
                fontSize: "0.75rem",
                background: "#f1f5f9",
                borderRadius: 6,
                padding: "0.2rem 0.45rem",
              }}
            >
              {s.label}
            </span>
          ))}
          {SERVICES.length > 24 ? (
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              +{SERVICES.length - 24} more
            </span>
          ) : null}
        </div>
      </section>

      <p style={{ marginTop: "1.25rem", color: "#64748b", fontSize: "0.9rem" }}>
        Search create form and job enqueue will attach here once tenant_searches writes
        are wired to the worker queues.
      </p>
    </main>
  );
}
