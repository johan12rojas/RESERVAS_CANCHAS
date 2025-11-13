const db = require('../../config/db');

const TABLE = 'facturacion';

const createInvoice = async invoice => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TABLE} SET ?`, invoice);
  return { id: result.insertId, ...invoice };
};

const getByReservation = async reservationId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE id_reserva = ?`, [reservationId]);
  return rows;
};

const listByUser = async userId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT f.*, r.fecha_reserva, c.nombre AS cancha_nombre, c.capacidad, p.metodo_pago, p.estado_pago
     FROM ${TABLE} f
     INNER JOIN reservas r ON r.id = f.id_reserva
     INNER JOIN canchas c ON c.id = r.id_cancha
     LEFT JOIN pagos p ON p.id_reserva = f.id_reserva AND p.estado_pago = 'completado'
     WHERE r.id_usuario = ?
     ORDER BY f.fecha_factura DESC`,
    [userId]
  );
  return rows;
};

const listDetailed = async () => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT f.*, r.fecha_reserva, u.nombre AS usuario_nombre, u.email AS usuario_email,
            c.nombre AS cancha_nombre, c.capacidad,
            p.metodo_pago, p.estado_pago
     FROM ${TABLE} f
     INNER JOIN reservas r ON r.id = f.id_reserva
     INNER JOIN usuarios u ON u.id = r.id_usuario
     INNER JOIN canchas c ON c.id = r.id_cancha
     LEFT JOIN pagos p ON p.id_reserva = f.id_reserva AND p.estado_pago = 'completado'
     ORDER BY f.fecha_factura DESC`
  );
  return rows;
};

const deleteByReservation = async reservationId => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id_reserva = ?`, [reservationId]);
};

module.exports = { createInvoice, getByReservation, listByUser, listDetailed, deleteByReservation };
