// config/session.js
const session = require('express-session');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'seu-segredo-aqui',
  resave: false,
  saveUninitialized: false,
});

module.exports = sessionConfig;