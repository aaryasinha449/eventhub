import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { registrationsApi, eventsApi } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/dashboard/registrations")({
  head: () => ({ meta: [{ title: "My Registrations — EventHub" }] }),
  component: () => <RequireAuth><DashboardLayout variant="user"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const { user } = useAuth();
  const { data: regs = [] } = useQuery({ queryKey: ["my", "registrations", user!.id], queryFn: () => registrationsApi.mine(user!.id) });
  const { data: events = [] } = useQuery({ queryKey: ["events", "all"], queryFn: () => eventsApi.list() });

  const rows = regs.map((r) => ({ ...r, event: events.find((e) => e.id === r.eventId) }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">My Registrations</h1>
        <p className="text-sm text-muted-foreground">Every event you've registered for.</p>
      </header>

      <div className="glass overflow-hidden rounded-2xl">
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-xl">No registrations yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Find an event you love and grab a ticket.</p>
            <Link to="/events" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse events</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium">{r.event?.title ?? "Event"}</p>
                    <p className="text-xs text-muted-foreground">{r.event?.venue}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{r.event ? formatDateTime(r.event.startsAt) : "—"}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[color:var(--success)]/15 px-2.5 py-0.5 text-xs font-medium text-[color:var(--success)] capitalize">{r.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link to="/dashboard/tickets" className="text-xs text-primary hover:underline">View ticket →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
