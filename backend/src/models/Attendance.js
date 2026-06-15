import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true, unique: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scannedAt: { type: Date, default: Date.now },
    gate: { type: String, default: 'Main Entrance' },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

attendanceSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    ticketId: this.ticket.toString(),
    eventId: this.event.toString(),
    userId: this.user.toString(),
    scannedAt: this.scannedAt.toISOString(),
    gate: this.gate,
    scannedBy: this.scannedBy.toString(),
  };
};

export const Attendance = mongoose.model('Attendance', attendanceSchema);
