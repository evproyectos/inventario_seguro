const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { conectarDB } = require('./config/database');

const app = express();

conectarDB();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend corriendo' });
});

module.exports = app;