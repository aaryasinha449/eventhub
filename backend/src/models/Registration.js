import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', default: null },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'refunded'], default: 'pending', index: true },
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, user: 1 }, { unique: true });

registrationSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    eventId: this.event.toString(),
    userId: this.user.toString(),
    ticketId: this.ticket ? this.ticket.toString() : null,
    status: this.status,
    createdAt: this.createdAt.toISOString(),
  };
};

export const Registration = mongoose.model('Registration', registrationSchema);
