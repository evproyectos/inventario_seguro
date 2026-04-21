const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { conectarDB } = require('./config/database');
const { verificarToken } = require('./middleware/auth');
const { verificarOrigen } = require('./middleware/csrf');
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
      scriptSrc:  ["'self'", "'unsafe-inline'"],
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
app.use(verificarOrigen);

app.use('/api/docs',     verificarToken, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs-json', verificarToken, (req, res) => res.json(swaggerSpec));
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/audit',    auditRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend corriendo' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

module.exports = app;