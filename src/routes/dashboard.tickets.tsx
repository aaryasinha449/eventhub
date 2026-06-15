import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { ticketsApi, eventsApi } from "@/lib/api";
import { QRTicket } from "@/components/QRTicket";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/dashboard/tickets")({
  head: () => ({ meta: [{ title: "My Tickets — EventHub" }] }),
  component: () => <RequireAuth><DashboardLayout variant="user"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const { user } = useAuth();
  const { data: tickets = [] } = useQuery({ queryKey: ["my", "tickets", user!.id], queryFn: () => ticketsApi.mine(user!.id) });
  const { data: events = [] } = useQuery({ queryKey: ["events", "all"], queryFn: () => eventsApi.list() });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">My Tickets</h1>
        <p className="text-sm text-muted-foreground">QR-coded entries for upcoming events.</p>
      </header>

      {tickets.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="font-display text-xl">No tickets yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Once you register for an event, your ticket will appear here.</p>
          <Link to="/events" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Browse events</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {tickets.map((t) => {
            const e = events.find((x) => x.id === t.eventId);
            return (
              <div key={t.id} className="space-y-3">
                <QRTicket
                  payload={t.qrPayload}
                  code={t.code}
                  eventTitle={e?.title ?? "Event"}
                  attendeeName={user!.name}
                  venue={e?.venue ?? ""}
                  when={e ? formatDateTime(e.startsAt) : ""}
                />
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className={t.checkedIn ? "text-[color:var(--success)]" : "text-muted-foreground"}>
                    {t.checkedIn ? "✓ Checked in" : "Not yet scanned"}
                  </span>
                  <button onClick={() => window.print()} className="text-primary hover:underline">Download / print</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
