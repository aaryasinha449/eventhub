import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order.
 * @param {number} amountCents - Amount in the smallest currency unit (paise for INR).
 * @param {string} currency - ISO 4217 currency code (e.g. 'INR').
 * @param {string} receipt - A unique receipt ID (e.g. event + user IDs).
 * @returns Razorpay order object with { id, amount, currency }.
 */
export async function createRazorpayOrder({ amountCents, currency, receipt }) {
  const order = await razorpay.orders.create({
    amount: amountCents, // Razorpay expects smallest unit (paise)
    currency: currency || 'INR',
    receipt: receipt.slice(0, 40), // Razorpay receipt max 40 chars
  });
  return order;
}

/**
 * Verify Razorpay payment signature using HMAC-SHA256.
 * This MUST be called server-side before issuing a ticket.
 * @returns {boolean} true if signature is valid.
 */
export function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpaySignature;
}
