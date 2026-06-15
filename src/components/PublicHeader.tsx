import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function PublicHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="text-sm font-medium transition"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
                Sign in
              </Link>
              <Link to="/signup" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
