import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { HttpError } from '../middleware/error.js';
import { registerForEvent } from '../services/registration.service.js';
import { createRazorpayOrder } from '../services/payment.service.js';

/**
 * POST /events/:id/create-order
 * Creates a Razorpay order for a paid event.
 * For free events, returns { free: true } so the frontend can skip checkout.
 */
export async function createOrderHandler(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) throw new HttpError(404, 'Event not found', 'event_not_found');
  if (event.status !== 'published') throw new HttpError(400, 'Event is not available', 'event_unavailable');
  if (event.sold >= event.capacity) throw new HttpError(409, 'Event is sold out', 'sold_out');

  // Free event — skip Razorpay
  if (event.price === 0) {
    return res.json({ free: true, eventId: event._id });
  }

  const receipt = `evt_${event._id}_usr_${req.user._id}`;
  const order = await createRazorpayOrder({
    amountCents: event.price, // already in paise from DB
    currency: event.currency || 'INR',
    receipt,
  });

  res.json({
    free: false,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    eventName: event.title,
  });
}

/**
 * POST /events/:id/verify-payment
 * Verifies Razorpay signature and completes registration.
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * For free events, body can be empty — service skips sig check when price === 0.
 */
export async function registerForEventHandler(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) throw new HttpError(404, 'Event not found', 'event_not_found');

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const { registration, ticket, payment } = await registerForEvent({
    event,
    user: req.user,
    razorpayOrderId: razorpay_order_id || null,
    razorpayPaymentId: razorpay_payment_id || null,
    razorpaySignature: razorpay_signature || null,
  });

  res.status(201).json({
    registration: registration.toDTO(),
    ticket: ticket.toDTO(),
    payment: payment.toDTO(),
  });
}

export async function myRegistrations(req, res) {
  const regs = await Registration.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(regs.map((r) => r.toDTO()));
}
