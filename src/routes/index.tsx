import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { EventCard } from "@/components/EventCard";
import { eventsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarCheck, Ticket, ScanLine, BarChart3, Sparkles, ShieldCheck, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventHub — Premium event management & ticketing" },
      { name: "description", content: "Sell tickets, check in attendees, and run revenue analytics — all in one beautifully crafted platform." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { data: events = [] } = useQuery({ queryKey: ["events", "featured"], queryFn: () => eventsApi.list({ sort: "popular" }) });
  const featured = events.slice(0, 6);

  return (
    <div className="min-h-screen">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 text-center md:pt-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Now with on-door QR check-in and live revenue analytics</span>
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
            Run events like a <span className="gold-text">premium brand.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            EventHub is the elegant, end-to-end platform for organizers — beautiful event pages,
            QR-coded tickets, on-door check-in, and real-time analytics. Built for craft.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Start free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/events" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur hover:bg-card">
              Browse live events
            </Link>
          </div>

          {/* Dashboard preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="glass-strong rounded-2xl p-2 shadow-[var(--shadow-elegant)]">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-1.5 border-b border-border/60 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 md:grid-cols-4">
                  {[
                    { l: "Tickets sold", v: "2,431", t: "+18%" },
                    { l: "Revenue", v: "$184,520", t: "+22%" },
                    { l: "Check-ins", v: "1,902", t: "+12%" },
                    { l: "Live events", v: "14", t: "+3" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg bg-card p-3 text-left">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                      <p className="mt-1 font-display text-xl font-semibold">{s.v}</p>
                      <p className="text-[11px] text-[color:var(--success)]">{s.t} vs last week</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-card p-4 md:col-span-2">
                    <p className="text-xs text-muted-foreground">Revenue, last 30 days</p>
                    <div className="mt-3 flex h-28 items-end gap-1">
                      {[12, 18, 22, 19, 28, 24, 30, 36, 32, 41, 38, 45, 50, 47, 56].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 1.6}%`, background: "var(--gradient-gold)", opacity: 0.4 + i * 0.04 }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-card p-4">
                    <p className="text-xs text-muted-foreground">Recent check-ins</p>
                    <ul className="mt-3 space-y-2 text-xs">
                      {["Ava C. · Gate 1", "Marcus R. · Gate 2", "Priya S. · Gate 1", "Diego A. · VIP"].map((x) => (
                        <li key={x} className="flex items-center gap-2 text-foreground/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams hosting events worldwide
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-center text-sm font-display text-muted-foreground/80 md:grid-cols-6">
            {["Aurora Studios", "Northwind", "Acme Co.", "Lumière", "Atrium", "Coastal RC"].map((b) => (
              <div key={b} className="opacity-80">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Everything you need</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">One platform. Every stage of the event.</h2>
          <p className="mt-4 text-muted-foreground">
            From the first ticket sold to the last guest checked in, EventHub keeps your event running smoothly.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: CalendarCheck, title: "Event pages that sell", body: "Beautiful, fast event pages with categories, capacity, pricing, and rich imagery." },
            { icon: Ticket, title: "QR-coded tickets", body: "Tickets are issued instantly with secure, scannable codes. No paper, no hassle." },
            { icon: ScanLine, title: "On-door check-in", body: "Scan, verify, and admit guests in under a second. Built for real-world gates." },
            { icon: BarChart3, title: "Revenue analytics", body: "Track sales, refunds, and check-in conversion in real-time, by event or globally." },
            { icon: ShieldCheck, title: "Role-based access", body: "Admins manage events and revenue. Users see their tickets. Permissions, sorted." },
            { icon: Sparkles, title: "Premium feel", body: "A noir-gold aesthetic your guests will remember — and your team will love using." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="inline-grid h-10 w-10 place-items-center rounded-lg" style={{ background: "var(--gradient-gold)" }}>
                <f.icon className="h-5 w-5 text-[color:var(--primary-foreground)]" />
              </div>
              <h3 className="mt-5 font-display text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Showcase */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live now</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">Events selling fast</h2>
          </div>
          <Link to="/events" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline-flex">View all →</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">Honest, scales with you.</h2>
          <p className="mt-4 text-muted-foreground">Start free. Pay when you sell. No setup fees. Cancel anytime.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { name: "Starter", price: "$0", desc: "For small communities", features: ["Up to 100 tickets / event", "QR check-in", "Basic analytics"] },
            { name: "Growth", price: "$49/mo", desc: "Most popular", features: ["Unlimited tickets", "Custom branding", "Advanced analytics", "Team seats"], featured: true },
            { name: "Enterprise", price: "Custom", desc: "For large operators", features: ["SLA & SSO", "White-label", "Dedicated CSM", "Priority support"] },
          ].map((p) => (
            <div key={p.name} className={`relative rounded-2xl p-6 ${p.featured ? "glass-strong shadow-[var(--shadow-glow)]" : "glass"}`}>
              {p.featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Recommended</span>}
              <p className="font-display text-lg">{p.name}</p>
              <p className="mt-2 font-display text-4xl font-semibold">{p.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Link to="/signup" className={`mt-6 inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold ${p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border bg-card hover:bg-accent"}`}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center font-display text-3xl tracking-tight">What organizers say</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { q: "We replaced three tools with EventHub. The check-in flow alone saved us hours.", a: "Ava Chen", r: "Director of Events, Aurora Studios" },
            { q: "Easily the best-looking ticketing platform we've used. Our attendees notice.", a: "Marcus Reed", r: "Founder, Acme Co." },
            { q: "The analytics dashboard is the first thing I open every morning during festival week.", a: "Priya Shah", r: "Producer, Northwind" },
          ].map((t) => (
            <figure key={t.a} className="glass rounded-2xl p-6">
              <blockquote className="font-display text-lg leading-snug text-foreground/90">“{t.q}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <p className="font-medium">{t.a}</p>
                <p className="text-muted-foreground">{t.r}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center font-display text-3xl tracking-tight">Questions, answered</h2>
        <div className="mt-10 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
          {[
            { q: "How do attendees receive their tickets?", a: "Tickets are issued instantly after payment. Attendees can view them in their dashboard or download them with a QR code." },
            { q: "Can I run free events?", a: "Yes — set the price to zero and the registration flow skips payment." },
            { q: "Do you support team accounts?", a: "Yes. Admins can invite teammates, assign roles, and split work across events." },
            { q: "What payment providers are supported?", a: "EventHub integrates with Stripe out of the box. Paddle and manual flows are available on Growth and above." },
            { q: "Is there an API?", a: "Yes. A complete REST API powers the dashboard — you can build directly against it." },
          ].map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                {f.q}
                <span className="text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
