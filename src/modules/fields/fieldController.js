const fieldService = require('./fieldService');

const list = async (_req, res, next) => {
  try {
    const fields = await fieldService.listFields();
    res.json(fields);
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const field = await fieldService.getField(parseInt(req.params.id, 10));
    res.json(field);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const created = await fieldService.createField({
      ...req.body,
      requester: req.user,
      imagenFile: req.file
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await fieldService.removeField(parseInt(req.params.id, 10), req.user);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await fieldService.updateField(parseInt(req.params.id, 10), {
      ...req.body,
      requester: req.user,
      imagenFile: req.file
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const availability = async (req, res, next) => {
  try {
    const { fecha } = req.query;
    const response = await fieldService.checkAvailability(parseInt(req.params.id, 10), fecha);
    res.json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, show, create, update, remove, availability };
