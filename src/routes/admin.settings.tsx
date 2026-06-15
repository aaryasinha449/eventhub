import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "System Settings — EventHub Admin" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">System settings</h1>
        <p className="text-sm text-muted-foreground">Organization-wide configuration.</p>
      </header>

      <section className="glass space-y-5 rounded-2xl p-6">
        <h2 className="font-display text-lg">Organization</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand name" defaultValue="EventHub" />
          <Field label="Support email" defaultValue="hello@eventhub.io" />
          <Field label="Default currency" defaultValue="USD" />
          <Field label="Timezone" defaultValue="America/Los_Angeles" />
        </div>
      </section>

      <section className="glass space-y-5 rounded-2xl p-6">
        <h2 className="font-display text-lg">Payments</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stripe public key" defaultValue="pk_live_•••• (configure)" />
          <Field label="Default fee (%)" defaultValue="2.9" />
        </div>
        <p className="text-xs text-muted-foreground">Secret keys are stored as server-side environment variables.</p>
      </section>

      <section className="glass space-y-5 rounded-2xl p-6">
        <h2 className="font-display text-lg">Email & notifications</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SMTP host" defaultValue="smtp.sendgrid.net" />
          <Field label="From address" defaultValue="no-reply@eventhub.io" />
        </div>
      </section>

      <div className="flex justify-end">
        <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Save settings</button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
    </label>
  );
}
