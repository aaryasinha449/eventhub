import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — EventHub" }] }),
  component: () => <RequireAuth><DashboardLayout variant="user"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences for your account.</p>
      </header>

      <section className="glass divide-y divide-border/60 rounded-2xl">
        <Toggle label="Email updates" desc="Order confirmations, ticket issues, and event reminders." value={emailUpdates} onChange={setEmailUpdates} />
        <Toggle label="SMS reminders" desc="Get a text 1 hour before each event." value={smsReminders} onChange={setSmsReminders} />
        <Toggle label="Product newsletter" desc="Occasional updates about new features." value={marketing} onChange={setMarketing} />
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Permanently delete your account and all associated tickets.</p>
        <button
          onClick={() => toast.error("Account deletion requires confirmation via email.")}
          className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-semibold text-[color:var(--destructive)] hover:bg-destructive/20"
        >
          Delete account
        </button>
      </section>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between p-5">
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-primary" : "bg-secondary"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}
