const db = require('../../config/db');

const TABLE = 'reservas';

const createReservation = async reservation => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TABLE} SET ?`, reservation);
  return { id: result.insertId, ...reservation };
};

const findByUser = async userId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT r.*, c.nombre AS cancha_nombre FROM ${TABLE} r INNER JOIN canchas c ON c.id = r.id_cancha WHERE r.id_usuario = ? ORDER BY r.fecha_reserva DESC`,
    [userId]
  );
  return rows;
};

const findById = async id => {
  const pool = db.getConnection();
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const listDetailed = async () => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT r.*, u.nombre AS usuario_nombre, u.email, c.nombre AS cancha_nombre, c.capacidad, c.tipo_campo
     FROM ${TABLE} r
     INNER JOIN usuarios u ON u.id = r.id_usuario
     INNER JOIN canchas c ON c.id = r.id_cancha
     ORDER BY r.fecha_reserva DESC`
  );
  return rows;
};

const updateStatus = async (id, status) => {
  const pool = db.getConnection();
  await pool.query(`UPDATE ${TABLE} SET estado = ? WHERE id = ?`, [status, id]);
};

const findConflict = async (fieldId, dateTime) => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT id FROM ${TABLE} WHERE id_cancha = ? AND fecha_reserva = ? AND estado <> 'cancelada' LIMIT 1`,
    [fieldId, dateTime]
  );
  return rows[0] || null;
};

const deleteById = async id => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
};

const deleteByUser = async userId => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id_usuario = ?`, [userId]);
};

module.exports = {
  createReservation,
  findByUser,
  findById,
  listDetailed,
  updateStatus,
  findConflict,
  deleteById,
  deleteByUser
};
