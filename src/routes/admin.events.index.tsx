import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/events/")({
  head: () => ({ meta: [{ title: "Admin · Events — EventHub" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const qc = useQueryClient();
  const { data: events = [] } = useQuery({ queryKey: ["events", "all"], queryFn: () => eventsApi.list() });

  const del = useMutation({
    mutationFn: (id: string) => eventsApi.remove(id),
    onSuccess: () => { toast.success("Event removed"); qc.invalidateQueries({ queryKey: ["events"] }); },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Manage events</h1>
          <p className="text-sm text-muted-foreground">{events.length} events total</p>
        </div>
        <Link to="/admin/events/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <PlusCircle className="h-4 w-4" /> Create event
        </Link>
      </header>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Sold</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="px-5 py-4 font-medium">{e.title}</td>
                <td className="px-5 py-4 text-muted-foreground">{e.category}</td>
                <td className="px-5 py-4 text-muted-foreground">{formatDate(e.startsAt)}</td>
                <td className="px-5 py-4">{e.sold} / {e.capacity}</td>
                <td className="px-5 py-4">{formatMoney(e.price, e.currency)}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-[color:var(--success)]/15 px-2 py-0.5 text-xs capitalize text-[color:var(--success)]">{e.status}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link to="/admin/events/edit/$id" params={{ id: e.id }} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" title="Edit"><Edit className="h-4 w-4" /></Link>
                    <button onClick={() => { if (confirm(`Delete "${e.title}"?`)) del.mutate(e.id); }} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-[color:var(--destructive)]" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
