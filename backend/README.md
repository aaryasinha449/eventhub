# EventHub Backend — Express + MongoDB

Production-ready REST API for the EventHub platform. **This code does not run in the Lovable sandbox** — copy `/backend` to your own machine to run it.

## Stack
- Node.js 18+
- Express 4
- MongoDB + Mongoose 8
- JWT auth + bcrypt password hashing
- Zod request validation
- Centralized error handler + RBAC middleware

## Setup
```bash
cd backend
cp .env.example .env       # then edit MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev                # nodemon on :4000
```

Then point the frontend at it:
```bash
# in project root .env
VITE_API_URL=http://localhost:4000/api
```

## Architecture
```
backend/
├── src/
│   ├── server.js              # entry — connects DB, mounts app, listens
│   ├── app.js                 # express app — middleware, routes, error handler
│   ├── config/
│   │   ├── env.js             # env loading + validation
│   │   └── db.js              # mongoose connection
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   ├── Ticket.js
│   │   ├── Payment.js
│   │   ├── Attendance.js
│   │   └── Notification.js
│   ├── controllers/           # request handlers (thin)
│   ├── services/              # business logic (thick) — registration/ticketing/etc.
│   ├── routes/                # express routers
│   ├── middleware/
│   │   ├── auth.js            # verify JWT, load user
│   │   ├── rbac.js            # requireRole('admin')
│   │   ├── validate.js        # zod request validation
│   │   └── error.js           # centralized error formatter
│   └── utils/
│       ├── token.js           # JWT sign/verify
│       └── codes.js           # ticket code generator
└── package.json
```

## Endpoints
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/signup` | — | { name, email, password } |
| POST | `/api/auth/login` | — | { email, password } |
| POST | `/api/auth/forgot-password` | — | { email } |
| GET | `/api/auth/me` | user | current user |
| PATCH | `/api/auth/me` | user | update profile |
| GET | `/api/events` | — | list + filters (q, category, sort) |
| GET | `/api/events/:slug` | — | event by slug |
| POST | `/api/events` | admin | create |
| PATCH | `/api/events/:id` | admin | update |
| DELETE | `/api/events/:id` | admin | delete |
| POST | `/api/events/:id/register` | user | register + issue ticket + record payment |
| GET | `/api/events/:id/registrations` | admin | event registrations |
| GET | `/api/events/:id/attendance` | admin | per-event attendance |
| GET | `/api/registrations/me` | user | my registrations |
| GET | `/api/tickets/me` | user | my tickets |
| POST | `/api/tickets/verify` | admin | { payload } → { valid } |
| POST | `/api/tickets/check-in` | admin | { payload, gate } → admit |
| GET | `/api/payments/me` | user | my payments |
| GET | `/api/payments` | admin | all payments |
| GET | `/api/attendance` | admin | all attendance |
| GET | `/api/notifications` | user | my notifications |
| POST | `/api/notifications/:id/read` | user | mark read |
| GET | `/api/users` | admin | list users |
| POST | `/api/users/:id/role` | admin | { role } |

All responses use JSON. Errors → `{ message, code, details? }`.

## Production checklist
- Set strong `JWT_SECRET` (≥ 32 chars) and `BCRYPT_ROUNDS=12`.
- Restrict `CORS_ORIGIN` to your frontend URL.
- Run behind HTTPS (Nginx / Caddy / load balancer).
- Hook Stripe webhooks into `services/payment.service.js` (placeholder included).
- Enable MongoDB Atlas IP allowlist.
- Add rate limiting (`express-rate-limit`) at the auth router.
- Wire email via `services/email.service.js` (placeholder).
