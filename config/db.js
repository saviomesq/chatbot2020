// config/db.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB com sucesso!');
    await createInitialUsers();
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

async function createInitialUsers() {
  const usersToCreate = [
    { email: 'cliente1@email.com', password: '12345', userId: 'cliente1', isAdmin: false },
    { email: 'admin@email.com', password: 'admin123', userId: 'admin', isAdmin: true },
  ];

  for (const user of usersToCreate) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      email: user.email,
      password: hashedPassword,
      userId: user.userId,
      isAdmin: user.isAdmin,
    });
    await newUser.save().catch((err) => {
      if (err.code === 11000) {
        console.log(`Usuário ${user.email} já existe`);
      } else {
        console.error('Erro ao criar usuário:', err);
      }
    });
  }
  console.log('Usuários iniciais criados!');
}

module.exports = { connectDB };