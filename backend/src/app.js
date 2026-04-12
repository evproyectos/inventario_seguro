const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { conectarDB } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const userRoutes = require('./routes/users.routes');
const auditRoutes = require('./routes/audit.routes');

const app = express();

conectarDB();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameSrc:   ["'none'"],
      objectSrc:  ["'none'"],
    },
  },
  frameguard:     { action: 'deny' },
  noSniff:        true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts:           { maxAge: 31536000, includeSubDomains: true },
}));

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/audit', auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend corriendo' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

module.exports = app;