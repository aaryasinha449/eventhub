import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, maxlength: 5000 },
    category: {
      type: String,
      enum: ['Conference', 'Workshop', 'Concert', 'Networking', 'Sports', 'Festival'],
      required: true,
      index: true,
    },
    coverImage: { type: String, default: '' },
    venue: { type: String, required: true, maxlength: 200 },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 1 },
    sold: { type: Number, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true },
    status: { type: String, enum: ['draft', 'published', 'ended', 'cancelled'], default: 'draft', index: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', venue: 'text' });

eventSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    slug: this.slug,
    description: this.description,
    category: this.category,
    coverImage: this.coverImage,
    venue: this.venue,
    startsAt: this.startsAt.toISOString(),
    endsAt: this.endsAt.toISOString(),
    capacity: this.capacity,
    sold: this.sold,
    price: this.price,
    currency: this.currency,
    status: this.status,
    organizerId: this.organizer.toString(),
    organizerName: this.organizerName || '',
    tags: this.tags || [],
    createdAt: this.createdAt.toISOString(),
  };
};

export const Event = mongoose.model('Event', eventSchema);
