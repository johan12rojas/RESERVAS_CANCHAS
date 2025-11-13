const db = require('../../config/db');
const { PASSWORD_COLUMN } = require('../../factories/userFactory');

const TABLE = 'usuarios';

const mapUserRow = row => {
  if (!row) return null;
  const { password, ...rest } = row;
  return { ...rest, password };
};

const createUser = async userData => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TABLE} SET ?`, userData);
  return { id: result.insertId, ...userData };
};

const findByEmail = async email => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT id, nombre, email, ${PASSWORD_COLUMN} AS password, tipo_usuario, fecha_creacion FROM ${TABLE} WHERE email = ? LIMIT 1`,
    [email]
  );
  return mapUserRow(rows[0]);
};

const findById = async id => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT id, nombre, email, tipo_usuario, fecha_creacion FROM ${TABLE} WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

const listAll = async () => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT id, nombre, email, tipo_usuario, fecha_creacion FROM ${TABLE} ORDER BY fecha_creacion DESC`
  );
  return rows;
};

const updateUser = async (id, data) => {
  const pool = db.getConnection();
  await pool.query(`UPDATE ${TABLE} SET ? WHERE id = ?`, [data, id]);
};

const deleteUser = async id => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
};

module.exports = { createUser, findByEmail, findById, listAll, updateUser, deleteUser };
