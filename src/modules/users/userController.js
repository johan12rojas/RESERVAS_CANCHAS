const userService = require('./userService');

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const profile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await userService.listUsers(req.user);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user, parseInt(req.params.id, 10), req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user, parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, profile, list, update, remove };
