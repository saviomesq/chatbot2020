// controllers/qrController.js
const qrCodes = new Map();
const User = require('../schema/User');

const getQR = async (req, res) => {
  const { userId } = req.params;

  if (!req.session.loggedIn || req.session.userId !== userId) {
    return res.redirect('/');
  }

  const qrCodeData = qrCodes.get(userId);
  const user = await User.findOne({ userId });
  const messages = user ? user.customMessages : new Map();

  if (!qrCodeData) {
    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; }
            h1 { color: #333; margin-bottom: 1rem; }
            p { color: #555; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Aguardando QR Code</h1>
            <p>Por favor, aguarde. A página será recarregada automaticamente.</p>
          </div>
          <script>
            async function checkQRCode() {
              try {
                const response = await fetch('/check-qr/${userId}');
                const data = await response.json();
                if (data.qrReady) {
                  window.location.reload();
                }
              } catch (error) {
                console.error('Erro ao verificar QR code:', error);
              }
            }
            setInterval(checkQRCode, 2000);
            checkQRCode();
          </script>
        </body>
      </html>
    `);
  } else {
    let adminContent = '';
    if (req.session.isAdmin) {
      adminContent = `
        <h2>Adicionar Novo Usuário</h2>
        <form method="POST" action="/add-user">
          <label>Email:</label>
          <input type="email" name="email" required>
          <label>Senha:</label>
          <input type="password" name="password" required>
          <label>ID do Usuário:</label>
          <input type="text" name="userId" required>
          <button type="submit">Adicionar Usuário</button>
        </form>
        <h2>Editar Minhas Mensagens</h2>
        <form method="POST" action="/update-messages">
          <label>Saudação:</label>
          <input type="text" name="greeting" value="${messages.get('greeting') || ''}" required>
          <label>Opção 1:</label>
          <input type="text" name="option1" value="${messages.get('option1') || ''}" required>
          <label>Opção 2:</label>
          <input type="text" name="option2" value="${messages.get('option2') || ''}" required>
          <label>Opção 3:</label>
          <input type="text" name="option3" value="${messages.get('option3') || ''}" required>
          <label>Opção 4:</label>
          <input type="text" name="option4" value="${messages.get('option4') || ''}" required>
          <label>Opção 5:</label>
          <input type="text" name="option5" value="${messages.get('option5') || ''}" required>
          <button type="submit">Atualizar Minhas Mensagens</button>
        </form>
        <a href="/admin/users">Gerenciar Usuários</a>
      `;
    }

    res.send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; width: 100%; max-width: 500px; }
            h1 { color: #333; margin-bottom: 1rem; }
            h2 { color: #333; margin-top: 2rem; margin-bottom: 1rem; }
            img { max-width: 100%; margin: 1rem 0; }
            p { color: #555; margin-bottom: 1rem; }
            a { color: #007bff; text-decoration: none; margin: 0.5rem; display: inline-block; }
            a:hover { text-decoration: underline; }
            label { display: block; margin-bottom: 0.5rem; color: #555; }
            input { width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
            button { width: 100%; padding: 0.75rem; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
            button:hover { background-color: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Escaneie o QR Code para ${userId}</h1>
            <img src="${qrCodeData}" alt="QR Code" />
            <p>Use o WhatsApp no seu celular para escanear o código acima.</p>
            ${adminContent}
            <a href="/logout">Sair</a>
          </div>
        </body>
      </html>
    `);
  }
};

const checkQR = (req, res) => {
  const { userId } = req.params;
  if (!req.session.loggedIn || req.session.userId !== userId) {
    return res.status(403).json({ qrReady: false });
  }
  const qrCodeData = qrCodes.get(userId);
  res.json({ qrReady: !!qrCodeData });
};

module.exports = { getQR, checkQR, qrCodes };