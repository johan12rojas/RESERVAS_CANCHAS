const nodemailer = require('nodemailer');
const notificationModel = require('./notificationModel');
const userModel = require('../users/userModel');
const notificationCenter = require('../../observers/notificationCenter');

let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const deliverEmail = async ({ to, subject, text }) => {
  if (!transporter || !to) {
    return false;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text
    });
    return true;
  } catch (err) {
    console.error('Error enviando correo', err);
    return false;
  }
};

const persistNotification = async ({ id_usuario, mensaje, estado }) => {
  return notificationModel.createNotification({ id_usuario, mensaje, estado });
};

const notifyUser = async ({ id_usuario, subject, mensaje }) => {
  if (!id_usuario) {
    return null;
  }
  const user = await userModel.findById(id_usuario);
  if (!user) {
    return null;
  }
  const enviado = await deliverEmail({ to: user.email, subject, text: mensaje });
  return persistNotification({ id_usuario, mensaje, estado: enviado ? 'enviado' : 'pendiente' });
};

notificationCenter.on('reservation.confirmed', payload => {
  notifyUser({
    id_usuario: payload.userId,
    subject: 'Reserva confirmada',
    mensaje: `Tu reserva ${payload.reservationId} para la cancha ${payload.fieldName || payload.fieldId} quedo registrada.`
  }).catch(err => console.error('Error notificacion reserva', err));
});

notificationCenter.on('payment.recorded', payload => {
  notifyUser({
    id_usuario: payload.userId,
    subject: 'Pago recibido',
    mensaje: `Registramos tu pago de $${payload.monto} para la reserva ${payload.reservationId}.`
  }).catch(err => console.error('Error notificacion pago', err));
});

notificationCenter.on('invoice.created', payload => {
  notifyUser({
    id_usuario: payload.userId,
    subject: 'Factura emitida',
    mensaje: `Tu factura ${payload.invoiceId || ''} ya esta disponible.`
  }).catch(err => console.error('Error notificacion factura', err));
});

notificationCenter.on('reservation.canceled', payload => {
  notifyUser({
    id_usuario: payload.userId,
    subject: 'Reserva cancelada',
    mensaje: `La reserva ${payload.reservationId} fue cancelada.`
  }).catch(err => console.error('Error notificacion cancelacion', err));
});

const listNotifications = userId => notificationModel.listByUser(userId);

const sendTestNotification = ({ id_usuario, mensaje }) => {
  return notifyUser({ id_usuario, subject: 'Notificacion de prueba', mensaje });
};

module.exports = { listNotifications, sendTestNotification };
