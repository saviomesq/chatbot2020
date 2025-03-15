// controllers/qrController.js
const qrCodes = new Map();
const User = require('../schema/User'); // Ajuste para '../models/User' se necessário

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
          <title>Consultoria 20/20 - QR Code</title>
          <style>
            body {
              font-family: 'Orbitron', Arial, sans-serif;
              margin: 0;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3') no-repeat center center fixed;
              background-size: cover;
              overflow: hidden;
              position: relative;
            }
            body::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, rgba(0, 71, 171, 0.5), rgba(147, 51, 234, 0.5));
              z-index: 1;
            }
            .container {
              position: relative;
              z-index: 2;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              padding: 2.5rem;
              border-radius: 15px;
              box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
              width: 100%;
              max-width: 500px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #00bfff;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
              margin-bottom: 1.5rem;
            }
            p {
              color: #e0e0e0;
              font-size: 1.1rem;
              margin-bottom: 2rem;
              letter-spacing: 1px;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
              p { font-size: 1rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Consultoria 20/20 🚀</h1>
            <p>Aguardando QR Code para ${userId}...</p>
            <p>Por favor, aguarde. Atualizando automaticamente.</p>
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
    res.send(`
      <html>
        <head>
          <title>Consultoria 20/20 - QR Code</title>
          <style>
            body {
              font-family: 'Orbitron', Arial, sans-serif;
              margin: 0;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3') no-repeat center center fixed;
              background-size: cover;
              overflow: hidden;
              position: relative;
            }
            body::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, rgba(0, 71, 171, 0.5), rgba(147, 51, 234, 0.5));
              z-index: 1;
            }
            .container {
              position: relative;
              z-index: 2;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              padding: 2.5rem;
              border-radius: 15px;
              box-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
              width: 100%;
              max-width: 600px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #00bfff;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
              margin-bottom: 1.5rem;
            }
            h2 {
              color: #00bfff;
              font-size: 1.5rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              text-shadow: 0 0 8px rgba(0, 191, 255, 0.5);
              margin: 2rem 0 1rem;
            }
            p {
              color: #e0e0e0;
              font-size: 1.1rem;
              margin-bottom: 2rem;
              letter-spacing: 1px;
            }
            img {
              max-width: 100%;
              border: 2px solid #00bfff;
              border-radius: 10px;
              box-shadow: 0 0 15px rgba(0, 191, 255, 0.5);
              transition: transform 0.3s ease;
              margin: 1rem 0;
            }
            img:hover {
              transform: scale(1.05);
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              color: #e0e0e0;
              font-size: 1rem;
              letter-spacing: 1px;
            }
            input {
              width: 100%;
              padding: 0.75rem;
              margin-bottom: 1.5rem;
              border: 1px solid rgba(0, 191, 255, 0.5);
              border-radius: 5px;
              background: rgba(255, 255, 255, 0.05);
              color: #fff;
              font-size: 1rem;
              box-sizing: border-box;
              transition: border 0.3s ease, box-shadow 0.3s ease;
            }
            input:focus {
              outline: none;
              border: 1px solid #00bfff;
              box-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
            }
            input::placeholder {
              color: rgba(255, 255, 255, 0.5);
            }
            button {
              width: 100%;
              padding: 0.75rem;
              background: linear-gradient(90deg, #00bfff, #9333ea);
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1.1rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              margin: 0.5rem 0;
            }
            button:hover {
              transform: scale(1.05);
              box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
            }
            a {
              display: inline-block;
              margin: 1rem 0.5rem;
              padding: 0.75rem 1.5rem;
              background: linear-gradient(90deg, #00bfff, #9333ea);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 1rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            a:hover {
              transform: scale(1.05);
              box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
            }
            #admin-menu, #add-user-form, #edit-messages-form {
              display: none;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
              h2 { font-size: 1.2rem; }
              p { font-size: 1rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <div id="qr-view">
              <h1>Consultoria 20/20 🚀</h1>
              <p>Escaneie o QR Code para ${userId}</p>
              <img src="${qrCodeData}" alt="QR Code" />
              <p>Use o WhatsApp no seu celular para escanear o código acima.</p>
              ${
                req.session.isAdmin
                  ? `<button onclick="showAdminMenu()">Gestão Admin</button>`
                  : ''
              }
              <a href="/logout">Sair</a>
            </div>
            ${
              req.session.isAdmin
                ? `
                  <div id="admin-menu">
                    <h1>Gestão Admin</h1>
                    <button onclick="showAddUser()">Adicionar Usuário</button>
                    <button onclick="showEditMessages()">Editar Mensagens</button>
                    <button onclick="showQRView()">Voltar ao QR Code</button>
                  </div>
                  <div id="add-user-form">
                    <h2>Adicionar Novo Usuário</h2>
                    <form method="POST" action="/add-user">
                      <label>Email:</label>
                      <input type="email" name="email" placeholder="Digite o email" required>
                      <label>Senha:</label>
                      <input type="password" name="password" placeholder="Digite a senha" required>
                      <label>ID do Usuário:</label>
                      <input type="text" name="userId" placeholder="Digite o ID" required>
                      <button type="submit">Adicionar Usuário</button>
                    </form>
                    <button onclick="showAdminMenu()">Voltar</button>
                  </div>
                  <div id="edit-messages-form">
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
                    <button onclick="showAdminMenu()">Voltar</button>
                  </div>
                `
                : ''
            }
          </div>
          <script>
            function showAdminMenu() {
              document.getElementById('qr-view').style.display = 'none';
              document.getElementById('admin-menu').style.display = 'block';
              document.getElementById('add-user-form').style.display = 'none';
              document.getElementById('edit-messages-form').style.display = 'none';
            }
            function showAddUser() {
              document.getElementById('qr-view').style.display = 'none';
              document.getElementById('admin-menu').style.display = 'none';
              document.getElementById('add-user-form').style.display = 'block';
              document.getElementById('edit-messages-form').style.display = 'none';
            }
            function showEditMessages() {
              document.getElementById('qr-view').style.display = 'none';
              document.getElementById('admin-menu').style.display = 'none';
              document.getElementById('add-user-form').style.display = 'none';
              document.getElementById('edit-messages-form').style.display = 'block';
            }
            function showQRView() {
              document.getElementById('qr-view').style.display = 'block';
              document.getElementById('admin-menu').style.display = 'none';
              document.getElementById('add-user-form').style.display = 'none';
              document.getElementById('edit-messages-form').style.display = 'none';
            }
          </script>
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