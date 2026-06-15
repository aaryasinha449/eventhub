import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { StatCard } from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { registrationsApi, ticketsApi, paymentsApi, notificationsApi, eventsApi } from "@/lib/api";
import { Ticket, Calendar, DollarSign, Bell, ArrowRight } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/format";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — EventHub" }] }),
  component: () => <RequireAuth><DashboardLayout variant="user"><Dashboard /></DashboardLayout></RequireAuth>,
});

function Dashboard() {
  const { user } = useAuth();
  const uid = user!.id;
  const { data: regs = [] } = useQuery({ queryKey: ["my", "registrations", uid], queryFn: () => registrationsApi.mine(uid) });
  const { data: tickets = [] } = useQuery({ queryKey: ["my", "tickets", uid], queryFn: () => ticketsApi.mine(uid) });
  const { data: payments = [] } = useQuery({ queryKey: ["my", "payments", uid], queryFn: () => paymentsApi.mine(uid) });
  const { data: notifs = [] } = useQuery({ queryKey: ["my", "notifications", uid], queryFn: () => notificationsApi.mine(uid) });
  const { data: events = [] } = useQuery({ queryKey: ["events", "upcoming"], queryFn: () => eventsApi.list({ sort: "soonest" }) });

  const totalSpent = payments.filter((p) => p.status === "succeeded").reduce((s, p) => s + p.amountCents, 0);
  const upcoming = events.filter((e) => regs.some((r) => r.eventId === e.id)).slice(0, 3);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="font-display text-3xl tracking-tight">{user!.name}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registrations" value={regs.length} icon={<Calendar className="h-4 w-4" />} />
        <StatCard label="Active tickets" value={tickets.filter(t => !t.checkedIn).length} icon={<Ticket className="h-4 w-4" />} />
        <StatCard label="Total spent" value={formatMoney(totalSpent)} icon={<DollarSign className="h-4 w-4" />} />
        <StatCard label="Unread alerts" value={notifs.filter(n => !n.read).length} icon={<Bell className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Upcoming events</h2>
            <Link to="/dashboard/registrations" className="text-xs text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">You haven't registered for any events yet.</p>
              <Link to="/events" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">Browse events <ArrowRight className="h-3 w-3" /></Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border/60">
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(e.startsAt)} · {e.venue}</p>
                  </div>
                  <Link to="/events/$slug" params={{ slug: e.slug }} className="text-xs text-primary hover:underline">Details</Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg">Activity</h2>
          <ul className="mt-4 space-y-3">
            {notifs.slice(0, 5).map((n) => (
              <li key={n.id} className="flex items-start gap-3 text-sm">
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${n.read ? "bg-border" : "bg-primary animate-pulse"}`} />
                <div className="min-w-0">
                  <p className="font-medium truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                </div>
              </li>
            ))}
            {notifs.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}
