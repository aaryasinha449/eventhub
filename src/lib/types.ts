export type Role = "user" | "admin";

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  createdAt: string;
}

export type EventCategory =
  | "Conference"
  | "Workshop"
  | "Concert"
  | "Networking"
  | "Sports"
  | "Festival";

export type EventStatus = "draft" | "published" | "ended" | "cancelled";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  coverImage: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  sold: number;
  price: number;
  currency: string;
  status: EventStatus;
  organizerId: string;
  organizerName: string;
  tags: string[];
  createdAt: string;
}

export type RegistrationStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketId: string | null;
  status: RegistrationStatus;
  createdAt: string;
}

export interface Ticket {
  id: string;
  registrationId: string;
  eventId: string;
  userId: string;
  userName?: string;
  code: string;
  qrPayload: string;
  checkedIn: boolean;
  issuedAt: string;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  provider: "stripe" | "paddle" | "razorpay" | "manual";
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  scannedAt: string;
  gate: string;
  scannedBy: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}
