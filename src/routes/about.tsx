import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — EventHub" }, { name: "description", content: "Why we built EventHub and who it's for." }] }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">About</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">Built for organizers who care about craft.</h1>
        <div className="prose prose-invert mt-10 max-w-none text-foreground/80">
          <p>EventHub started with a simple frustration: every event platform we tried felt clunky, generic, and built for spreadsheets — not for the moment when a guest walks through the door.</p>
          <p>So we built the platform we wished existed. One that respects organizers' time, scales with revenue, and looks as polished as the events it powers.</p>
          <h2 className="font-display">What we believe</h2>
          <ul>
            <li><strong>Craft compounds.</strong> Every detail signals quality — from the ticket QR card to the analytics dashboard.</li>
            <li><strong>Speed is a feature.</strong> Sub-second check-ins. Instant ticket issuance. No spinning wheels.</li>
            <li><strong>Honest pricing.</strong> Free to start. Pay only when you sell. No surprise fees.</li>
          </ul>
          <h2 className="font-display">Who we serve</h2>
          <p>Conference organizers, music venues, community builders, sports clubs, festival producers, and creative studios — anyone gathering people deserves software that doesn't get in the way.</p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
