const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendConfirmation(to, orderId) {
  const htmlContent = `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
    <header style="background: linear-gradient(90deg, #0d6efd, #6610f2); padding: 24px; color: white; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">✔ Confirmación de Pago</h1>
      <p style="margin: 4px 0 0; font-size: 16px;">Tu compra fue procesada con éxito</p>
    </header>
    <main style="padding: 24px; background-color: #ffffff;">
      <p style="font-size: 16px; color: #333;">Hola,</p>
      <p style="font-size: 16px; color: #333;">
        Te confirmamos que tu pago ha sido recibido correctamente. Aquí están los detalles de tu orden:
      </p>

      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px solid #dee2e6;">
        <p style="margin: 0; font-size: 16px; color: #212529;"><strong>🔖 Número de orden:</strong> ${orderId}</p>
        <p style="margin: 8px 0 0; font-size: 16px; color: #212529;"><strong>💳 Estado:</strong> Pagado</p>
        <p style="margin: 8px 0 0; font-size: 16px; color: #212529;"><strong>📦 En preparación</strong></p>
      </div>

      <p style="font-size: 16px; color: #333;">
        Puedes seguir el estado de tu orden ingresando a tu cuenta o haciendo clic en el siguiente botón:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://miapp.com/orders/${orderId}" target="_blank" style="background-color: #0d6efd; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 16px;">
          Ver mi orden
        </a>
      </div>

      <p style="font-size: 14px; color: #777;">
        Si no realizaste esta compra o crees que se trata de un error, por favor contáctanos inmediatamente.
      </p>
    </main>
    <footer style="background-color: #f1f3f5; padding: 16px; text-align: center; font-size: 13px; color: #6c757d;">
      TecnoShop © ${new Date().getFullYear()} – Todos los derechos reservados<br/>
      Este mensaje fue generado automáticamente. No respondas a este correo.
    </footer>
  </div>
  `;

  await transporter.sendMail({
    from: `"TecnoShop Pagos" <${process.env.EMAIL_USER}>`,
    to,
    subject: '✔ Confirmación de tu pago',
    html: htmlContent,
  });
}

module.exports = { sendConfirmation };
