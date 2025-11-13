const reservationModel = require('./reservationModel');
const fieldModel = require('../fields/fieldModel');
const { buildReservation } = require('../../factories/reservationFactory');
const notificationCenter = require('../../observers/notificationCenter');

const ensureAdminOrEmployee = requester => {
  if (!requester || (requester.role !== 'admin' && requester.role !== 'empleado')) {
    const error = new Error('No autorizado');
    error.status = 403;
    throw error;
  }
};

const buildError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const createReservation = async payload => {
  if (!payload.fecha_reserva) {
    throw buildError('fecha_reserva es obligatoria');
  }
  const field = await fieldModel.getFieldById(payload.id_cancha);
  if (!field) {
    throw buildError('La cancha no existe', 404);
  }

  const conflict = await reservationModel.findConflict(payload.id_cancha, payload.fecha_reserva);
  if (conflict) {
    throw buildError('La cancha no está disponible en esa fecha y hora', 409);
  }

  const reservation = buildReservation(payload);
  const created = await reservationModel.createReservation(reservation);

  notificationCenter.emit('reservation.confirmed', {
    reservationId: created.id,
    userId: created.id_usuario,
    fieldId: created.id_cancha,
    fieldName: field.nombre,
    fecha: created.fecha_reserva
  });

  return created;
};

const getReservationsForUser = userId => reservationModel.findByUser(userId);

const listAllReservations = requester => {
  ensureAdminOrEmployee(requester);
  return reservationModel.listDetailed();
};

const allowedStatuses = ['pendiente', 'confirmada', 'cancelada'];

const updateReservationStatus = async (reservationId, status, requester) => {
  ensureAdminOrEmployee(requester);
  if (!allowedStatuses.includes(status)) {
    throw buildError('Estado inválido');
  }
  const reservation = await reservationModel.findById(reservationId);
  if (!reservation) {
    throw buildError('Reserva no encontrada', 404);
  }
  await reservationModel.updateStatus(reservationId, status);
  if (status === 'confirmada') {
    const field = await fieldModel.getFieldById(reservation.id_cancha);
    notificationCenter.emit('reservation.confirmed', {
      reservationId,
      userId: reservation.id_usuario,
      fieldId: reservation.id_cancha,
      fieldName: field?.nombre,
      fecha: reservation.fecha_reserva
    });
  } else if (status === 'cancelada') {
    notificationCenter.emit('reservation.canceled', {
      reservationId,
      userId: reservation.id_usuario
    });
  }
  return { ...reservation, estado: status };
};

const cancelReservation = async (reservationId, requesterId) => {
  const reservation = await reservationModel.findById(reservationId);
  if (!reservation) {
    throw buildError('Reserva no encontrada', 404);
  }
  if (reservation.id_usuario !== requesterId) {
    throw buildError('No puedes cancelar esta reserva', 403);
  }

  await reservationModel.updateStatus(reservationId, 'cancelada');
  notificationCenter.emit('reservation.canceled', {
    reservationId,
    userId: requesterId
  });
};

module.exports = {
  createReservation,
  getReservationsForUser,
  listAllReservations,
  cancelReservation,
  updateReservationStatus
};
