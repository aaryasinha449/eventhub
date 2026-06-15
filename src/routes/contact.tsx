import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — EventHub" }] }),
  component: Contact,
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message received. We'll be in touch shortly.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">Let's talk.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Sales, partnerships, support — we read every message.</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" name="name" required />
              <Input label="Email" name="email" type="email" required />
            </div>
            <Input label="Subject" name="subject" />
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Message</span>
              <textarea name="message" rows={6} required className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/60" />
            </label>
            <button disabled={submitting} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {submitting ? "Sending…" : "Send message"}
            </button>
          </form>

          <aside className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@eventhub.io" },
              { icon: MessageSquare, label: "Sales", value: "sales@eventhub.io" },
              { icon: MapPin, label: "HQ", value: "San Francisco, CA" },
            ].map((c) => (
              <div key={c.label} className="glass flex items-start gap-3 rounded-xl p-4">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="text-sm">{c.value}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}

function Input({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} name={name} required={required} className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/60" />
    </label>
  );
}
