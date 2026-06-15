import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RequireAuth } from "@/components/RequireAuth";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { toast } from "sonner";
import type { EventCategory, EventStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/events/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Event — EventHub Admin" }] }),
  component: () => (
    <RequireAuth role="admin">
      <DashboardLayout variant="admin">
        <Page />
      </DashboardLayout>
    </RequireAuth>
  ),
});

function Page() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", "id", id],
    queryFn: () => eventsApi.getById(id),
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Conference" as EventCategory,
    venue: "",
    startsAt: "",
    endsAt: "",
    capacity: 100,
    price: 0,
    currency: "USD",
    status: "draft" as EventStatus,
    tags: "",
    coverImage: "",
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        startsAt: new Date(event.startsAt).toISOString().slice(0, 16),
        endsAt: new Date(event.endsAt).toISOString().slice(0, 16),
        capacity: event.capacity,
        price: event.price,
        currency: event.currency,
        status: event.status,
        tags: event.tags.join(", "),
        coverImage: event.coverImage || "",
      });
    }
  }, [event]);

  const updateMut = useMutation({
    mutationFn: (data: Parameters<typeof eventsApi.update>[1]) =>
      eventsApi.update(id, data),
    onSuccess: () => {
      toast.success("Event updated successfully");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event", "id", id] });
      navigate({ to: "/admin/events" });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update event");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMut.mutate({
      ...form,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      capacity: Number(form.capacity),
      price: Number(form.price),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="glass h-96 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-2xl">Event not found</h1>
        <button onClick={() => navigate({ to: "/admin/events" })} className="mt-4 text-primary hover:underline">
          Back to events
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Edit Event</h1>
        <p className="text-sm text-muted-foreground">Update event details.</p>
      </header>

      <div className="glass rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input required name="title" value={form.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea required name="description" value={form.description} onChange={handleChange} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Concert">Concert</option>
                <option value="Networking">Networking</option>
                <option value="Sports">Sports</option>
                <option value="Festival">Festival</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="ended">Ended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Venue</label>
            <input required name="venue" value={form.venue} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Starts At</label>
              <input required type="datetime-local" name="startsAt" value={form.startsAt} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ends At</label>
              <input required type="datetime-local" name="endsAt" value={form.endsAt} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <input required type="number" name="capacity" min="1" value={form.capacity} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (USD)</label>
              <input required type="number" name="price" min="0" value={form.price} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <input required name="currency" value={form.currency} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. music, outdoors, summer" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate({ to: "/admin/events" })} className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={updateMut.isPending} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              {updateMut.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
