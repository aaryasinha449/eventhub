// Mock data layer — replace by pointing VITE_API_URL at the Express backend in /backend.
import type { Event, EventCategory, Registration, Ticket, Payment, AttendanceRecord, NotificationItem, UserPublic } from "./types";

const now = Date.now();
const day = 86_400_000;

export const mockUsers: UserPublic[] = [
  { id: "u_1", name: "Ava Chen", email: "ava@eventhub.io", role: "admin", avatar: null, createdAt: new Date(now - 90 * day).toISOString() },
  { id: "u_2", name: "Marcus Reed", email: "marcus@acme.co", role: "user", avatar: null, createdAt: new Date(now - 40 * day).toISOString() },
  { id: "u_3", name: "Priya Shah", email: "priya@northwind.io", role: "user", avatar: null, createdAt: new Date(now - 22 * day).toISOString() },
  { id: "u_4", name: "Diego Alvarez", email: "diego@studio.co", role: "user", avatar: null, createdAt: new Date(now - 10 * day).toISOString() },
];

const cats: EventCategory[] = ["Conference", "Workshop", "Concert", "Networking", "Sports", "Festival"];

export const mockEvents: Event[] = [
  {
    id: "e_1",
    title: "Aurora Design Summit 2025",
    slug: "aurora-design-summit-2025",
    description: "A two-day gathering for product designers, engineers, and creative directors shaping the next decade of digital craft. Hands-on sessions, fireside chats, and a curated after-party.",
    category: "Conference",
    coverImage: "",
    venue: "The Grand Pavilion, San Francisco",
    startsAt: new Date(now + 18 * day).toISOString(),
    endsAt: new Date(now + 20 * day).toISOString(),
    capacity: 850,
    sold: 612,
    price: 24900,
    currency: "USD",
    status: "published",
    organizerId: "u_1",
    organizerName: "EventHub Studio",
    tags: ["design", "product", "leadership"],
    createdAt: new Date(now - 30 * day).toISOString(),
  },
  {
    id: "e_2",
    title: "Midnight Jazz at the Noir Lounge",
    slug: "midnight-jazz-noir-lounge",
    description: "An intimate evening with the city's finest jazz quartet. Limited capacity, candlelit tables, a curated cocktail menu.",
    category: "Concert",
    coverImage: "",
    venue: "Noir Lounge, Brooklyn",
    startsAt: new Date(now + 6 * day).toISOString(),
    endsAt: new Date(now + 6 * day + 4 * 3600_000).toISOString(),
    capacity: 120,
    sold: 98,
    price: 6500,
    currency: "USD",
    status: "published",
    organizerId: "u_1",
    organizerName: "Noir Lounge",
    tags: ["jazz", "nightlife"],
    createdAt: new Date(now - 14 * day).toISOString(),
  },
  {
    id: "e_3",
    title: "Builders Brunch — Founder Edition",
    slug: "builders-brunch-founder-edition",
    description: "Quarterly invite-only brunch for early-stage founders. Honest conversations, no pitches.",
    category: "Networking",
    coverImage: "",
    venue: "Atrium Rooftop, NYC",
    startsAt: new Date(now + 12 * day).toISOString(),
    endsAt: new Date(now + 12 * day + 3 * 3600_000).toISOString(),
    capacity: 60,
    sold: 47,
    price: 0,
    currency: "USD",
    status: "published",
    organizerId: "u_1",
    organizerName: "Builders Collective",
    tags: ["founders", "community"],
    createdAt: new Date(now - 8 * day).toISOString(),
  },
  {
    id: "e_4",
    title: "TypeScript Deep Dive Workshop",
    slug: "typescript-deep-dive-workshop",
    description: "Six hours, advanced patterns, real-world codebases. Bring your laptop.",
    category: "Workshop",
    coverImage: "",
    venue: "Online (Zoom)",
    startsAt: new Date(now + 3 * day).toISOString(),
    endsAt: new Date(now + 3 * day + 6 * 3600_000).toISOString(),
    capacity: 200,
    sold: 184,
    price: 12900,
    currency: "USD",
    status: "published",
    organizerId: "u_1",
    organizerName: "EventHub Academy",
    tags: ["typescript", "frontend"],
    createdAt: new Date(now - 21 * day).toISOString(),
  },
  {
    id: "e_5",
    title: "Sunset Half-Marathon",
    slug: "sunset-half-marathon",
    description: "21K along the coastline, finishing at golden hour. Chip timing, hydration stations, finisher medal.",
    category: "Sports",
    coverImage: "",
    venue: "Pacific Coast, Half Moon Bay",
    startsAt: new Date(now + 32 * day).toISOString(),
    endsAt: new Date(now + 32 * day + 5 * 3600_000).toISOString(),
    capacity: 1500,
    sold: 1102,
    price: 8900,
    currency: "USD",
    status: "published",
    organizerId: "u_1",
    organizerName: "Coastal Runners Club",
    tags: ["running", "outdoors"],
    createdAt: new Date(now - 60 * day).toISOString(),
  },
  {
    id: "e_6",
    title: "Indie Film Festival — Opening Night",
    slug: "indie-film-festival-opening-night",
    description: "Six premieres, a Q&A with directors, and a champagne reception in the lobby.",
    category: "Festival",
    coverImage: "",
    venue: "Lumière Cinema, LA",
    startsAt: new Date(now + 45 * day).toISOString(),
    endsAt: new Date(now + 47 * day).toISOString(),
    capacity: 400,
    sold: 156,
    price: 4500,
    currency: "USD",
    status: "published",
    organizerId: "u_1",
    organizerName: "Lumière Cinema",
    tags: ["film", "festival"],
    createdAt: new Date(now - 4 * day).toISOString(),
  },
];

export const mockRegistrations: Registration[] = [
  { id: "r_1", eventId: "e_1", userId: "u_2", ticketId: "t_1", status: "confirmed", createdAt: new Date(now - 12 * day).toISOString() },
  { id: "r_2", eventId: "e_2", userId: "u_2", ticketId: "t_2", status: "confirmed", createdAt: new Date(now - 5 * day).toISOString() },
  { id: "r_3", eventId: "e_4", userId: "u_2", ticketId: "t_3", status: "confirmed", createdAt: new Date(now - 2 * day).toISOString() },
];

export const mockTickets: Ticket[] = [
  { id: "t_1", registrationId: "r_1", eventId: "e_1", userId: "u_2", code: "EVH-AUR-7K2X9P", qrPayload: "EVH-AUR-7K2X9P|e_1|u_2", checkedIn: false, issuedAt: new Date(now - 12 * day).toISOString() },
  { id: "t_2", registrationId: "r_2", eventId: "e_2", userId: "u_2", code: "EVH-NOI-4B3M2L", qrPayload: "EVH-NOI-4B3M2L|e_2|u_2", checkedIn: false, issuedAt: new Date(now - 5 * day).toISOString() },
  { id: "t_3", registrationId: "r_3", eventId: "e_4", userId: "u_2", code: "EVH-TSW-9G1H8R", qrPayload: "EVH-TSW-9G1H8R|e_4|u_2", checkedIn: true, issuedAt: new Date(now - 2 * day).toISOString() },
];

export const mockPayments: Payment[] = [
  { id: "p_1", userId: "u_2", eventId: "e_1", amountCents: 24900, currency: "USD", status: "succeeded", provider: "stripe", createdAt: new Date(now - 12 * day).toISOString() },
  { id: "p_2", userId: "u_2", eventId: "e_2", amountCents: 6500, currency: "USD", status: "succeeded", provider: "stripe", createdAt: new Date(now - 5 * day).toISOString() },
  { id: "p_3", userId: "u_2", eventId: "e_4", amountCents: 12900, currency: "USD", status: "succeeded", provider: "stripe", createdAt: new Date(now - 2 * day).toISOString() },
  { id: "p_4", userId: "u_3", eventId: "e_1", amountCents: 24900, currency: "USD", status: "succeeded", provider: "stripe", createdAt: new Date(now - 9 * day).toISOString() },
  { id: "p_5", userId: "u_4", eventId: "e_5", amountCents: 8900, currency: "USD", status: "succeeded", provider: "stripe", createdAt: new Date(now - 1 * day).toISOString() },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: "a_1", ticketId: "t_3", eventId: "e_4", userId: "u_2", scannedAt: new Date(now - 1 * day).toISOString(), gate: "Main Entrance", scannedBy: "u_1" },
];

export const mockNotifications: NotificationItem[] = [
  { id: "n_1", userId: "u_2", title: "Ticket issued", body: "Your ticket for Aurora Design Summit is ready.", type: "success", read: false, createdAt: new Date(now - 12 * day).toISOString() },
  { id: "n_2", userId: "u_2", title: "Event starts in 3 days", body: "TypeScript Deep Dive begins Friday at 9am.", type: "info", read: false, createdAt: new Date(now - 1 * day).toISOString() },
  { id: "n_3", userId: "u_2", title: "Payment received", body: "$249.00 charged to •••• 4242.", type: "success", read: true, createdAt: new Date(now - 12 * day).toISOString() },
];

export const categories: EventCategory[] = cats;
