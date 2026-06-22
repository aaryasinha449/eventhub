# 🎟️ EventHub – Premium Event Management & Ticketing Platform

EventHub is a full-stack event management platform that enables organizers to create, manage, and promote events while providing attendees with a seamless ticket booking experience.

The platform includes secure authentication, QR-based ticket generation, attendance tracking, analytics dashboards, and payment integration for a complete event management workflow.

## 🚀 Live Demo

**Frontend:** https://eventhub-six-gamma.vercel.app

### 👤 User Features

* User Registration & Login
* Browse Upcoming Events
* Event Details & Information
* Secure Event Registration
* Digital Ticket Generation
* QR Code Based Tickets
* User Dashboard
* View Registered Events
* Download Tickets

### 🛠️ Admin Features

* Admin Authentication
* Create New Events
* Edit & Delete Events
* Manage Participants
* Attendance Monitoring
* Revenue Dashboard
* User Management
* Event Analytics

### 🎫 Ticketing System

* Unique Ticket Generation
* QR Code Generation
* Ticket Verification
* Duplicate Check-in Prevention
* Real-time Attendance Tracking

  ### 💳 Payment System

* Razorpay Payment Gateway Integration
* Secure Online Payments
* Order Creation & Verification
* Payment Signature Validation
* Automated Ticket Generation After Successful Payment
* Transaction Tracking
* Event Registration Linked with Payment Status

### 📊 Analytics

* Revenue Tracking
* Event Statistics
* Attendance Reports
* Participant Insights

### 🔐 Security

* JWT Authentication
* Role-Based Access Control
* Protected Routes
* Secure API Communication
* Environment Variable Management

---

## 🏗️ Tech Stack

### Frontend

* React
* TypeScript
* TanStack Start
* TanStack Router
* TanStack Query
* Tailwind CSS
* Radix UI
* Lucide React
* Sonner

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Express Middleware

### Payments & Integrations

* Razorpay Payment Gateway
* QR Code Generation
* HTML5 QR Scanner
* Vercel Deployment
* Render Deployment
* GitHub

## 📂 Project Structure

```bash
eventhub/
│
├── src/
│   ├── components/
│   ├── routes/
│   ├── hooks/
│   ├── lib/
│   └── router.tsx
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── services/
│
├── public/
├── package.json
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/aaryasinha449/eventhub.git
cd eventhub
```

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

##  Environment Variables

### Frontend

```env
VITE_API_URL=YOUR_BACKEND_URL/api
```

### Backend

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
CORS_ORIGIN=YOUR_FRONTEND_URL
```
## Workflow

1. User registers and logs in.
2. User browses available events.
3. User registers for an event.
4. System generates a unique QR ticket.
5. User presents QR code at the venue.
6. Admin scans the QR code.
7. Attendance is recorded in real-time.
8. Analytics and attendance data are updated.


##  Key Highlights

* Full-Stack Application
* Responsive UI
* QR-Based Attendance System
* Admin Dashboard
* Real-Time Attendance Tracking
* Secure Authentication
* Production Deployment (Vercel + Render)



