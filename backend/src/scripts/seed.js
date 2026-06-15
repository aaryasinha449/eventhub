// node src/scripts/seed.js — populates a fresh database with an admin + sample events.
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { slugify } from '../utils/codes.js';

const day = 86_400_000;

const samples = [
  { title: 'Aurora Design Summit 2025', category: 'Conference', venue: 'The Grand Pavilion, SF', capacity: 850, price: 24900, offsetDays: 18, description: 'Two days of craft and product design.' },
  { title: 'Midnight Jazz at the Noir Lounge', category: 'Concert', venue: 'Noir Lounge, Brooklyn', capacity: 120, price: 6500, offsetDays: 6, description: 'An intimate jazz evening.' },
  { title: 'Builders Brunch — Founder Edition', category: 'Networking', venue: 'Atrium Rooftop, NYC', capacity: 60, price: 0, offsetDays: 12, description: 'Founder-only invite brunch.' },
  { title: 'TypeScript Deep Dive Workshop', category: 'Workshop', venue: 'Online', capacity: 200, price: 12900, offsetDays: 3, description: 'Advanced patterns workshop.' },
];

(async () => {
  await connectDB();

  const admin =
    (await User.findOne({ email: 'admin@eventhub.io' })) ||
    new User({ name: 'EventHub Admin', email: 'admin@eventhub.io', role: 'admin' });
  if (!admin.passwordHash) await admin.setPassword('changeme-now-please');
  await admin.save();

  for (const s of samples) {
    const slug = slugify(s.title);
    if (await Event.exists({ slug })) continue;
    await Event.create({
      title: s.title,
      slug,
      description: s.description,
      category: s.category,
      venue: s.venue,
      startsAt: new Date(Date.now() + s.offsetDays * day),
      endsAt: new Date(Date.now() + (s.offsetDays + 1) * day),
      capacity: s.capacity,
      price: s.price,
      currency: 'USD',
      status: 'published',
      organizer: admin._id,
      tags: [],
    });
  }

  console.log('[seed] done — admin: admin@eventhub.io / changeme-now-please');
  await mongoose.disconnect();
})();
