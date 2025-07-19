// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payment.routes');
const stripeWebhook = require('./webhook/stripe.webhook');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();

// 1) CORS global
app.use(cors());

// 2) Guardamos el rawBody para Stripe Webhook (¡importante!)
app.use('/webhook', express.raw({ type: 'application/json' }));

// 3) Creamos el servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log('Cliente conectado via WebSocket:', socket.id);
});

// 4) Webhook de Stripe (usa `io`)
app.post('/webhook', stripeWebhook(io));

// 5) Resto de rutas usa JSON normal
app.use(express.json());
app.use('/payments', paymentRoutes);

// 6) Arrancar
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Payments service corriendo en puerto ${PORT}`);
});
