import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { AuthShell, Field } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — EventHub" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent — check your inbox.");
    } catch (err) { toast.error((err as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure link to reset.">
      {sent ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="font-display text-lg">Check your email</p>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for <span className="text-foreground">{email}</span>, we sent reset instructions.
          </p>
          <Link to="/login" className="mt-4 inline-block text-sm text-primary hover:underline">← Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <button disabled={loading} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {loading ? "Sending…" : "Send reset link"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Remembered it? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
