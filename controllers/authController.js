// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../schema/User'); 

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
              <a href="/gestaoADM">Voltar</a>
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
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao adicionar usuário:', err);
    res.send(`<html><body><h1>Erro no servidor</h1><a href="/gestaoADM">Voltar</a></body></html>`);
  }
};

const updateMessages = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  const { greeting, option1_text, option1_suboptions, option2_text, option2_suboptions, option3_text, option3_suboptions, option4_text, option4_suboptions, option5_text, option5_suboptions } = req.body;
  const userId = req.session.userId;

  try {
    await User.updateOne(
      { userId },
      {
        $set: {
          'customMessages.greeting': greeting,
          'customMessages.option1': { text: option1_text, suboptions: option1_suboptions.split('\n').filter(Boolean) },
          'customMessages.option2': { text: option2_text, suboptions: option2_suboptions.split('\n').filter(Boolean) },
          'customMessages.option3': { text: option3_text, suboptions: option3_suboptions.split('\n').filter(Boolean) },
          'customMessages.option4': { text: option4_text, suboptions: option4_suboptions.split('\n').filter(Boolean) },
          'customMessages.option5': { text: option5_text, suboptions: option5_suboptions.split('\n').filter(Boolean) },
        },
      }
    );
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
            <h1>Mensagens atualizadas com sucesso!</h1>
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao atualizar mensagens:', err);
    res.send(`<html><body><h1>Erro no servidor</h1><a href="/gestaoADM">Voltar</a></body></html>`);
  }
};

const getGestaoADM = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  const userId = req.session.userId;
  const user = await User.findOne({ userId });
  const messages = user ? user.customMessages : new Map();

  res.send(`
    <html>
      <head>
        <title>Gestão ADM - Consultoria 20/20</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; width: 100%; max-width: 600px; }
          h1 { color: #333; margin-bottom: 1.5rem; }
          h2 { color: #333; margin-top: 2rem; margin-bottom: 1rem; }
          a { color: #007bff; text-decoration: none; display: block; margin: 1rem 0; font-size: 1.1rem; }
          a:hover { text-decoration: underline; }
          label { display: block; margin-bottom: 0.5rem; color: #555; }
          input, textarea { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
          button { width: 100%; padding: 0.75rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
          button:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Gestão Administrativa</h1>
          <a href="#add-user" onclick="document.getElementById('add-user-form').style.display='block'; return false;">Adicionar Novo Usuário</a>
          <div id="add-user-form" style="display: none;">
            <form method="POST" action="/add-user">
              <label>Email:</label>
              <input type="email" name="email" required>
              <label>Senha:</label>
              <input type="password" name="password" required>
              <label>ID do Usuário:</label>
              <input type="text" name="userId" required>
              <button type="submit">Adicionar Usuário</button>
            </form>
          </div>
          <a href="#edit-messages" onclick="document.getElementById('edit-messages-form').style.display='block'; return false;">Editar Minhas Mensagens</a>
          <div id="edit-messages-form" style="display: none;">
            <form method="POST" action="/update-messages">
              <label>Saudação:</label>
              <input type="text" name="greeting" value="${messages.get('greeting') || 'Olá! Sou o assistente virtual.'}" required>
              <label>Opção 1 (Texto):</label>
              <input type="text" name="option1_text" value="${messages.get('option1')?.text || 'Quero melhorar minhas vendas'}" required>
              <label>Subopções 1 (uma por linha):</label>
              <textarea name="option1_suboptions" rows="3">${(messages.get('option1')?.suboptions || []).join('\n')}</textarea>
              <label>Opção 2 (Texto):</label>
              <input type="text" name="option2_text" value="${messages.get('option2')?.text || 'Preciso organizar minhas finanças'}" required>
              <label>Subopções 2 (uma por linha):</label>
              <textarea name="option2_suboptions" rows="3">${(messages.get('option2')?.suboptions || []).join('\n')}</textarea>
              <label>Opção 3 (Texto):</label>
              <input type="text" name="option3_text" value="${messages.get('option3')?.text || 'Quero otimizar minha gestão'}" required>
              <label>Subopções 3 (uma por linha):</label>
              <textarea name="option3_suboptions" rows="3">${(messages.get('option3')?.suboptions || []).join('\n')}</textarea>
              <label>Opção 4 (Texto):</label>
              <input type="text" name="option4_text" value="${messages.get('option4')?.text || 'Quero saber mais sobre a consultoria'}" required>
              <label>Subopções 4 (uma por linha):</label>
              <textarea name="option4_suboptions" rows="3">${(messages.get('option4')?.suboptions || []).join('\n')}</textarea>
              <label>Opção 5 (Texto):</label>
              <input type="text" name="option5_text" value="${messages.get('option5')?.text || 'Falar com um especialista'}" required>
              <label>Subopções 5 (uma por linha):</label>
              <textarea name="option5_suboptions" rows="3">${(messages.get('option5')?.suboptions || []).join('\n')}</textarea>
              <button type="submit">Atualizar Mensagens</button>
            </form>
          </div>
          <a href="/admin/users">Gerenciar Usuários</a>
          <a href="/qr/${userId}">Voltar ao QR Code</a>
          <a href="/logout">Sair</a>
        </div>
      </body>
    </html>
  `);
};

const getAdminUsers = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  try {
    const users = await User.find({}, 'userId email isAdmin');
    let userList = '';
    for (const user of users) {
      userList += `
        <li>
          ${user.userId} (${user.email}) - ${user.isAdmin ? 'Admin' : 'Usuário'}
          <a href="/admin/users/edit/${user.userId}">Editar Mensagens</a>
        </li>
      `;
    }

    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; width: 100%; max-width: 600px; }
            h1 { color: #333; margin-bottom: 1rem; }
            ul { list-style: none; padding: 0; text-align: left; }
            li { margin: 1rem 0; }
            a { color: #007bff; text-decoration: none; margin-left: 1rem; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Gerenciar Usuários</h1>
            <ul>${userList}</ul>
            <a href="/gestaoADM">Voltar à Gestão ADM</a>
            <a href="/logout">Sair</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.send(`<html><body><h1>Erro no servidor</h1><a href="/gestaoADM">Voltar</a></body></html>`);
  }
};

const getEditUserMessages = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  const { userId } = req.params;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.send(`<html><body><h1>Usuário não encontrado</h1><a href="/admin/users">Voltar</a></body></html>`);
  }

  const messages = user.customMessages || new Map();
  res.send(`
    <html>
      <head>
        <title>Editar Mensagens - ${userId}</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; width: 100%; max-width: 600px; }
          h1 { color: #333; margin-bottom: 1.5rem; }
          label { display: block; margin-bottom: 0.5rem; color: #555; }
          input, textarea { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
          button { width: 100%; padding: 0.75rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
          button:hover { background-color: #0056b3; }
          a { color: #007bff; text-decoration: none; display: block; margin-top: 1rem; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Editar Mensagens de ${userId}</h1>
          <form method="POST" action="/admin/update-user-messages">
            <input type="hidden" name="userId" value="${userId}">
            <label>Saudação:</label>
            <input type="text" name="greeting" value="${messages.get('greeting') || 'Olá! Sou o assistente virtual.'}" required>
            <label>Opção 1 (Texto):</label>
            <input type="text" name="option1_text" value="${messages.get('option1')?.text || 'Quero melhorar minhas vendas'}" required>
            <label>Subopções 1 (uma por linha):</label>
            <textarea name="option1_suboptions" rows="3">${(messages.get('option1')?.suboptions || []).join('\n')}</textarea>
            <label>Opção 2 (Texto):</label>
            <input type="text" name="option2_text" value="${messages.get('option2')?.text || 'Preciso organizar minhas finanças'}" required>
            <label>Subopções 2 (uma por linha):</label>
            <textarea name="option2_suboptions" rows="3">${(messages.get('option2')?.suboptions || []).join('\n')}</textarea>
            <label>Opção 3 (Texto):</label>
            <input type="text" name="option3_text" value="${messages.get('option3')?.text || 'Quero otimizar minha gestão'}" required>
            <label>Subopções 3 (uma por linha):</label>
            <textarea name="option3_suboptions" rows="3">${(messages.get('option3')?.suboptions || []).join('\n')}</textarea>
            <label>Opção 4 (Texto):</label>
            <input type="text" name="option4_text" value="${messages.get('option4')?.text || 'Quero saber mais sobre a consultoria'}" required>
            <label>Subopções 4 (uma por linha):</label>
            <textarea name="option4_suboptions" rows="3">${(messages.get('option4')?.suboptions || []).join('\n')}</textarea>
            <label>Opção 5 (Texto):</label>
            <input type="text" name="option5_text" value="${messages.get('option5')?.text || 'Falar com um especialista'}" required>
            <label>Subopções 5 (uma por linha):</label>
            <textarea name="option5_suboptions" rows="3">${(messages.get('option5')?.suboptions || []).join('\n')}</textarea>
            <button type="submit">Atualizar Mensagens</button>
          </form>
          <a href="/admin/users">Voltar</a>
        </div>
      </body>
    </html>
  `);
};

const updateUserMessages = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  const { userId, greeting, option1_text, option1_suboptions, option2_text, option2_suboptions, option3_text, option3_suboptions, option4_text, option4_suboptions, option5_text, option5_suboptions } = req.body;

  try {
    await User.updateOne(
      { userId },
      {
        $set: {
          'customMessages.greeting': greeting,
          'customMessages.option1': { text: option1_text, suboptions: option1_suboptions.split('\n').filter(Boolean) },
          'customMessages.option2': { text: option2_text, suboptions: option2_suboptions.split('\n').filter(Boolean) },
          'customMessages.option3': { text: option3_text, suboptions: option3_suboptions.split('\n').filter(Boolean) },
          'customMessages.option4': { text: option4_text, suboptions: option4_suboptions.split('\n').filter(Boolean) },
          'customMessages.option5': { text: option5_text, suboptions: option5_suboptions.split('\n').filter(Boolean) },
        },
      }
    );
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
            <h1>Mensagens do usuário ${userId} atualizadas com sucesso!</h1>
            <a href="/admin/users">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao atualizar mensagens do usuário:', err);
    res.send(`<html><body><h1>Erro no servidor</h1><a href="/admin/users">Voltar</a></body></html>`);
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = { getLogin, postLogin, addUser, updateMessages, getGestaoADM, getAdminUsers, getEditUserMessages, updateUserMessages, logout };