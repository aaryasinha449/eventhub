import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { EventCard } from "@/components/EventCard";
import { categories } from "@/lib/mock-data";
import { eventsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { EventCategory } from "@/lib/types";
import { Search } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Browse events — EventHub" },
      { name: "description", content: "Discover conferences, concerts, workshops, and more on EventHub." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<EventCategory | "All">("All");
  const [sort, setSort] = useState<"soonest" | "popular" | "price">("soonest");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", q, category, sort],
    queryFn: () => eventsApi.list({ q, category, sort }),
  });

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-4xl tracking-tight md:text-5xl">Browse events</h1>
          <p className="text-muted-foreground">Curated experiences happening soon.</p>
        </div>

        {/* Toolbar */}
        <div className="mt-8 glass flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events, venues, organizers…"
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none transition focus:border-primary/60"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory | "All")}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="All">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "soonest" | "popular" | "price")}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="soonest">Soonest</option>
            <option value="popular">Most popular</option>
            <option value="price">Lowest price</option>
          </select>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass h-80 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="font-display text-xl">No events match your filters</p>
              <p className="mt-2 text-sm text-muted-foreground">Try clearing your search or changing the category.</p>
              <button onClick={() => { setQ(""); setCategory("All"); }} className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm">Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Organizing your own?{" "}
          <Link to="/signup" className="text-primary hover:underline">Get started free →</Link>
        </p>
      </section>
      <PublicFooter />
    </div>
  );
}
