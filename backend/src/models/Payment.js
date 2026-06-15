import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    amountCents: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', uppercase: true },
    status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending', index: true },
    provider: { type: String, enum: ['stripe', 'paddle', 'manual', 'razorpay'], default: 'razorpay' },
    providerRef: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
  },
  { timestamps: true }
);

paymentSchema.methods.toDTO = function () {
  return {
    id: this._id.toString(),
    userId: this.user.toString(),
    eventId: this.event.toString(),
    amountCents: this.amountCents,
    currency: this.currency,
    status: this.status,
    provider: this.provider,
    createdAt: this.createdAt.toISOString(),
  };
};

export const Payment = mongoose.model('Payment', paymentSchema);
