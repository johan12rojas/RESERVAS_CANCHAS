const billingService = require('./billingService');

const listMine = async (req, res, next) => {
  try {
    const invoices = await billingService.listInvoicesForUser(req.user.id);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

const listByReservation = async (req, res, next) => {
  try {
    const invoices = await billingService.getInvoices(
      parseInt(req.params.reservationId, 10),
      req.user.id
    );
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

const listAll = async (req, res, next) => {
  try {
    const invoices = await billingService.listInvoicesForAdmin(req.user);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

module.exports = { listMine, listByReservation, listAll };
