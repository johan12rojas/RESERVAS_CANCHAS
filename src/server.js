require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '6mb' }));
app.use(express.urlencoded({ extended: true, limit: '6mb' }));
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/users', require('./modules/users/userRoutes'));
app.use('/api/fields', require('./modules/fields/fieldRoutes'));
app.use('/api/reservations', require('./modules/reservations/reservationRoutes'));
app.use('/api/payments', require('./modules/payments/paymentRoutes'));
app.use('/api/billing', require('./modules/billing/billingRoutes'));
app.use('/api/notifications', require('./modules/notifications/notificationRoutes'));
app.use('/api/admin', require('./modules/admin/adminRoutes'));
app.use('/api/tasks', require('./modules/tasks/taskRoutes'));

app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/dashboard.html', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'dashboard.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error inesperado' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
