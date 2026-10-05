import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Liveness probe for the web app and public API surface. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "scoutline-web",
    time: new Date().toISOString(),
  });
}
