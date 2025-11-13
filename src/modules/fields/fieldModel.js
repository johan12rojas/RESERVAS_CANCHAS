const db = require('../../config/db');

const TABLE = 'canchas';

const getFields = async () => {
  const pool = db.getConnection();
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} ORDER BY fecha_creacion DESC`);
  return rows;
};

const getFieldById = async id => {
  const pool = db.getConnection();
  const [rows] = await pool.query(`SELECT * FROM ${TABLE} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const createField = async field => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TABLE} SET ?`, field);
  return { id: result.insertId, ...field };
};

const deleteField = async id => {
  const pool = db.getConnection();
  await pool.query(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
};

const updateField = async (id, data) => {
  const pool = db.getConnection();
  await pool.query(`UPDATE ${TABLE} SET ? WHERE id = ?`, [data, id]);
};

const updateState = async (id, estado) => {
  const pool = db.getConnection();
  await pool.query(`UPDATE ${TABLE} SET estado = ? WHERE id = ?`, [estado, id]);
};

const isAvailable = async (id, fecha) => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM reservas WHERE id_cancha = ? AND fecha_reserva = ? AND estado <> ?',[id, fecha, 'cancelada']
  );
  return rows[0].total === 0;
};

module.exports = { getFields, getFieldById, createField, updateField, deleteField, updateState, isAvailable };
