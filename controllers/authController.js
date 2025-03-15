// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../schema/User'); // Ajuste para '../models/User' se necessário

const getLogin = (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect(`/qr/${req.session.userId}`);
  }
  res.send(`
    <html>
      <head>
        <title>Consultoria 20/20 - Login</title>
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
            max-width: 450px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeIn 1s ease-in-out;
          }
          h1 {
            color: #00bfff;
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
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
          }
          button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 480px) {
            .container { padding: 1.5rem; max-width: 90%; }
            h1 { font-size: 1.5rem; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h1>Consultoria 20/20 🚀</h1>
          <form method="POST" action="/login">
            <label>Email:</label>
            <input type="email" name="email" placeholder="Digite seu email" required>
            <label>Senha:</label>
            <input type="password" name="password" placeholder="Digite sua senha" required>
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
            <title>Erro de Login</title>
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
                max-width: 450px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: fadeIn 1s ease-in-out;
                text-align: center;
              }
              h1 {
                color: #ff5555;
                font-size: 2rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
                margin-bottom: 1.5rem;
              }
              a {
                display: inline-block;
                margin-top: 1rem;
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
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @media (max-width: 480px) {
                .container { padding: 1.5rem; max-width: 90%; }
                h1 { font-size: 1.5rem; }
              }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
          </head>
          <body>
            <div class="container">
              <h1>Credenciais Inválidas</h1>
              <a href="/">Tentar Novamente</a>
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
    res.send(`
      <html>
        <head>
          <title>Erro no Servidor</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #ff5555;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Erro no Servidor</h1>
            <a href="/">Voltar</a>
          </div>
        </body>
      </html>
    `);
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
            <title>Erro ao Adicionar Usuário</title>
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
                max-width: 450px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: fadeIn 1s ease-in-out;
                text-align: center;
              }
              h1 {
                color: #ff5555;
                font-size: 2rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
                margin-bottom: 1.5rem;
              }
              a {
                display: inline-block;
                margin-top: 1rem;
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
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @media (max-width: 480px) {
                .container { padding: 1.5rem; max-width: 90%; }
                h1 { font-size: 1.5rem; }
              }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
          </head>
          <body>
            <div class="container">
              <h1>Email ou ID Já em Uso</h1>
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
          <title>Usuário Adicionado</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #00ff00;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Usuário Adicionado com Sucesso!</h1>
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao adicionar usuário:', err);
    res.send(`
      <html>
        <head>
          <title>Erro no Servidor</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #ff5555;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Erro no Servidor</h1>
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
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
          <title>Mensagens Atualizadas</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #00ff00;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Mensagens Atualizadas com Sucesso!</h1>
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao atualizar mensagens:', err);
    res.send(`
      <html>
        <head>
          <title>Erro no Servidor</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #ff5555;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Erro no Servidor</h1>
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
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
          a {
            display: block;
            margin: 1rem 0;
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
          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #e0e0e0;
            font-size: 1rem;
            letter-spacing: 1px;
          }
          input, textarea {
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
          input:focus, textarea:focus {
            outline: none;
            border: 1px solid #00bfff;
            box-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
          }
          input::placeholder, textarea::placeholder {
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
          }
          button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
          }
          .form-section {
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
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h1>Gestão Administrativa 🚀</h1>
          <a href="#add-user" onclick="toggleSection('add-user-form')">Adicionar Novo Usuário</a>
          <div id="add-user-form" class="form-section">
            <h2>Adicionar Usuário</h2>
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
          <a href="#edit-messages" onclick="toggleSection('edit-messages-form')">Editar Minhas Mensagens</a>
          <div id="edit-messages-form" class="form-section">
            <h2>Editar Mensagens</h2>
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
        <script>
          function toggleSection(sectionId) {
            const sections = document.getElementsByClassName('form-section');
            for (let section of sections) {
              section.style.display = section.id === sectionId && section.style.display !== 'block' ? 'block' : 'none';
            }
          }
        </script>
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
          <title>Gerenciar Usuários - Consultoria 20/20</title>
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
            ul {
              list-style: none;
              padding: 0;
              text-align: left;
              color: #e0e0e0;
              font-size: 1.1rem;
              letter-spacing: 1px;
            }
            li {
              margin: 1rem 0;
            }
            a {
              display: inline-block;
              margin-left: 1rem;
              padding: 0.5rem 1rem;
              background: linear-gradient(90deg, #00bfff, #9333ea);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 0.9rem;
              text-transform: uppercase;
              letter-spacing: 1px;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            a:hover {
              transform: scale(1.05);
              box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
            }
            .nav-links a {
              display: block;
              margin: 1rem 0;
              padding: 0.75rem 1.5rem;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
              ul { font-size: 1rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Gerenciar Usuários 🚀</h1>
            <ul>${userList}</ul>
            <div class="nav-links">
              <a href="/gestaoADM">Voltar à Gestão ADM</a>
              <a href="/logout">Sair</a>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.send(`
      <html>
        <head>
          <title>Erro no Servidor</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #ff5555;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Erro no Servidor</h1>
            <a href="/gestaoADM">Voltar</a>
          </div>
        </body>
      </html>
    `);
  }
};

const getEditUserMessages = async (req, res) => {
  if (!req.session.loggedIn || !req.session.isAdmin) {
    return res.redirect('/');
  }

  const { userId } = req.params;
  const user = await User.findOne({ userId });
  if (!user) {
    return res.send(`
      <html>
        <head>
          <title>Usuário Não Encontrado</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #ff5555;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Usuário Não Encontrado</h1>
            <a href="/admin/users">Voltar</a>
          </div>
        </body>
      </html>
    `);
  }

  const messages = user.customMessages || new Map();
  res.send(`
    <html>
      <head>
        <title>Editar Mensagens - ${userId}</title>
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
          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #e0e0e0;
            font-size: 1rem;
            letter-spacing: 1px;
          }
          input, textarea {
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
          input:focus, textarea:focus {
            outline: none;
            border: 1px solid #00bfff;
            box-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
          }
          input::placeholder, textarea::placeholder {
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
          }
          button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0, 191, 255, 0.8);
          }
          a {
            display: block;
            margin-top: 1rem;
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
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 480px) {
            .container { padding: 1.5rem; max-width: 90%; }
            h1 { font-size: 1.5rem; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h1>Editar Mensagens de ${userId} 🚀</h1>
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
          <title>Mensagens Atualizadas</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #00ff00;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Mensagens de ${userId} Atualizadas!</h1>
            <a href="/admin/users">Voltar</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Erro ao atualizar mensagens do usuário:', err);
    res.send(`
      <html>
        <head>
          <title>Erro no Servidor</title>
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
              max-width: 450px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              animation: fadeIn 1s ease-in-out;
              text-align: center;
            }
            h1 {
              color: #ff5555;
              font-size: 2rem;
              text-transform: uppercase;
              letter-spacing: 2px;
              text-shadow: 0 0 10px rgba(255, 85, 85, 0.7);
              margin-bottom: 1.5rem;
            }
            a {
              display: inline-block;
              margin-top: 1rem;
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 480px) {
              .container { padding: 1.5rem; max-width: 90%; }
              h1 { font-size: 1.5rem; }
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="container">
            <h1>Erro no Servidor</h1>
            <a href="/admin/users">Voltar</a>
          </div>
        </body>
      </html>
    `);
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = { getLogin, postLogin, addUser, updateMessages, getGestaoADM, getAdminUsers, getEditUserMessages, updateUserMessages, logout };