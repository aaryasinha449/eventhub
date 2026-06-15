import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { StatCard } from "@/components/StatCard";
import { paymentsApi, eventsApi, usersApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { formatMoney, formatDate } from "@/lib/format";
import { DollarSign, CreditCard, RefreshCcw, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/revenue")({
  head: () => ({ meta: [{ title: "Revenue — EventHub Admin" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const { data: payments = [] } = useQuery({ queryKey: ["payments", "all"], queryFn: () => paymentsApi.all() });
  const { data: events = [] } = useQuery({ queryKey: ["events", "all"], queryFn: () => eventsApi.list() });
  const { data: users = [] } = useQuery({ queryKey: ["users", "all"], queryFn: () => usersApi.list() });

  const succeeded = payments.filter((p) => p.status === "succeeded");
  const total = succeeded.reduce((s, p) => s + p.amountCents, 0);
  const refunded = payments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amountCents, 0);
  const avg = succeeded.length ? total / succeeded.length : 0;

  const series = Array.from({ length: 12 }).map((_, i) => {
    const seed = 8500 + Math.round(Math.sin(i / 1.5) * 2400 + i * 950);
    const month = new Date(); month.setMonth(month.getMonth() - (11 - i));
    return { month: month.toLocaleDateString("en", { month: "short" }), revenue: seed };
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Revenue analytics</h1>
        <p className="text-sm text-muted-foreground">Performance across all events.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatMoney(total)} icon={<DollarSign className="h-4 w-4" />} trend={{ value: "+22% YoY", direction: "up" }} />
        <StatCard label="Avg. order" value={formatMoney(avg)} icon={<CreditCard className="h-4 w-4" />} trend={{ value: "+4%", direction: "up" }} />
        <StatCard label="Refunded" value={formatMoney(refunded)} icon={<RefreshCcw className="h-4 w-4" />} trend={{ value: "0.8% rate", direction: "flat" }} />
        <StatCard label="Conversion" value="38.4%" icon={<TrendingUp className="h-4 w-4" />} trend={{ value: "+3.1pp", direction: "up" }} />
      </div>

      <section className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg">Revenue, last 12 months</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="goldGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.13 88)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.82 0.13 88)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.28 0.008 70 / 0.4)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.55 0.01 70)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.55 0.01 70)" fontSize={11} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.006 60)", border: "1px solid oklch(0.28 0.008 70 / 0.6)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.82 0.13 88)" strokeWidth={2} fill="url(#goldGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <h2 className="font-display text-lg">Recent transactions</h2>
          <span className="text-xs text-muted-foreground">{payments.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {payments.slice(0, 12).map((p) => {
              const u = users.find((x) => x.id === p.userId);
              const e = events.find((x) => x.id === p.eventId);
              return (
                <tr key={p.id}>
                  <td className="px-6 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-3">{u?.name ?? "—"}</td>
                  <td className="px-6 py-3 text-muted-foreground">{e?.title ?? "—"}</td>
                  <td className="px-6 py-3 font-medium">{formatMoney(p.amountCents, p.currency)}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                      p.status === "succeeded" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                      : p.status === "refunded" ? "bg-warning/15 text-[color:var(--warning)]"
                      : "bg-destructive/15 text-[color:var(--destructive)]"
                    }`}>{p.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
