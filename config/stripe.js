const Stripe = require('stripe');
require('dotenv').config();
module.exports = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});