const taskService = require('./taskService');

const create = async (req, res, next) => {
  try {
    const created = await taskService.createTask({ ...req.body, requester: req.user });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const tasks = await taskService.listTasks(req.user);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const mine = async (req, res, next) => {
  try {
    const tasks = await taskService.listTasksForEmployee(req.user);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const updated = await taskService.updateTaskStatus({
      taskId: parseInt(req.params.id, 10),
      estado: req.body.estado,
      requester: req.user
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const history = async (req, res, next) => {
  try {
    const log = await taskService.getTaskHistory(parseInt(req.params.id, 10), req.user);
    res.json(log);
  } catch (err) {
    next(err);
  }
};

const historyMine = async (req, res, next) => {
  try {
    const log = await taskService.listHistoryForEmployee(req.user);
    res.json(log);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await taskService.updateTaskDetails({
      taskId: parseInt(req.params.id, 10),
      requester: req.user,
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, mine, updateStatus, update, history, historyMine };

