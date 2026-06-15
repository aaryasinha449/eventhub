import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EventHub" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("marcus@acme.co");
  const [password, setPassword] = useState("demo-pass");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}`);
      navigate({ to: u.role === "admin" ? "/admin" : "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your EventHub account.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        <button disabled={loading} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
          <Link to="/signup" className="text-primary hover:underline">Create account</Link>
        </div>
      </form>
      <p className="mt-6 rounded-lg border border-border bg-card/60 p-3 text-[11px] text-muted-foreground">
        Demo: <span className="text-foreground">marcus@acme.co</span> (user) or <span className="text-foreground">ava@eventhub.io</span> (admin). Any password works.
      </p>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12" style={{ background: "linear-gradient(160deg, oklch(0.18 0.01 70), oklch(0.10 0.005 60))" }}>
        <Logo />
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-medium leading-tight">"The cleanest ticketing experience our community has ever seen."</h2>
          <p className="mt-6 text-sm text-muted-foreground">— Ava Chen, Director of Events, Aurora Studios</p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} EventHub</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden"><Logo /></div>
          <h1 className="mt-8 font-display text-3xl tracking-tight lg:mt-0">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-primary/60"
      />
    </label>
  );
}

export { AuthShell, Field };
