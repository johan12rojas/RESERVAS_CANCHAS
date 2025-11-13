const billingModel = require('./billingModel');
const reservationModel = require('../reservations/reservationModel');
const notificationCenter = require('../../observers/notificationCenter');

const issueInvoice = async ({ reservationId, monto, userId }) => {
  const existing = await billingModel.getByReservation(reservationId);
  if (existing.length) {
    return existing[0];
  }
  const invoice = await billingModel.createInvoice({
    id_reserva: reservationId,
    monto
  });
  notificationCenter.emit('invoice.created', {
    reservationId,
    invoiceId: invoice.id,
    monto,
    userId
  });
  return invoice;
};

notificationCenter.on('payment.recorded', payload => {
  issueInvoice({ reservationId: payload.reservationId, monto: payload.monto, userId: payload.userId }).catch(err =>
    console.error('Error generando factura automatica', err)
  );
});

const getInvoices = async (reservationId, userId) => {
  const reservation = await reservationModel.findById(reservationId);
  if (!reservation) {
    const err = new Error('Reserva no encontrada');
    err.status = 404;
    throw err;
  }
  if (reservation.id_usuario !== userId) {
    const err = new Error('No puedes ver esta factura');
    err.status = 403;
    throw err;
  }
  return billingModel.getByReservation(reservationId);
};

const listInvoicesForUser = userId => billingModel.listByUser(userId);

const listInvoicesForAdmin = requester => {
  if (!requester || (requester.role !== 'admin' && requester.role !== 'empleado')) {
    const err = new Error('No autorizado');
    err.status = 403;
    throw err;
  }
  return billingModel.listDetailed();
};

module.exports = { issueInvoice, getInvoices, listInvoicesForUser, listInvoicesForAdmin };
