const stripe = require('../config/stripe');
const { updatePaymentStatus } = require('../repositories/payment.repository');
const { sendConfirmation } = require('../services/email.service');

module.exports = function (io) {
  return async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // <- Esto es correcto con express.raw
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const orderId = pi.metadata?.orderId || 'desconocida';
      const email = pi.receipt_email || 'no-email@demo.com';

      await updatePaymentStatus(pi.id, 'succeeded');
      await sendConfirmation(email, orderId);
      io.emit('payment_succeeded', { orderId });
    }

    res.json({ received: true });
  };
};
