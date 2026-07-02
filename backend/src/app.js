const express = require('express');
const cors = require('cors');
require('express-async-errors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const farmsRoutes = require('./routes/farms');
const animalsRoutes = require('./routes/animals');
const treatmentsRoutes = require('./routes/treatments');
const prescriptionsRoutes = require('./routes/prescriptions');
const vaccinationsRoutes = require('./routes/vaccinations');
const diseaseReportsRoutes = require('./routes/diseasereports');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');
const blockchainRoutes = require('./routes/blockchain');
const reportsRoutes = require('./routes/reports');
const notificationsRoutes = require('./routes/notifications');
const verificationRoutes = require('./routes/verification');
const { initDatabase } = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/animals', animalsRoutes);
app.use('/api/treatments', treatmentsRoutes);
app.use('/api/vaccinations', vaccinationsRoutes);
app.use('/api/diseasereports', diseaseReportsRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/verification', verificationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

initDatabase().catch((err) => {
  // Log DB init errors but don't crash the server to allow local testing
  console.error('Unable to initialize database', err);
});

module.exports = app;
