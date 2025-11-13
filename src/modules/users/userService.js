const userModel = require('./userModel');
const reservationModel = require('../reservations/reservationModel');
const paymentModel = require('../payments/paymentModel');
const billingModel = require('../billing/billingModel');
const notificationModel = require('../notifications/notificationModel');
const { buildUser } = require('../../factories/userFactory');
const { generateToken } = require('../../utils/token');

const buildError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const register = async payload => {
  const email = (payload.email || '').toLowerCase();
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw buildError('El correo ya está registrado', 409);
  }

  const userData = buildUser({ ...payload, email });
  const created = await userModel.createUser(userData);

  const token = generateToken({ id: created.id, email, role: created.tipo_usuario });
  return { token, user: { id: created.id, nombre: created.nombre, email, tipo_usuario: created.tipo_usuario } };
};

const login = async (email, password) => {
  const user = await userModel.findByEmail((email || '').toLowerCase());
  if (!user) {
    throw buildError('Credenciales inválidas', 401);
  }

  if (user.password !== password) {
    throw buildError('Credenciales inválidas', 401);
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.tipo_usuario });
  return { token, user: { id: user.id, nombre: user.nombre, email: user.email, tipo_usuario: user.tipo_usuario } };
};

const getProfile = async id => {
  const profile = await userModel.findById(id);
  if (!profile) {
    throw buildError('Usuario no encontrado', 404);
  }
  return profile;
};

const listUsers = async requester => {
  if (!requester || requester.role !== 'admin') {
    throw buildError('No autorizado', 403);
  }
  return userModel.listAll();
};

const updateUser = async (requester, id, data) => {
  if (!requester || requester.role !== 'admin') {
    throw buildError('No autorizado', 403);
  }
  const target = await userModel.findById(id);
  if (!target) {
    throw buildError('Usuario no encontrado', 404);
  }
  const payload = {};
  if (data.nombre) payload.nombre = data.nombre;
  if (data.email) payload.email = data.email.toLowerCase();
  if (data.tipo_usuario) payload.tipo_usuario = data.tipo_usuario;
  await userModel.updateUser(id, payload);
  return userModel.findById(id);
};

const deleteUser = async (requester, id) => {
  if (!requester || requester.role !== 'admin') {
    throw buildError('No autorizado', 403);
  }
  if (requester.id === id) {
    throw buildError('No puedes eliminar tu propio usuario', 400);
  }
  const target = await userModel.findById(id);
  if (!target) {
    throw buildError('Usuario no encontrado', 404);
  }
  if (target.tipo_usuario === 'admin') {
    throw buildError('No puedes eliminar administradores', 400);
  }
  const reservations = await reservationModel.findByUser(id);
  await Promise.all(
    reservations.map(async reservation => {
      await billingModel.deleteByReservation(reservation.id);
      await paymentModel.deleteByReservation(reservation.id);
    })
  );
  await paymentModel.deleteByUser(id);
  await notificationModel.deleteByUser(id);
  await reservationModel.deleteByUser(id);
  await userModel.deleteUser(id);
};

module.exports = { register, login, getProfile, listUsers, updateUser, deleteUser };
