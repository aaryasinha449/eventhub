import { z } from 'zod';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Attendance } from '../models/Attendance.js';
import { HttpError } from '../middleware/error.js';
import { slugify } from '../utils/codes.js';

const categories = ['Conference', 'Workshop', 'Concert', 'Networking', 'Sports', 'Festival'];

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  category: z.enum(categories),
  coverImage: z.string().default(''),
  venue: z.string().min(1).max(200),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.number().int().min(1),
  price: z.number().int().min(0),
  currency: z.string().default('USD'),
  status: z.enum(['draft', 'published', 'ended', 'cancelled']).default('draft'),
  tags: z.array(z.string()).default([]),
});

export const updateEventSchema = createEventSchema.partial();

export async function listEvents(req, res) {
  const { q, category, sort } = req.query;
  const filter = { status: 'published' };
  if (category && category !== 'All') filter.category = category;
  if (q) filter.$text = { $search: String(q) };

  const sortMap = {
    popular: { sold: -1 },
    price: { price: 1 },
    soonest: { startsAt: 1 },
  };
  const events = await Event.find(filter).sort(sortMap[sort] || sortMap.soonest).limit(200);
  res.json(events.map((e) => e.toDTO()));
}

export async function getEventBySlug(req, res) {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) throw new HttpError(404, 'Event not found', 'event_not_found');
  res.json(event.toDTO());
}

export async function getEventById(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) throw new HttpError(404, 'Event not found', 'event_not_found');
  res.json(event.toDTO());
}

export async function createEvent(req, res) {
  const slug = slugify(req.body.title) + '-' + Math.random().toString(36).slice(2, 6);
  const event = await Event.create({ ...req.body, slug, organizer: req.user._id });
  res.status(201).json(event.toDTO());
}

export async function updateEvent(req, res) {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) throw new HttpError(404, 'Event not found', 'event_not_found');
  res.json(event.toDTO());
}

export async function deleteEvent(req, res) {
  const result = await Event.findByIdAndDelete(req.params.id);
  if (!result) throw new HttpError(404, 'Event not found', 'event_not_found');
  res.json({ ok: true });
}

export async function listEventRegistrations(req, res) {
  const regs = await Registration.find({ event: req.params.id });
  res.json(regs.map((r) => r.toDTO()));
}

export async function listEventAttendance(req, res) {
  const records = await Attendance.find({ event: req.params.id });
  res.json(records.map((r) => r.toDTO()));
}
