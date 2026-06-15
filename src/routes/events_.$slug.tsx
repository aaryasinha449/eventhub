import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { eventsApi, registrationsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { formatDateTime, formatMoney } from "@/lib/format";
import { Calendar, MapPin, Users, Ticket as TicketIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCallback } from "react";

export const Route = createFileRoute("/events_/$slug")({
  component: EventDetailPage,
});

/** Dynamically inject the Razorpay checkout script once. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof (window as any).Razorpay !== "undefined") {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function EventDetailPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => eventsApi.getBySlug(slug),
  });

  /**
   * Full Razorpay checkout flow:
   * 1. Call createOrder() → get orderId (or { free: true })
   * 2a. Free event → call verifyPayment({}) directly
   * 2b. Paid event → open Razorpay widget → on success call verifyPayment(razorpayData)
   * 3. Show toast + redirect to /dashboard/tickets
   */
  const handleCheckout = useCallback(async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    if (!event) return;

    try {
      // Step 1 — create order
      const order = await registrationsApi.createOrder(event.id);

      if (order.free) {
        // Free event path — just verify (no payment needed)
        await registrationsApi.verifyPayment(event.id, {});
        qc.invalidateQueries({ queryKey: ["my", "tickets"] });
        qc.invalidateQueries({ queryKey: ["my", "registrations"] });
        toast.success("Registered! Your ticket is ready.");
        navigate({ to: "/dashboard/tickets" });
        return;
      }

      // Paid event path — load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load payment gateway. Please check your connection and try again.");
        return;
      }

      // Step 2 — open checkout widget
      const rzpOptions = {
        key: order.keyId,
        amount: order.amount,          // in paise
        currency: order.currency,
        name: "EventHub",
        description: order.eventName,
        order_id: order.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#f59e0b" },   // matches --primary amber
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3 — verify on backend (issues ticket only if sig is valid)
          try {
            await registrationsApi.verifyPayment(event.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            qc.invalidateQueries({ queryKey: ["my", "tickets"] });
            qc.invalidateQueries({ queryKey: ["my", "registrations"] });
            toast.success("Payment successful! Your ticket is ready.");
            navigate({ to: "/dashboard/tickets" });
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment was cancelled.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on("payment.failed", (response: any) => {
        toast.error(
          response.error?.description || "Payment failed. Please try again."
        );
      });
      rzp.open();
    } catch (err: any) {
      if (err.message?.includes("sign in")) {
        navigate({ to: "/login" });
      } else {
        toast.error(err.message || "Something went wrong. Please try again.");
      }
    }
  }, [user, event, navigate, qc]);

  // Wrap in a mutation so we can track the "processing" loading state
  const checkoutMut = useMutation({ mutationFn: handleCheckout });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PublicHeader />
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="glass h-80 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen">
        <PublicHeader />
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl">Event not found</h1>
          <Link to="/events" className="mt-6 inline-block text-primary hover:underline">← Back to events</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const pct = Math.round((event.sold / event.capacity) * 100);
  const seatsLeft = event.capacity - event.sold;

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <Link to="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="relative h-80 overflow-hidden rounded-2xl" style={{ background: "var(--gradient-gold)" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute left-6 top-6 rounded-full bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white backdrop-blur">
                {event.category}
              </span>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="font-display text-4xl font-medium leading-tight text-white drop-shadow md:text-5xl">{event.title}</h1>
                <p className="mt-2 text-sm text-white/80">by {event.organizerName}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="glass rounded-xl p-4">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Starts</p>
                <p className="text-sm font-medium">{formatDateTime(event.startsAt)}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Venue</p>
                <p className="text-sm font-medium">{event.venue}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <Users className="h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium">{event.sold} / {event.capacity}</p>
              </div>
            </div>

            <div className="mt-8 prose prose-invert max-w-none">
              <h2 className="font-display text-2xl">About this event</h2>
              <p className="text-foreground/80">{event.description}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">#{t}</span>
              ))}
            </div>
          </div>

          {/* Sticky ticket card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-strong rounded-2xl p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Ticket</p>
              <p className="mt-2 font-display text-4xl font-semibold">{formatMoney(event.price, event.currency)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{seatsLeft > 0 ? `${seatsLeft} seats left` : "Sold out"}</p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-gold)" }} />
              </div>

              <button
                disabled={checkoutMut.isPending || seatsLeft <= 0}
                onClick={() => checkoutMut.mutate()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                <TicketIcon className="h-4 w-4" />
                {checkoutMut.isPending
                  ? "Processing…"
                  : seatsLeft > 0
                  ? event.price === 0
                    ? "Register free"
                    : "Buy ticket"
                  : "Sold out"}
              </button>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                {event.price > 0 ? "Powered by Razorpay · Test Mode" : "Free registration · No payment required"}
              </p>
            </div>
          </aside>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
