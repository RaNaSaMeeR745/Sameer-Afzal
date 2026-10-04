import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/searches", label: "Searches" },
  { href: "/dashboard/billing", label: "Billing" },
] as const;

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link
            href="/dashboard"
            style={{ fontWeight: 700, textDecoration: "none", color: "#0f172a" }}
          >
            Scoutline
          </Link>
          <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "#334155",
                  fontSize: "0.95rem",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
          {session.user.email}
        </div>
      </header>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1.25rem" }}>
        {children}
      </div>
    </div>
  );
}
