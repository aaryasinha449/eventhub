import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    userId: this.user.toString(),
    title: this.title,
    body: this.body,
    type: this.type,
    read: this.read,
    createdAt: this.createdAt.toISOString(),
  };
};

export const Notification = mongoose.model('Notification', notificationSchema);
