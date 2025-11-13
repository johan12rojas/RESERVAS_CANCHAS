const db = require('../../config/db');

const TASKS_TABLE = 'tareas';
const HISTORY_TABLE = 'tarea_historial';

const createTask = async task => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${TASKS_TABLE} SET ?`, task);
  return { id: result.insertId, ...task };
};

const updateTask = async (id, data) => {
  const pool = db.getConnection();
  await pool.query(`UPDATE ${TASKS_TABLE} SET ? WHERE id = ?`, [data, id]);
};

const listAll = async () => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT t.*, 
            c.nombre AS creador_nombre, c.email AS creador_email,
            a.nombre AS asignado_nombre, a.email AS asignado_email
     FROM ${TASKS_TABLE} t
     INNER JOIN usuarios c ON c.id = t.creado_por
     INNER JOIN usuarios a ON a.id = t.asignado_a
     ORDER BY t.fecha_programada IS NULL, t.fecha_programada`
  );
  return rows;
};

const listByAssignee = async userId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT t.*, 
            c.nombre AS creador_nombre, c.email AS creador_email,
            a.nombre AS asignado_nombre, a.email AS asignado_email
     FROM ${TASKS_TABLE} t
     INNER JOIN usuarios c ON c.id = t.creado_por
     INNER JOIN usuarios a ON a.id = t.asignado_a
     WHERE t.asignado_a = ?
     ORDER BY t.fecha_programada IS NULL, t.fecha_programada`,
    [userId]
  );
  return rows;
};

const findById = async id => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT t.*, 
            c.nombre AS creador_nombre, c.email AS creador_email,
            a.nombre AS asignado_nombre, a.email AS asignado_email
     FROM ${TASKS_TABLE} t
     INNER JOIN usuarios c ON c.id = t.creado_por
     INNER JOIN usuarios a ON a.id = t.asignado_a
     WHERE t.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

const createHistory = async history => {
  const pool = db.getConnection();
  const [result] = await pool.query(`INSERT INTO ${HISTORY_TABLE} SET ?`, history);
  return { id: result.insertId, ...history };
};

const listHistory = async taskId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT h.*, u.nombre AS usuario_nombre
     FROM ${HISTORY_TABLE} h
     INNER JOIN usuarios u ON u.id = h.realizado_por
     WHERE h.id_tarea = ?
     ORDER BY h.fecha_cambio DESC`,
    [taskId]
  );
  return rows;
};

const listHistoryByAssignee = async userId => {
  const pool = db.getConnection();
  const [rows] = await pool.query(
    `SELECT h.*, u.nombre AS usuario_nombre, t.titulo
     FROM ${HISTORY_TABLE} h
     INNER JOIN ${TASKS_TABLE} t ON t.id = h.id_tarea
     INNER JOIN usuarios u ON u.id = h.realizado_por
     WHERE t.asignado_a = ?
     ORDER BY h.fecha_cambio DESC`,
    [userId]
  );
  return rows;
};

module.exports = {
  createTask,
  updateTask,
  listAll,
  listByAssignee,
  findById,
  createHistory,
  listHistory,
  listHistoryByAssignee
};



