const db = require('../../config/db');

const TABLE = 'notificaciones';

const createNotification = async notification => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TABLE} SET ?`, notification);
  return { id: result.insertId, ...notification };
};

const listByUser = async userId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE id_usuario = ? ORDER BY fecha_envio DESC`, [userId]);
  return rows;
};

const deleteByUser = async userId => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id_usuario = ?`, [userId]);
};

module.exports = { createNotification, listByUser, deleteByUser };
