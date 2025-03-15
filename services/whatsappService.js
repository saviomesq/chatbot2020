// services/whatsappService.js
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { delay } = require('../utils/delay');
const { qrCodes } = require('../controllers/qrController');
const User = require('../schema/User'); // Corrigido de '../schema/User' para '../models/User'

const clients = new Map();
const userStates = new Map(); // Mapa para rastrear o estado do usuário

async function getOrCreateClient(userId) {
  if (clients.has(userId)) {
    return clients.get(userId);
  }

  const client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

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

  client.on('message', async (msg) => {
    const user = await User.findOne({ userId });
    const messages = user ? user.customMessages : new Map();
    const chatId = msg.from; // Identificador único da conversa
    const currentState = userStates.get(chatId) || { level: 'main' }; // Estado padrão é o menu principal

    // Menu principal
    if (
      msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|0)/i) &&
      msg.from.endsWith('@c.us')
    ) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      const contact = await msg.getContact();
      const name = contact.pushname || 'Usuário';
      const greeting = messages.get('greeting') || 'Olá! Bem-vindo à (.....), sua ótica de confiança! 👓✨';
      await client.sendMessage(
        msg.from,
        `${greeting} ${name.split(' ')[0]}!\n\nComo posso te ajudar hoje?\n\n` +
        `🚀 1 - ${messages.get('option1')?.text || 'Comprar óculos'}\n` +
        `🚀 2 - ${messages.get('option2')?.text || 'Agendar um exame de vista'}\n` +
        `🚀 3 - ${messages.get('option3')?.text || 'Consultar minhas compras'}\n` +
        `🚀 4 - ${messages.get('option4')?.text || 'Falar com um atendente'}\n` +
        `🚀 5 - ${messages.get('option5')?.text || 'Saber mais sobre nossas promoções'}\n` +
        `🚀 6 - ${messages.get('option6')?.text || 'Falar sobre nossos serviços (reparos, lentes, etc.)'}\n\n` +
        `Digite o número da opção ou escreva o que precisa!`
      );
      userStates.set(chatId, { level: 'main' }); // Volta ao menu principal
    }

    // Opções do menu principal
    else if (msg.body.match(/^[1-6]$/) && msg.from.endsWith('@c.us') && currentState.level === 'main') {
      const option = parseInt(msg.body);
      const optionKey = `option${option}`;
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);

      if (option === 1) {
        const suboptions = messages.get(optionKey)?.suboptions || ['Óculos de grau', 'Óculos de sol', 'Procurar por uma marca específica'];
        await client.sendMessage(
          msg.from,
          `✅ ${messages.get(optionKey)?.text || 'Comprar óculos'}\n\nVocê está em busca de óculos novos? Temos modelos incríveis!\n` +
          suboptions.map((opt, idx) => `${idx + 1} - ${opt}`).join('\n') +
          `\n\nDigite o número da subopção (ex.: 1, 2, 3)`
        );
        userStates.set(chatId, { level: 'submenu', option: optionKey });
      } else if (option === 2) {
        const suboptions = messages.get(optionKey)?.suboptions || ['Manhã', 'Tarde'];
        await client.sendMessage(
          msg.from,
          `✅ ${messages.get(optionKey)?.text || 'Agendar um exame de vista'}\n\nQue ótimo que deseja agendar um exame de vista! Quando gostaria de marcar?\n` +
          suboptions.map((opt, idx) => `${idx + 1} - ${opt}`).join('\n') +
          `\n\nDigite o número da subopção (ex.: 1, 2)`
        );
        userStates.set(chatId, { level: 'submenu', option: optionKey });
      } else if (option === 3) {
        await client.sendMessage(
          msg.from,
          `✅ ${messages.get(optionKey)?.text || 'Consultar minhas compras'}\n\nPara consultar suas compras, por favor, informe:\n🆔 Seu CPF ou número do pedido.`
        );
        userStates.set(chatId, { level: 'awaiting_cpf_or_order', option: optionKey });
      } else if (option === 4) {
        await client.sendMessage(
          msg.from,
          `✅ ${messages.get(optionKey)?.text || 'Falar com um atendente'}\n\nPerfeito! Um de nossos atendentes entrará em contato em breve. Aguarde um momento! ⏳\n\n🔙 Digite 0 para voltar ao menu principal`
        );
        userStates.set(chatId, { level: 'main' });
      } else if (option === 5) {
        const suboptions = messages.get(optionKey)?.suboptions || ['10% OFF na compra de óculos de grau', '20% OFF em óculos de sol', 'Frete grátis para compras acima de R$200'];
        await client.sendMessage(
          msg.from,
          `✅ ${messages.get(optionKey)?.text || 'Saber mais sobre nossas promoções'}\n\nAqui estão algumas das promoções que temos no momento:\n` +
          suboptions.map((opt, idx) => `${idx + 1} - ${opt}`).join('\n') +
          `\n\nGostou de alguma? Digite o número da promoção para mais informações!\n🔙 Digite 0 para voltar ao menu principal`
        );
        userStates.set(chatId, { level: 'submenu', option: optionKey });
      } else if (option === 6) {
        const suboptions = messages.get(optionKey)?.suboptions || ['Reparos de óculos', 'Troca de lentes', 'Consultoria personalizada'];
        await client.sendMessage(
          msg.from,
          `✅ ${messages.get(optionKey)?.text || 'Falar sobre nossos serviços (reparos, lentes, etc.)'}\n\nGostaria de saber mais sobre nossos serviços? Oferecemos:\n` +
          suboptions.map((opt, idx) => `${idx + 1} - ${opt}`).join('\n') +
          `\n\nEscolha um dos serviços digitando o número (ex.: 1, 2, 3)\n🔙 Digite 0 para voltar ao menu principal`
        );
        userStates.set(chatId, { level: 'submenu', option: optionKey });
      }
    }

    // Respostas às subopções
    else if (msg.body.match(/^[1-9]$/) && msg.from.endsWith('@c.us') && currentState.level === 'submenu') {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      const optionKey = currentState.option;
      const suboptions = messages.get(optionKey)?.suboptions || [];
      const subIndex = parseInt(msg.body) - 1;

      if (optionKey === 'option1') { // Comprar óculos
        if (subIndex === 0) {
          await client.sendMessage(
            msg.from,
            `Ótima escolha! Nossos consultores estão prontos para te ajudar a encontrar o modelo ideal. Aguarde um instante, já vamos te encaminhar para um consultor de vendas. 😊\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else if (subIndex === 1) {
          await client.sendMessage(
            msg.from,
            `Excelente escolha! 😎 Em instantes, um de nossos consultores entrará em contato para te apresentar os modelos disponíveis e tirar suas dúvidas.\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else if (subIndex === 2) {
          await client.sendMessage(
            msg.from,
            `Nos informe a marca que deseja e um consultor te ajudará a verificar os modelos disponíveis. Em breve, um especialista falará com você! 🔍`
          );
        } else {
          await client.sendMessage(
            msg.from,
            `Subopção inválida. Por favor, escolha um número válido ou diga "Oi" para voltar ao menu principal.`
          );
          userStates.set(chatId, { level: 'main' });
          return;
        }
      } else if (optionKey === 'option2') { // Agendar exame de vista
        if (subIndex === 0 || subIndex === 1) {
          await client.sendMessage(
            msg.from,
            `Perfeito! Vamos confirmar a disponibilidade para o período escolhido. Um de nossos atendentes entrará em contato em breve para finalizar o agendamento. Aguarde um momento! ⏳\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else {
          await client.sendMessage(
            msg.from,
            `Subopção inválida. Por favor, escolha um número válido ou diga "Oi" para voltar ao menu principal.`
          );
          userStates.set(chatId, { level: 'main' });
          return;
        }
      } else if (optionKey === 'option5') { // Promoções
        if (subIndex >= 0 && subIndex < suboptions.length) {
          await client.sendMessage(
            msg.from,
            `Você escolheu: ${suboptions[subIndex]}\n\nFale com um de nossos atendentes para mais detalhes sobre essa promoção! Aguarde um momento.\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else {
          await client.sendMessage(
            msg.from,
            `Subopção inválida. Por favor, escolha um número válido ou diga "Oi" para voltar ao menu principal.`
          );
          userStates.set(chatId, { level: 'main' });
          return;
        }
      } else if (optionKey === 'option6') { // Serviços
        if (subIndex === 0) {
          await client.sendMessage(
            msg.from,
            `Podemos te ajudar! Nos informe qual o problema com seus óculos e um especialista entrará em contato para oferecer a melhor solução.\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else if (subIndex === 1) {
          await client.sendMessage(
            msg.from,
            `Certo! Para te ajudar melhor, um consultor especializado entrará em contato para entender sua necessidade e indicar a melhor opção. Aguarde um momento! 😊\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else if (subIndex === 2) {
          await client.sendMessage(
            msg.from,
            `Adoramos ajudar nossos clientes a encontrarem o modelo ideal! 👓 Em breve, um consultor falará com você para entender seu estilo e te ajudar na escolha perfeita!\n\n🔙 Digite 0 para voltar ao menu principal`
          );
        } else {
          await client.sendMessage(
            msg.from,
            `Subopção inválida. Por favor, escolha um número válido ou diga "Oi" para voltar ao menu principal.`
          );
          userStates.set(chatId, { level: 'main' });
          return;
        }
      }
      userStates.set(chatId, { level: 'main' }); // Volta ao menu principal após resposta
    }

    // Resposta ao CPF ou número do pedido (opção 3)
    else if (currentState.level === 'awaiting_cpf_or_order' && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        `Estamos verificando as informações do seu pedido... 📦 Aguarde um instante. Caso precise de ajuda, um de nossos atendentes estará disponível para falar com você em breve!\n\n🔙 Digite 0 para voltar ao menu principal`
      );
      userStates.set(chatId, { level: 'main' });
    }

    // Voltar ao menu principal com "0"
    else if (msg.body === '0' && msg.from.endsWith('@c.us')) {
      await client.sendMessage(
        msg.from,
        `Voltando ao menu principal... Diga "Oi" para começar novamente!`
      );
      userStates.set(chatId, { level: 'main' });
    }

    // Caso o usuário envie algo inválido
    else if (msg.from.endsWith('@c.us') && !msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i)) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      await client.sendMessage(
        msg.from,
        `Opção inválida. Para voltar ao menu principal, diga "Oi".`
      );
    }
  });

  client.initialize().catch((err) => {
    console.error(`Erro ao inicializar cliente ${userId}:`, err);
  });

  clients.set(userId, client);
  return client;
}

module.exports = { getOrCreateClient };