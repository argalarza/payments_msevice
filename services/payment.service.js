const stripe = require('../config/stripe');
const axios = require('axios');
const repo = require('../repositories/payment.repository');

async function createPaymentIntent(orderId, userEmail, authHeader) {
  // Obtener datos de la orden del orders-service
  const { data: order } = await axios.get(
    `http://${process.env.ORDERS_HOST}:${process.env.ORDERS_PORT}/orders/${orderId}`,
    { headers: { Authorization: authHeader } }
  );

  const amount = Math.round(order.total * 100); // en centavos
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { orderId: String(orderId) },
    receipt_email: userEmail,
  });

  // Guardar en BD
  await repo.createPayment({
    orderId,
    paymentIntentId: paymentIntent.id,
    amount: order.total,
    status: paymentIntent.status,
  });

  return paymentIntent.client_secret;
}

module.exports = { createPaymentIntent };
