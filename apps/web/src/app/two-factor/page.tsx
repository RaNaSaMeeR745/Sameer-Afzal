"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await authClient.twoFactor.verifyTotp({
        code,
      });
      if (result.error) {
        setError(result.error.message ?? "Verification failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Two-factor verification</h1>
      <p>Enter the 6-digit code from your authenticator app.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <label>
          Authentication code
          <input
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? "Verifying…" : "Verify"}
        </button>
      </form>
    </main>
  );
}
