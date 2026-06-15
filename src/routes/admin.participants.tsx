import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useQuery } from "@tanstack/react-query";
import { eventsApi, registrationsApi, usersApi } from "@/lib/api";
import { useState } from "react";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/participants")({
  head: () => ({ meta: [{ title: "Participants — EventHub Admin" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const { data: events = [] } = useQuery({ queryKey: ["events", "all"], queryFn: () => eventsApi.list() });
  const { data: users = [] } = useQuery({ queryKey: ["users", "all"], queryFn: () => usersApi.list() });
  const [eventId, setEventId] = useState<string>("");

  const { data: regs = [] } = useQuery({
    queryKey: ["regs", eventId],
    queryFn: () => eventId ? registrationsApi.byEvent(eventId) : Promise.resolve([]),
    enabled: !!eventId,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Participants</h1>
        <p className="text-sm text-muted-foreground">Pick an event to see registered attendees.</p>
      </header>

      <div className="glass rounded-2xl p-4">
        <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <option value="">Select an event…</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        {!eventId ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Pick an event above to load participants.</div>
        ) : regs.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No participants yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {regs.map((r) => {
                const u = users.find((x) => x.id === r.userId);
                return (
                  <tr key={r.id}>
                    <td className="px-5 py-4 font-medium">{u?.name ?? r.userId}</td>
                    <td className="px-5 py-4 text-muted-foreground">{u?.email ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[color:var(--success)]/15 px-2 py-0.5 text-xs capitalize text-[color:var(--success)]">{r.status}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{formatDate(r.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
