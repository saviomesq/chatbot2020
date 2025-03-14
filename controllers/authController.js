// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

const getLogin = (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect(`/qr/${req.session.userId}`);
  }
  res.send(`
    <html>
      <head>
        <title>Consultoria 20/20</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: rgb(74, 3, 167); display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; }
          h1 { color: #333; text-align: center; margin-bottom: 1.5rem; }
          label { display: block; margin-bottom: 0.5rem; color: #555; }
          input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
          button { width: 100%; padding: 0.75rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
          button:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Login - Consultoria 20/20 🚀</h1>
          <form method="POST" action="/login">
            <label>Email:</label>
            <input type="email" name="email" required>
            <label>Senha:</label>
            <input type="password" name="password" required>
            <button type="submit">Entrar</button>
          </form>
        </div>
      </body>
    </html>
  `);
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; }
              h1 { color: #d9534f; margin-bottom: 1rem; }
              a { color: #007bff; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Credenciais inválidas</h1>
              <a href="/">Tentar novamente</a>
            </div>
          </body>
        </html>
      `);
    }

    req.session.loggedIn = true;
    req.session.userId = user.userId;
    req.session.isAdmin = user.isAdmin;
    require('../services/whatsappService').getOrCreateClient(user.userId);
    res.redirect(`/qr/${user.userId}`);
  } catch (err) {
    console.error('Erro no login:', err);
    res.send('<html><body><h1>Erro no servidor</h1><a href="/">Voltar</a></body></html>');
  }
};

const addUser = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  const { email, password, userId } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { userId }] });
    if (existingUser) {
      return res.send(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; }
              h1 { color: #d9534f; margin-bottom: 1rem; }
              a { color: #007bff; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email ou ID já em uso</h1>
              <a href="/qr/${req.session.userId}">Voltar</a>
            </div>
          </body>
        </html>
      `);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, userId, isAdmin: false });
    await newUser.save();

    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; }
            h1 { color: #28a745; margin-bottom: 1rem; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Usuário adicionado com sucesso!</h1>
            <a href="/qr/${req.session.userId}">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao adicionar usuário:', err);
    res.send(`<html><body><h1>Erro no servidor</h1><a href="/qr/${req.session.userId}">Voltar</a></body></html>`);
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = { getLogin, postLogin, addUser, logout };