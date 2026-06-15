import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — EventHub Admin" }] }),
  component: () => <RequireAuth role="admin"><DashboardLayout variant="admin"><Page /></DashboardLayout></RequireAuth>,
});

function Page() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["users", "all"], queryFn: () => usersApi.list() });

  const setRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => usersApi.setRole(id, role),
    onSuccess: () => { toast.success("Role updated"); qc.invalidateQueries({ queryKey: ["users"] }); },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">{users.length} total accounts</p>
      </header>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-semibold">{u.name[0]}</span>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => setRole.mutate({ id: u.id, role: e.target.value as Role })}
                    className="rounded-md border border-border bg-card px-2 py-1 text-xs"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
