/**
 * Thin REST client. Defaults to mock data when VITE_API_URL is not set.
 * When the Express backend in /backend is running, set VITE_API_URL=http://localhost:4000/api
 * and every call below will go to the real server.
 */
import {
  mockEvents,
  mockRegistrations,
  mockTickets,
  mockPayments,
  mockAttendance,
  mockNotifications,
  mockUsers,
} from "./mock-data";
import type {
  Event,
  EventCategory,
  Registration,
  Ticket,
  Payment,
  AttendanceRecord,
  NotificationItem,
  UserPublic,
  Role,
} from "./types";

let rawApiUrl = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) || "";
if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1);
if (rawApiUrl && !rawApiUrl.endsWith('/api')) rawApiUrl += '/api';
const API_URL = rawApiUrl;

const USE_MOCK = !API_URL;

const TOKEN_KEY = "eventhub.token";
const USER_KEY = "eventhub.user";

export const tokenStore = {
  get: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => typeof window !== "undefined" && localStorage.setItem(TOKEN_KEY, t),
  clear: () => typeof window !== "undefined" && localStorage.removeItem(TOKEN_KEY),
};

export const userStore = {
  get: (): UserPublic | null => {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(USER_KEY);
    return v ? (JSON.parse(v) as UserPublic) : null;
  },
  set: (u: UserPublic) => typeof window !== "undefined" && localStorage.setItem(USER_KEY, JSON.stringify(u)),
  clear: () => typeof window !== "undefined" && localStorage.removeItem(USER_KEY),
};

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- AUTH ----------
export const authApi = {
  async login(email: string, _password: string): Promise<{ token: string; user: UserPublic }> {
    if (USE_MOCK) {
      await sleep(400);
      const user =
        mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
        mockUsers[1];
      return { token: "mock." + user.id, user };
    }
    return http("/auth/login", { method: "POST", body: JSON.stringify({ email, password: _password }) });
  },
  async signup(name: string, email: string, _password: string): Promise<{ token: string; user: UserPublic }> {
    if (USE_MOCK) {
      await sleep(500);
      const user: UserPublic = {
        id: "u_" + Math.random().toString(36).slice(2, 8),
        name, email, role: "user", avatar: null,
        createdAt: new Date().toISOString(),
      };
      return { token: "mock." + user.id, user };
    }
    return http("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password: _password }) });
  },
  async forgotPassword(email: string): Promise<{ ok: true }> {
    if (USE_MOCK) { await sleep(400); return { ok: true }; }
    return http("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
  },
  async updateProfile(patch: Partial<Pick<UserPublic, "name" | "email" | "avatar">>): Promise<UserPublic> {
    if (USE_MOCK) {
      await sleep(300);
      const current = userStore.get();
      if (!current) throw new Error("Not authenticated");
      const updated = { ...current, ...patch };
      userStore.set(updated);
      return updated;
    }
    return http("/auth/me", { method: "PATCH", body: JSON.stringify(patch) });
  },
};

// ---------- EVENTS ----------
export const eventsApi = {
  async list(params: { q?: string; category?: EventCategory | "All"; sort?: "soonest" | "popular" | "price" } = {}): Promise<Event[]> {
    if (USE_MOCK) {
      await sleep(200);
      let list = [...mockEvents];
      if (params.q) {
        const q = params.q.toLowerCase();
        list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
      }
      if (params.category && params.category !== "All") list = list.filter((e) => e.category === params.category);
      if (params.sort === "popular") list.sort((a, b) => b.sold - a.sold);
      else if (params.sort === "price") list.sort((a, b) => a.price - b.price);
      else list.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
      return list;
    }
    const search = new URLSearchParams(params as Record<string, string>).toString();
    return http(`/events?${search}`);
  },
  async getBySlug(slug: string): Promise<Event | null> {
    if (USE_MOCK) { await sleep(150); return mockEvents.find((e) => e.slug === slug) ?? null; }
    return http(`/events/${slug}`);
  },
  async getById(id: string): Promise<Event | null> {
    if (USE_MOCK) { await sleep(150); return mockEvents.find((e) => e.id === id) ?? null; }
    return http(`/events/id/${id}`);
  },
  async create(input: Omit<Event, "id" | "slug" | "sold" | "createdAt" | "organizerId" | "organizerName">): Promise<Event> {
    if (USE_MOCK) {
      await sleep(400);
      const e: Event = {
        ...input,
        id: "e_" + Math.random().toString(36).slice(2, 8),
        slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        sold: 0,
        createdAt: new Date().toISOString(),
        organizerId: "u_1",
        organizerName: "EventHub Studio",
      };
      mockEvents.unshift(e);
      return e;
    }
    return http("/events", { method: "POST", body: JSON.stringify(input) });
  },
  async update(id: string, patch: Partial<Event>): Promise<Event> {
    if (USE_MOCK) {
      await sleep(300);
      const idx = mockEvents.findIndex((e) => e.id === id);
      if (idx < 0) throw new Error("Event not found");
      mockEvents[idx] = { ...mockEvents[idx], ...patch };
      return mockEvents[idx];
    }
    return http(`/events/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await sleep(250);
      const idx = mockEvents.findIndex((e) => e.id === id);
      if (idx >= 0) mockEvents.splice(idx, 1);
      return { ok: true };
    }
    return http(`/events/${id}`, { method: "DELETE" });
  },
};

// ---------- REGISTRATIONS / TICKETS ----------
export const registrationsApi = {
  async mine(userId: string): Promise<Registration[]> {
    if (USE_MOCK) { await sleep(150); return mockRegistrations.filter((r) => r.userId === userId); }
    return http("/registrations/me");
  },
  async byEvent(eventId: string): Promise<Registration[]> {
    if (USE_MOCK) { await sleep(150); return mockRegistrations.filter((r) => r.eventId === eventId); }
    return http(`/events/${eventId}/registrations`);
  },
  /**
   * Step 1: Create a Razorpay order (or get { free: true } for free events).
   * Returns { free, orderId, amount, currency, keyId, eventName }
   */
  async createOrder(eventId: string): Promise<{ free: boolean; orderId?: string; amount?: number; currency?: string; keyId?: string; eventName?: string }> {
    if (USE_MOCK) {
      await sleep(300);
      const ev = mockEvents.find((e) => e.id === eventId);
      if (!ev) throw new Error("Event not found");
      if (ev.price === 0) return { free: true };
      return {
        free: false,
        orderId: "order_mock_" + Math.random().toString(36).slice(2, 10),
        amount: ev.price,
        currency: ev.currency || "INR",
        keyId: "rzp_test_mock",
        eventName: ev.title,
      };
    }
    return http(`/events/${eventId}/create-order`, { method: "POST" });
  },
  /**
   * Step 2: Verify Razorpay payment signature on the backend and complete registration.
   * For free events, pass empty razorpayData {}.
   * Returns { registration, ticket, payment }
   */
  async verifyPayment(
    eventId: string,
    razorpayData: { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string }
  ): Promise<{ registration: Registration; ticket: Ticket; payment: Payment }> {
    if (USE_MOCK) {
      await sleep(600);
      const ev = mockEvents.find((e) => e.id === eventId);
      if (!ev) throw new Error("Event not found");
      const rid = "r_" + Math.random().toString(36).slice(2, 8);
      const tid = "t_" + Math.random().toString(36).slice(2, 8);
      const pid = "p_" + Math.random().toString(36).slice(2, 8);
      const userId = "u_1";
      const code = "EVH-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      const registration: Registration = { id: rid, eventId, userId, ticketId: tid, status: "confirmed", createdAt: new Date().toISOString() };
      const ticket: Ticket = { id: tid, registrationId: rid, eventId, userId, userName: "Mock User", code, qrPayload: `${code}|${eventId}|${userId}`, checkedIn: false, issuedAt: new Date().toISOString() };
      const payment: Payment = { id: pid, userId, eventId, amountCents: ev.price, currency: ev.currency, status: "succeeded", provider: "razorpay", createdAt: new Date().toISOString() };
      mockRegistrations.unshift(registration);
      mockTickets.unshift(ticket);
      mockPayments.unshift(payment);
      ev.sold += 1;
      return { registration, ticket, payment };
    }
    return http(`/events/${eventId}/verify-payment`, { method: "POST", body: JSON.stringify(razorpayData) });
  },
};

export const ticketsApi = {
  async mine(userId: string): Promise<Ticket[]> {
    if (USE_MOCK) { await sleep(150); return mockTickets.filter((t) => t.userId === userId); }
    return http("/tickets/me");
  },
  async verify(payload: string): Promise<{ valid: boolean; ticket?: Ticket; reason?: string }> {
    if (USE_MOCK) {
      await sleep(250);
      const t = mockTickets.find((x) => x.qrPayload === payload || x.code === payload);
      if (!t) return { valid: false, reason: "Ticket not found" };
      if (t.checkedIn) return { valid: false, ticket: t, reason: "Already checked in" };
      return { valid: true, ticket: t };
    }
    return http("/tickets/verify", { method: "POST", body: JSON.stringify({ payload }) });
  },
  async checkIn(payload: string, gate = "Main Entrance"): Promise<{ ok: boolean; ticket?: Ticket; record?: AttendanceRecord; reason?: string }> {
    if (USE_MOCK) {
      await sleep(300);
      const t = mockTickets.find((x) => x.qrPayload === payload || x.code === payload);
      if (!t) return { ok: false, reason: "Ticket not found" };
      if (t.checkedIn) return { ok: false, ticket: t, reason: "Already checked in" };
      t.checkedIn = true;
      const record: AttendanceRecord = {
        id: "a_" + Math.random().toString(36).slice(2, 8),
        ticketId: t.id, eventId: t.eventId, userId: t.userId,
        scannedAt: new Date().toISOString(), gate, scannedBy: "u_1",
      };
      mockAttendance.unshift(record);
      return { ok: true, ticket: t, record };
    }
    return http("/tickets/check-in", { method: "POST", body: JSON.stringify({ payload, gate }) });
  },
};

// ---------- PAYMENTS / ATTENDANCE / NOTIFS / USERS ----------
export const paymentsApi = {
  async mine(userId: string): Promise<Payment[]> {
    if (USE_MOCK) { await sleep(150); return mockPayments.filter((p) => p.userId === userId); }
    return http("/payments/me");
  },
  async all(): Promise<Payment[]> {
    if (USE_MOCK) { await sleep(150); return [...mockPayments]; }
    return http("/payments");
  },
};

export const attendanceApi = {
  async byEvent(eventId: string): Promise<AttendanceRecord[]> {
    if (USE_MOCK) { await sleep(150); return mockAttendance.filter((a) => a.eventId === eventId); }
    return http(`/events/${eventId}/attendance`);
  },
  async all(): Promise<AttendanceRecord[]> {
    if (USE_MOCK) { await sleep(150); return [...mockAttendance]; }
    return http("/attendance");
  },
};

export const notificationsApi = {
  async mine(userId: string): Promise<NotificationItem[]> {
    if (USE_MOCK) { await sleep(150); return mockNotifications.filter((n) => n.userId === userId); }
    return http("/notifications");
  },
  async markRead(id: string): Promise<{ ok: true }> {
    if (USE_MOCK) {
      const n = mockNotifications.find((x) => x.id === id);
      if (n) n.read = true;
      return { ok: true };
    }
    return http(`/notifications/${id}/read`, { method: "POST" });
  },
};

export const usersApi = {
  async list(): Promise<UserPublic[]> {
    if (USE_MOCK) { await sleep(200); return [...mockUsers]; }
    return http("/users");
  },
  async setRole(id: string, role: Role): Promise<UserPublic> {
    if (USE_MOCK) {
      const u = mockUsers.find((x) => x.id === id);
      if (!u) throw new Error("Not found");
      u.role = role; return u;
    }
    return http(`/users/${id}/role`, { method: "POST", body: JSON.stringify({ role }) });
  },
};

export { USE_MOCK, API_URL };
