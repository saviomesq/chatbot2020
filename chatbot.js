const express = require('express');
const session = require('express-session');
const qrcode = require('qrcode');
const { Client } = require('whatsapp-web.js');

const app = express();
const port = process.env.PORT || 3000;

// Configuração da sessão
app.use(
  session({
    secret: 'seu-segredo-aqui', // Troque por uma chave segura
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware para parsing de formulários
app.use(express.urlencoded({ extended: true }));

// Mapas para armazenar clientes e QR codes por userId
const clients = new Map();
const qrCodes = new Map();

// Banco de dados simulado (substitua por MongoDB ou outro em produção)
const users = {
  'cliente1@email.com': { password: '12345', userId: 'cliente1' },
  'cliente2@email.com': { password: 'abcde', userId: 'cliente2' },
};

// Função para criar ou recuperar um cliente
function getOrCreateClient(userId) {
  if (clients.has(userId)) {
    return clients.get(userId);
  }

  const client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  let qrCodeData = null;

  client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      if (err) {
        console.error(`Erro ao gerar QR code para ${userId}:`, err);
        return;
      }
      qrCodes.set(userId, url);
      console.log(`QR code gerado para ${userId}! Acesse /qr/${userId}`);
    });
  });

  client.on('ready', () => {
    console.log(`Cliente ${userId} conectado ao WhatsApp!`);
  });

  // Lógica do chatbot (adaptada do seu código)
  client.on('message', async (msg) => {
    if (
      msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) &&
      msg.from.endsWith('@c.us')
    ) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      const contact = await msg.getContact();
      const name = contact.pushname;
      await client.sendMessage(
        msg.from,
        `Olá! ${name.split(' ')[0]}. Sou o assistente virtual da empresa Consultoria 20/20. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n🚀 1 - Quero melhorar minhas vendas e marketing\n🚀 2 - Preciso organizar a parte financeira da minha ótica\n🚀 3 - Quero otimizar a operação e gestão do meu negócio\n🚀 4 - Quero saber mais sobre a consultoria completa\n🚀 5 - Falar com um especialista`
      );
      await delay(3000);
      await chat.sendStateTyping();
      await delay(5000);
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        '✅ 1 - Melhorar Vendas e Marketing\n\nÓtima escolha! O marketing certo pode trazer mais clientes para sua ótica e aumentar as vendas. Aqui estão algumas estratégias que podem te ajudar:\n\n🔹 Divulgação no Instagram e WhatsApp\n\n🔹 Promoções estratégicas para atrair clientes\n\n🔹 Técnicas de vendas para converter mais'
      );
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, 'Link para agendamento de consultoria: https://site.com');
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        '✅ 2 - Organizar Finanças da Ótica\n\nManter o financeiro organizado é essencial para o crescimento do negócio. Com uma boa gestão, você evita prejuízos e garante lucro sustentável. Podemos te ajudar com:\n\n🔹 Precificação correta dos produtos\n\n🔹 Fluxo de caixa eficiente\n\n🔹 Controle de custos e lucratividade\n\n'
      );
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, 'Link para consultoria: https://site.com');
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        '✅ 3 - Otimizar a Gestão da Ótica\n\nUma gestão eficiente faz toda a diferença no sucesso da sua ótica. Aqui estão algumas áreas que podemos melhorar:\n\n🔹 Controle de estoque\n\n🔹 Atendimento ao cliente\n\n🔹 Treinamento de equipe\n\n'
      );
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, 'Link para consultoria: https://site.com');
    }

    if (msg.body === '4' && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        '✅ 4 - Saber Mais Sobre a Consultoria Completa\n\nOferecemos uma consultoria estratégica completa para transformar sua ótica! Com ela, ajudamos você a crescer de forma estruturada e lucrativa. Nosso serviço inclui:\n\n✔️ Análise do mercado e posicionamento da sua ótica\n\n✔️ Estratégias de vendas e marketing eficazes\n\n✔️ Gestão financeira e precificação inteligente\n\n✔️ Melhoria da experiência do cliente e fidelização\n\n'
      );
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(msg.from, 'Link para consultoria: https://site.com');
    }

    if (msg.body === '5' && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        '✅ 5 - Falar com um Especialista\n\nSe você deseja falar com um especialista, clique no link abaixo para agendar uma conversa gratuita com um de nossos consultores:\n\n👉 https://site.com'
      );
    }
  });

  client.initialize().catch((err) => {
    console.error(`Erro ao inicializar cliente ${userId}:`, err);
  });

  clients.set(userId, client);
  return client;
}

// Função de delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Rota principal (tela de login)
app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect(`/qr/${req.session.userId}`);
  }
  res.send(`
    <html>
      <head>
        <title>Consultoria 20/20</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color:rgb(74, 3, 167);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 1.5rem;
          }
          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
          }
          input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
          }
          button {
            width: 100%;
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
          }
          button:hover {
            background-color: #0056b3;
          }
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
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (user && user.password === password) {
    req.session.loggedIn = true;
    req.session.userId = user.userId;
    getOrCreateClient(user.userId); // Inicia o cliente para esse usuário
    res.redirect(`/qr/${user.userId}`);
  } else {
    res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h1 {
              color: #d9534f;
              margin-bottom: 1rem;
            }
            a {
              color: #007bff;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
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
});

// Rota para verificar se o QR code está disponível
app.get('/check-qr/:userId', (req, res) => {
  const { userId } = req.params;
  if (!req.session.loggedIn || req.session.userId !== userId) {
    return res.status(403).json({ qrReady: false });
  }
  const qrCodeData = qrCodes.get(userId);
  res.json({ qrReady: !!qrCodeData }); // Retorna true se o QR code existir
});


// Rota para exibir o QR code (protegida)
app.get('/qr/:userId', (req, res) => {
  const { userId } = req.params;

  if (!req.session.loggedIn || req.session.userId !== userId) {
    return res.redirect('/');
  }

  const qrCodeData = qrCodes.get(userId);
  if (!qrCodeData) {
    res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            h1 {
              color: #333;
              margin-bottom: 1rem;
            }
            p {
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Aguardando QR Code para ${userId}...</h1>
            <p>Por favor, aguarde. A página será recarregada automaticamente.</p>
          </div>
          <script>
            // Polling para verificar se o QR code está pronto
            async function checkQRCode() {
              try {
                const response = await fetch('/check-qr/${userId}');
                const data = await response.json();
                if (data.qrReady) {
                  window.location.reload(); // Recarrega a página quando o QR está pronto
                }
              } catch (error) {
                console.error('Erro ao verificar QR code:', error);
              }
            }
            setInterval(checkQRCode, 2000); // Verifica a cada 2 segundos
            checkQRCode(); // Verifica imediatamente ao carregar
          </script>
        </body>
      </html>
    `);
  } else {
    res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
              width: 100%;
              max-width: 500px;
            }
            h1 {
              color: #333;
              margin-bottom: 1rem;
            }
            img {
              max-width: 100%;
              margin: 1rem 0;
            }
            p {
              color: #555;
              margin-bottom: 1rem;
            }
            a {
              color: #007bff;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Escaneie o QR Code para ${userId}</h1>
            <img src="${qrCodeData}" alt="QR Code" />
            <p>Use o WhatsApp no seu celular para escanear o código acima.</p>
            <a href="/logout">Sair</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});