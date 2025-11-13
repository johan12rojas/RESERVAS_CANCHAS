const db = require('../../config/db');

const TABLE = 'pagos';

const createPayment = async payment => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TABLE} SET ?`, payment);
  return { id: result.insertId, ...payment };
};

const findById = async id => {
  const pool = db.getConnection();
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const findByReservation = async reservationId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT * FROM ${TABLE} WHERE id_reserva = ? ORDER BY fecha_pago DESC`,
    [reservationId]
  );
  return rows;
};

const listByUser = async userId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT p.*, r.id_usuario
     FROM ${TABLE} p
     INNER JOIN reservas r ON r.id = p.id_reserva
     WHERE r.id_usuario = ? ORDER BY fecha_pago DESC`,
    [userId]
  );
  return rows;
};

const listAll = async () => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT p.*, u.nombre AS usuario_nombre, u.email
     FROM ${TABLE} p
     INNER JOIN usuarios u ON u.id = p.id_usuario
     ORDER BY p.fecha_pago DESC`
  );
  return rows;
};

const deleteByUser = async userId => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id_usuario = ?`, [userId]);
};

const deleteByReservation = async reservationId => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id_reserva = ?`, [reservationId]);
};

module.exports = {
  createPayment,
  findById,
  findByReservation,
  listByUser,
  listAll,
  deleteByUser,
  deleteByReservation
};
