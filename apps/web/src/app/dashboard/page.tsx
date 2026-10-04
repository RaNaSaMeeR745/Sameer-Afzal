import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Dashboard</h1>
      <p>Signed in as {session.user.email}</p>
      <p>Name: {session.user.name}</p>
    </main>
  );
}
