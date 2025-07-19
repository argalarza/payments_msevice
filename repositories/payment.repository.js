// repositories/payment.repository.js
const { poolConnect, pool, sql } = require('../config/database');

async function createPayment(record) {
  await poolConnect; // espera a que la conexión esté lista
  const request = pool.request(); // ✅ vinculado al pool

  request.input('orderId', sql.Int, record.orderId);
  request.input('paymentIntentId', sql.VarChar, record.paymentIntentId);
  request.input('amount', sql.Decimal(12, 2), record.amount);
  request.input('status', sql.VarChar, record.status);

  const result = await request.query(`
    INSERT INTO Payments
      (order_id, payment_intent_id, amount, status)
    OUTPUT INSERTED.*
    VALUES (@orderId, @paymentIntentId, @amount, @status)
  `);
  return result.recordset[0];
}

async function updatePaymentStatus(paymentIntentId, status) {
  await poolConnect;
  const request = pool.request(); // ✅ también vinculado al pool

  request.input('paymentIntentId', sql.VarChar, paymentIntentId);
  request.input('status', sql.VarChar, status);

  await request.query(`
    UPDATE Payments
      SET status = @status
    WHERE payment_intent_id = @paymentIntentId
  `);
}

module.exports = {
  createPayment,
  updatePaymentStatus,
};
