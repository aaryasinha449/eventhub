import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Logo } from "./Logo";
import {
  LayoutDashboard, Ticket, Calendar, User, Settings, LogOut,
  Users, BarChart3, ScanLine, ShieldCheck, PlusCircle, Bell,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";

type Item = { to: string; label: string; icon: typeof Ticket };

const userNav: Item[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/registrations", label: "My Registrations", icon: Calendar },
  { to: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNav: Item[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/events", label: "Manage Events", icon: Calendar },
  { to: "/admin/events/new", label: "Create Event", icon: PlusCircle },
  { to: "/admin/participants", label: "Participants", icon: Users },
  { to: "/admin/attendance", label: "Attendance", icon: ScanLine },
  { to: "/admin/revenue", label: "Revenue", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: ShieldCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children, variant }: { children: ReactNode; variant: "user" | "admin" }) {
  const { user, logout } = useAuth();
  const nav = variant === "admin" ? adminNav : userNav;
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notifications = [] } = useQuery({
  queryKey: ["my", "notifications", user?.id],
  queryFn: () => notificationsApi.mine(user!.id),
  enabled: !!user,
});

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/60 bg-sidebar transition-transform md:relative md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center px-6">
            <Logo />
          </div>
          <div className="px-3 pb-3">
            <span className="ml-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {variant === "admin" ? "Admin" : "Account"}
            </span>
          </div>
          <nav className="space-y-1 px-3">
            {nav.map((n) => {
              const active = pathname === n.to || (n.to !== "/admin" && n.to !== "/dashboard" && pathname.startsWith(n.to));
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-border/60 p-4">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-foreground">
                {user?.name?.[0] ?? "G"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name ?? "Guest"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {open && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur">
            <button
              className="rounded-md border border-border bg-card p-2 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            </button>
            <div className="ml-auto flex items-center gap-2">
             <div className="relative">
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative rounded-md p-2 text-muted-foreground hover:bg-accent"
  >
    <Bell className="h-4 w-4" />

    {notifications.some((n) => !n.read) && (
      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg z-50">
      <div className="border-b border-border p-3 font-semibold">
        Notifications
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-3 text-sm text-muted-foreground">
            No notifications
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="border-b border-border p-3 hover:bg-accent"
            >
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">
                {n.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>
              {variant === "admin" && (
                <Link to="/admin/events/new" className="hidden rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 sm:inline-flex">
                  + New event
                </Link>
              )}
              {variant === "user" && (
                <Link to="/events" className="hidden rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 sm:inline-flex">
                  Browse events
                </Link>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
