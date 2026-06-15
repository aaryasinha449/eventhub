import { Router } from 'express';
import * as ctrl from '../controllers/event.controller.js';
import * as regCtrl from '../controllers/registration.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const r = Router();
r.get('/', ctrl.listEvents);
r.get('/id/:id', ctrl.getEventById);
r.get('/:slug', ctrl.getEventBySlug);
r.post('/', requireAuth, requireRole('admin'), validate(ctrl.createEventSchema), ctrl.createEvent);
r.patch('/:id', requireAuth, requireRole('admin'), validate(ctrl.updateEventSchema), ctrl.updateEvent);
r.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

// Razorpay: Step 1 — create order (authenticated user, pre-checkout)
r.post('/:id/create-order', requireAuth, regCtrl.createOrderHandler);

// Razorpay: Step 2 — verify signature + complete registration (issues ticket)
r.post('/:id/verify-payment', requireAuth, regCtrl.registerForEventHandler);

r.get('/:id/registrations', requireAuth, requireRole('admin'), ctrl.listEventRegistrations);
r.get('/:id/attendance', requireAuth, requireRole('admin'), ctrl.listEventAttendance);
export default r;
