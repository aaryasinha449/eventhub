import { z } from 'zod';
import { Ticket } from '../models/Ticket.js';
import { verifyTicket, checkInTicket } from '../services/ticket.service.js';

export const verifySchema = z.object({ payload: z.string().min(1) });
export const checkInSchema = z.object({ payload: z.string().min(1), gate: z.string().optional() });

export async function myTickets(req, res) {
  const tickets = await Ticket.find({ user: req.user._id }).sort({ issuedAt: -1 });
  res.json(tickets.map((t) => t.toDTO()));
}

export async function verifyHandler(req, res) {
  const result = await verifyTicket(req.body.payload);
  res.json({
    valid: result.valid,
    ticket: result.ticket ? result.ticket.toDTO() : undefined,
    reason: result.reason,
  });
}

export async function checkInHandler(req, res) {
  const { ticket, record } = await checkInTicket({
    payload: req.body.payload,
    gate: req.body.gate,
    scannedBy: req.user._id,
  });
  res.json({ ok: true, ticket: ticket.toDTO(), record: record.toDTO() });
}
