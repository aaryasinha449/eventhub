import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true, index: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    qrPayload: { type: String, required: true },
    checkedIn: { type: Boolean, default: false, index: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ticketSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    registrationId: this.registration.toString(),
    eventId: this.event.toString(),
    userId: this.user && this.user._id ? this.user._id.toString() : this.user.toString(),
    userName: this.user && this.user.name ? this.user.name : undefined,
    code: this.code,
    qrPayload: this.qrPayload,
    checkedIn: this.checkedIn,
    issuedAt: this.issuedAt.toISOString(),
  };
};

export const Ticket = mongoose.model('Ticket', ticketSchema);
