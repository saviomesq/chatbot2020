// app.js
const express = require('express');
const { connectDB } = require('./config/db');
const sessionConfig = require('./config/session');
const routes = require('./routes/index');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Conectar ao MongoDB
connectDB();

// Configuração do middleware
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

// Rotas
app.use('/', routes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});