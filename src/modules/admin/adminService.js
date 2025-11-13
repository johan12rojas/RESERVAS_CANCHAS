const db = require('../../config/db');

const buildError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const ensureAdmin = user => {
  if (!user || user.role !== 'admin') {
    throw buildError('No autorizado', 403);
  }
};

const getOverview = async user => {
  ensureAdmin(user);
  const pool = db.getConnection();

  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM usuarios');
  const [[{ totalFields }]] = await pool.query('SELECT COUNT(*) AS totalFields FROM canchas');
  const [[{ totalReservations }]] = await pool.query('SELECT COUNT(*) AS totalReservations FROM reservas');
  const [[{ confirmedReservations }]] = await pool.query(
    "SELECT COUNT(*) AS confirmedReservations FROM reservas WHERE estado = 'confirmada'"
  );
  const [[{ totalIncome }]] = await pool.query(
    "SELECT IFNULL(SUM(monto),0) AS totalIncome FROM pagos WHERE estado_pago = 'completado'"
  );

  const [recentUsers] = await pool.query(
    'SELECT id, nombre, email, tipo_usuario, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC LIMIT 6'
  );
  const [recentReservations] = await pool.query(
    `SELECT r.id, r.fecha_reserva, r.estado, u.nombre AS usuario, c.nombre AS cancha
     FROM reservas r
     INNER JOIN usuarios u ON u.id = r.id_usuario
     INNER JOIN canchas c ON c.id = r.id_cancha
     ORDER BY r.fecha_reserva DESC LIMIT 5`
  );
  const [recentPayments] = await pool.query(
    `SELECT p.id, p.monto, p.estado_pago, p.metodo_pago, p.fecha_pago, r.id AS reserva_id
     FROM pagos p
     INNER JOIN reservas r ON r.id = p.id_reserva
     ORDER BY p.fecha_pago DESC LIMIT 5`
  );
  const [recentInvoices] = await pool.query(
    `SELECT f.id, f.id_reserva, f.monto, f.fecha_factura,
            u.nombre AS usuario_nombre, u.email AS usuario_email,
            c.nombre AS cancha_nombre,
            p.metodo_pago
     FROM facturacion f
     INNER JOIN reservas r ON r.id = f.id_reserva
     INNER JOIN usuarios u ON u.id = r.id_usuario
     INNER JOIN canchas c ON c.id = r.id_cancha
     LEFT JOIN pagos p ON p.id_reserva = f.id_reserva AND p.estado_pago = 'completado'
     ORDER BY f.fecha_factura DESC LIMIT 5`
  );

  return {
    totals: {
      users: totalUsers,
      fields: totalFields,
      reservations: totalReservations,
      confirmedReservations,
      income: Number(totalIncome)
    },
    recent: {
      users: recentUsers,
      reservations: recentReservations,
      payments: recentPayments,
      invoices: recentInvoices
    }
  };
};

module.exports = { getOverview };
