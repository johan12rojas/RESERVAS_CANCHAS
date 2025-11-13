const paymentService = require('./paymentService');

const pay = async (req, res, next) => {
  try {
    const result = await paymentService.payReservation({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const mine = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsForUser(req.user.id);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

const listAll = async (req, res, next) => {
  try {
    const payments = await paymentService.listAllPayments(req.user);
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

const byReservation = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsForReservation(
      parseInt(req.params.reservationId, 10),
      req.user.id
    );
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

module.exports = { pay, mine, listAll, byReservation };
