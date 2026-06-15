// Email placeholder — wire to your SMTP / transactional provider (SendGrid, Postmark, Resend).
export async function sendEmail({ to, subject, html }) {
  console.log('[email] →', to, '|', subject);
  // Implementation example:
  // import nodemailer from 'nodemailer';
  // const transport = nodemailer.createTransport({ host: env.SMTP_HOST, ... });
  // return transport.sendMail({ from: env.EMAIL_FROM, to, subject, html });
  return { ok: true };
}
