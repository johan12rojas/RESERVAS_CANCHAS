const reservationService = require('./reservationService');

const create = async (req, res, next) => {
  try {
    const created = await reservationService.createReservation({
      ...req.body,
      id_usuario: req.user.id
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const mine = async (req, res, next) => {
  try {
    const reservations = await reservationService.getReservationsForUser(req.user.id);
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const reservations = await reservationService.listAllReservations(req.user);
    res.json(reservations);
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    await reservationService.cancelReservation(parseInt(req.params.id, 10), req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const updated = await reservationService.updateReservationStatus(
      parseInt(req.params.id, 10),
      req.body.estado,
      req.user
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, mine, list, cancel, updateStatus };
