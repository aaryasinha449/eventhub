import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Ticket } from '../models/Ticket.js';
import { Payment } from '../models/Payment.js';
import { Notification } from '../models/Notification.js';
import { HttpError } from '../middleware/error.js';
import { generateTicketCode } from '../utils/codes.js';
import { verifyRazorpaySignature } from './payment.service.js';

/**
 * Finalise registration AFTER payment is verified.
 *
 * Flow:
 * 1) Verify Razorpay signature — reject immediately if invalid.
 * 2) Reserve a seat (atomic increment, checks capacity & status).
 * 3) Guard against duplicate registrations.
 * 4) Create Registration (pending → confirmed).
 * 5) Record Payment as succeeded with Razorpay IDs.
 * 6) Issue Ticket + QR payload.
 * 7) Send notification.
 *
 * For free events (price === 0) razorpay fields may be null — skip sig check.
 */
export async function registerForEvent({
  event,
  user,
  razorpayOrderId = null,
  razorpayPaymentId = null,
  razorpaySignature = null,
}) {
  const isFree = event.price === 0;

  // --- 1. Verify Razorpay signature for paid events ---
  if (!isFree) {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new HttpError(400, 'Payment details missing', 'payment_details_missing');
    }
    const valid = verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
    if (!valid) {
      throw new HttpError(400, 'Payment signature verification failed', 'invalid_signature');
    }
  }

  // --- 2. Reserve seat atomically ---
  const updated = await Event.findOneAndUpdate(
    { _id: event._id, $expr: { $lt: ['$sold', '$capacity'] }, status: 'published' },
    { $inc: { sold: 1 } },
    { new: true }
  );
  if (!updated) throw new HttpError(409, 'Event is sold out or unavailable', 'sold_out');

  try {
    // --- 3. Guard duplicate registrations ---
    const existing = await Registration.findOne({ event: event._id, user: user._id });
    if (existing) {
      await Event.updateOne({ _id: event._id }, { $inc: { sold: -1 } });
      throw new HttpError(409, 'You are already registered for this event', 'duplicate_registration');
    }

    // --- 4. Create Registration ---
    const registration = await Registration.create({
      event: event._id,
      user: user._id,
      status: 'pending',
    });

    // --- 5. Record Payment ---
    const payment = await Payment.create({
      user: user._id,
      event: event._id,
      amountCents: event.price,
      currency: event.currency || 'INR',
      status: 'succeeded',
      provider: isFree ? 'manual' : 'razorpay',
      providerRef: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId,
    });

    // --- 6. Issue Ticket ---
    const code = generateTicketCode();
    const ticket = await Ticket.create({
      registration: registration._id,
      event: event._id,
      user: user._id,
      code,
      qrPayload: `${code}|${event._id}|${user._id}`,
    });

    registration.ticket = ticket._id;
    registration.status = 'confirmed';
    await registration.save();

    // --- 7. Notification ---
    await Notification.create({
      user: user._id,
      title: 'Ticket issued',
      body: `Your ticket for "${event.title}" is ready.`,
      type: 'success',
    });

    return { registration, ticket, payment };
  } catch (err) {
    // Roll back seat reservation on any failure
    await Event.updateOne({ _id: event._id }, { $inc: { sold: -1 } });
    throw err;
  }
}
