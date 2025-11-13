const paymentModel = require('./paymentModel');
const reservationModel = require('../reservations/reservationModel');
const { processPayment } = require('../../strategies/payment');
const notificationCenter = require('../../observers/notificationCenter');

const buildError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const ensureAdminOrEmployee = requester => {
  if (!requester || (requester.role !== 'admin' && requester.role !== 'empleado')) {
    throw buildError('No autorizado', 403);
  }
};

const payReservation = async ({ id_reserva, metodo_pago, monto, userId }) => {
  if (!id_reserva || !metodo_pago || !monto) {
    throw buildError('id_reserva, metodo_pago y monto son obligatorios');
  }
  const reservation = await reservationModel.findById(id_reserva);
  if (!reservation) {
    throw buildError('La reserva no existe', 404);
  }
  if (reservation.id_usuario !== userId) {
    throw buildError('No puedes pagar esta reserva', 403);
  }

  const providerResponse = await processPayment(metodo_pago, { monto });

  const paymentRecord = await paymentModel.createPayment({
    id_reserva,
    id_usuario: userId,
    monto,
    metodo_pago,
    estado_pago: 'completado'
  });
  const saved = await paymentModel.findById(paymentRecord.id);

  notificationCenter.emit('payment.recorded', {
    paymentId: paymentRecord.id,
    reservationId: id_reserva,
    userId,
    monto
  });

  return { ...saved, provider: providerResponse };
};

const getPaymentsForUser = userId => paymentModel.listByUser(userId);

const listAllPayments = requester => {
  ensureAdminOrEmployee(requester);
  return paymentModel.listAll();
};

const getPaymentsForReservation = async (reservationId, userId) => {
  const reservation = await reservationModel.findById(reservationId);
  if (!reservation) {
    throw buildError('La reserva no existe', 404);
  }
  if (reservation.id_usuario !== userId) {
    throw buildError('No puedes ver estos pagos', 403);
  }
  return paymentModel.findByReservation(reservationId);
};

module.exports = { payReservation, getPaymentsForUser, getPaymentsForReservation, listAllPayments };
