const paymentService = require('../services/payment.service');

async function handleCreateIntent(req, res) {
  try {
    const { orderId } = req.body;
    const clientSecret = await paymentService.createPaymentIntent(
      orderId,
      req.user.email,
      req.headers.authorization
    );
    res.json({ clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando PaymentIntent' });
  }
}

module.exports = { handleCreateIntent };