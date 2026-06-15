import { Ticket } from '../models/Ticket.js';
import { Attendance } from '../models/Attendance.js';
import { HttpError } from '../middleware/error.js';

export async function verifyTicket(payload) {
  const ticket = await Ticket.findOne({ $or: [{ qrPayload: payload }, { code: payload }] });
  if (!ticket) return { valid: false, reason: 'Ticket not found' };
  if (ticket.checkedIn) return { valid: false, ticket, reason: 'Already checked in' };
  return { valid: true, ticket };
}

export async function checkInTicket({ payload, gate, scannedBy }) {
  const ticket = await Ticket.findOne({ $or: [{ qrPayload: payload }, { code: payload }] }).populate('user', 'name');
  if (!ticket) throw new HttpError(404, 'Ticket not found', 'ticket_not_found');
  if (ticket.checkedIn) throw new HttpError(409, 'Ticket already checked in', 'already_checked_in');

  ticket.checkedIn = true;
  await ticket.save();

  const record = await Attendance.create({
    ticket: ticket._id,
    event: ticket.event,
    user: ticket.user,
    gate: gate || 'Main Entrance',
    scannedBy,
  });

  return { ticket, record };
}
