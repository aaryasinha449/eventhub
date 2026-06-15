import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — EventHub" }] }),
  component: () => <RequireAuth><DashboardLayout variant="user"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [saving, setSaving] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, email });
      toast.success("Profile updated.");
    } catch (err) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">How others see you on EventHub.</p>
      </header>
      <form onSubmit={onSave} className="glass space-y-4 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full text-xl font-semibold text-[color:var(--primary-foreground)]" style={{ background: "var(--gradient-gold)" }}>
            {user!.name[0]}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Role</p>
            <p className="text-sm font-medium capitalize">{user!.role}</p>
          </div>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/60" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/60" />
        </label>
        <button disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
