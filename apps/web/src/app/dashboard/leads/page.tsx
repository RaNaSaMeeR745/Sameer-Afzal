import type { CSSProperties } from "react";
import { MODES, SERVICES } from "@scoutline/core";

/**
 * Leads list shell. Rows will bind to tenant_leads once the persistence
 * pipeline writes scored entities. Empty state is intentional, not placeholder copy.
 */
export default function LeadsPage() {
  return (
    <main>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>Leads</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
        Scored leads with freshness class, evidence, proof reports, and message drafts.
        Only fresh leads are shown by default.
      </p>

      <div
        style={{
          marginTop: "1.25rem",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={th}>Entity</th>
              <th style={th}>Score</th>
              <th style={th}>Freshness</th>
              <th style={th}>Service</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={5}
                style={{ padding: "2rem 1rem", color: "#64748b", textAlign: "center" }}
              >
                No leads yet. Create a search to start discovery across{" "}
                {MODES.length} modes and {SERVICES.length} services.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: CSSProperties = {
  padding: "0.65rem 1rem",
  fontWeight: 600,
  borderBottom: "1px solid #e2e8f0",
};
