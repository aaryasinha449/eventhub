import { Link } from "@tanstack/react-router";
import type { Event } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";
import { MapPin, Calendar } from "lucide-react";

const categoryGradient: Record<string, string> = {
  Conference: "from-amber-500/30 to-yellow-500/10",
  Workshop: "from-emerald-500/30 to-teal-500/10",
  Concert: "from-rose-500/30 to-pink-500/10",
  Networking: "from-sky-500/30 to-blue-500/10",
  Sports: "from-orange-500/30 to-red-500/10",
  Festival: "from-fuchsia-500/30 to-purple-500/10",
};

export function EventCard({ event }: { event: Event }) {
  const pct = Math.round((event.sold / event.capacity) * 100);
  return (
    <Link
      to="/events/$slug"
      params={{ slug: event.slug }}
      className="group glass relative flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${categoryGradient[event.category] ?? "from-amber-500/20 to-yellow-500/5"}`}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 50%)" }} />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
            {event.category}
          </span>
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          {formatMoney(event.price, event.currency)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-display text-lg font-semibold leading-tight text-white drop-shadow">{event.title}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(event.startsAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{event.venue}</span>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{event.sold} / {event.capacity} sold</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-gold)" }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
