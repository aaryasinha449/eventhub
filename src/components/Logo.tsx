import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-gold)" }}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[color:var(--primary-foreground)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">EventHub</span>
    </Link>
  );
}
