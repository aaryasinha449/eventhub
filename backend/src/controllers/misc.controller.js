import { Payment } from '../models/Payment.js';
import { Attendance } from '../models/Attendance.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { HttpError } from '../middleware/error.js';

export async function myPayments(req, res) {
  const items = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items.map((p) => p.toDTO()));
}
export async function allPayments(_req, res) {
  const items = await Payment.find().sort({ createdAt: -1 }).limit(500);
  res.json(items.map((p) => p.toDTO()));
}

export async function allAttendance(_req, res) {
  const items = await Attendance.find().sort({ scannedAt: -1 }).limit(500);
  res.json(items.map((a) => a.toDTO()));
}

export async function myNotifications(req, res) {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(items.map((n) => n.toDTO()));
}
export async function markNotificationRead(req, res) {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!n) throw new HttpError(404, 'Notification not found', 'not_found');
  res.json({ ok: true });
}

export async function listUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => u.toPublic()));
}
export async function setUserRole(req, res) {
  const role = req.body.role;
  if (!['user', 'admin'].includes(role)) throw new HttpError(400, 'Invalid role', 'invalid_role');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new HttpError(404, 'User not found', 'user_not_found');
  res.json(user.toPublic());
}
