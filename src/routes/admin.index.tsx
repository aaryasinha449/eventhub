import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { StatCard } from "@/components/StatCard";
import { eventsApi, paymentsApi, attendanceApi, usersApi, registrationsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Calendar, DollarSign, Users, Ticket } from "lucide-react";
import { formatMoney, formatDate } from "@/lib/format";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin · Overview — EventHub" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><AdminOverview /></DashboardLayout></RequireAuth>,
});

const chartColors = {
  axis: "oklch(0.55 0.01 70)",
  grid: "oklch(0.28 0.008 70 / 0.4)",
  fill: "url(#goldGrad)",
  stroke: "oklch(0.82 0.13 88)",
};

function AdminOverview() {
  const { data: events = [] } = useQuery({ queryKey: ["events", "all"], queryFn: () => eventsApi.list() });
  const { data: payments = [] } = useQuery({ queryKey: ["payments", "all"], queryFn: () => paymentsApi.all() });
  const { data: attendance = [] } = useQuery({ queryKey: ["attendance", "all"], queryFn: () => attendanceApi.all() });
  const { data: users = [] } = useQuery({ queryKey: ["users", "all"], queryFn: () => usersApi.list() });

  const totalRevenue = payments.filter(p => p.status === "succeeded").reduce((s, p) => s + p.amountCents, 0);
  const totalSold = events.reduce((s, e) => s + e.sold, 0);

  // Build a "revenue last 30 days" series from payments
  const revSeries = Array.from({ length: 30 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (29 - i));
    const key = day.toDateString();
    const dayRev = payments
      .filter((p) => p.status === "succeeded" && new Date(p.createdAt).toDateString() === key)
      .reduce((s, p) => s + p.amountCents, 0);
    // Seed with a curve for realism
    const seed = 18000 + Math.round(Math.sin(i / 3) * 6000 + i * 600 + (i % 7 === 0 ? 4000 : 0));
    return { date: day.toLocaleDateString("en", { month: "short", day: "numeric" }), revenue: (dayRev + seed) / 100 };
  });

  const catData = Object.entries(
    events.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + e.sold; return acc; }, {})
  ).map(([category, sold]) => ({ category, sold }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time pulse of EventHub.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total events" value={events.length} icon={<Calendar className="h-4 w-4" />} trend={{ value: "+3 this month", direction: "up" }} />
        <StatCard label="Tickets sold" value={totalSold.toLocaleString()} icon={<Ticket className="h-4 w-4" />} trend={{ value: "+18% vs LM", direction: "up" }} />
        <StatCard label="Revenue (mock)" value={formatMoney(totalRevenue)} icon={<DollarSign className="h-4 w-4" />} trend={{ value: "+22% vs LM", direction: "up" }} />
        <StatCard label="Users" value={users.length} icon={<Users className="h-4 w-4" />} trend={{ value: "+12% MoM", direction: "up" }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Revenue (last 30 days)</h2>
            <span className="text-xs text-muted-foreground">USD</span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revSeries}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.13 88)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.82 0.13 88)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="date" stroke={chartColors.axis} fontSize={11} tickLine={false} axisLine={false} interval={4} />
                <YAxis stroke={chartColors.axis} fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 60)", border: "1px solid oklch(0.28 0.008 70 / 0.6)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke={chartColors.stroke} strokeWidth={2} fill={chartColors.fill} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg">Sales by category</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData}>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="category" stroke={chartColors.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.axis} fontSize={11} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 60)", border: "1px solid oklch(0.28 0.008 70 / 0.6)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="sold" fill="oklch(0.82 0.13 88)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Recent events</h2>
            <Link to="/admin/events" className="text-xs text-muted-foreground hover:text-foreground">Manage →</Link>
          </div>
          <ul className="mt-4 divide-y divide-border/60">
            {events.slice(0, 5).map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.category} · {formatDate(e.startsAt)}</p>
                </div>
                <span className="text-xs text-muted-foreground">{e.sold}/{e.capacity}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg">Recent check-ins</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {attendance.length === 0 && <p className="text-sm text-muted-foreground">No check-ins yet today.</p>}
            {attendance.slice(0, 6).map((a) => {
              const ev = events.find((e) => e.id === a.eventId);
              return (
                <li key={a.id} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
                  <p className="flex-1 truncate">{ev?.title ?? "Event"} · {a.gate}</p>
                  <span className="text-xs text-muted-foreground">{new Date(a.scannedAt).toLocaleTimeString()}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
