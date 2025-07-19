const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/payment.controller');

router.post('/create-payment-intent', auth, ctrl.handleCreateIntent);

module.exports = router;