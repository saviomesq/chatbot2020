const http = require('http');
const port = process.env.PORT || 3000;
const qrcode = require('qrcode');
const { Client } = require('whatsapp-web.js');

const client = new Client();
let qrCodeData = null; 
client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Erro ao gerar QR code:', err);
      return;
    }
    qrCodeData = url; 
    console.log('QR code gerado! Acesse a URL para visualizar.');
  });
});

client.on('ready', () => {
  console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const requestHandler = (request, response) => {
  if (!qrCodeData) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`
      <html>
        <body>
          <h1>Aguardando QR Code...</h1>
          <p>Atualize a página em alguns segundos.</p>
        </body>
      </html>
    `);
    return;
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end(`
    <html>
      <body>
        <h1>Escaneie o QR Code</h1>
        <img src="${qrCodeData}" alt="QR Code" />
        <p>Use o WhatsApp no seu celular para escanear o código acima.</p>
      </body>
    </html>
  `);
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('Algo deu errado:', err);
  }
  console.log(`Servidor rodando na porta ${port}`);
});

const delay = ms => new Promise(res => setTimeout(res, ms));


client.on('message', async msg => {

    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000); 
        const contact = await msg.getContact();
        const name = contact.pushname; 
        await client.sendMessage(msg.from,'Olá! '+ name.split(" ")[0] + '. Sou o assistente virtual da empresa Consultoria 20/20. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n🚀 1 - Quero melhorar minhas vendas e marketing\n🚀 2 - Preciso organizar a parte financeira da minha ótica\n🚀 3 - Quero otimizar a operação e gestão do meu negócio\n🚀 4 - Quero saber mais sobre a consultoria completa\n🚀 5 - Falar com um especialista'); //Primeira mensagem de texto5 - Falar com um especialista
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(5000); 
        
    }




    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await client.sendMessage(msg.from, '✅ 1 - Melhorar Vendas e Marketing\n\nÓtima escolha! O marketing certo pode trazer mais clientes para sua ótica e aumentar as vendas. Aqui estão algumas estratégias que podem te ajudar:\n\n🔹 Divulgação no Instagram e WhatsApp\n\n🔹 Promoções estratégicas para atrair clientes\n\n🔹 Técnicas de vendas para converter mais');

        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000); 
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para agendamento de consultoria: https://site.com');


    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); 
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, '✅ 2 - Organizar Finanças da Ótica\n\nManter o financeiro organizado é essencial para o crescimento do negócio. Com uma boa gestão, você evita prejuízos e garante lucro sustentável. Podemos te ajudar com:\n\n🔹 Precificação correta dos produtos\n\n🔹 Fluxo de caixa eficiente\n\n🔹 Controle de custos e lucratividade\n\n');

        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para consultoria: https://site.com');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); 
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, '✅ 3 - Otimizar a Gestão da Ótica\n\nUma gestão eficiente faz toda a diferença no sucesso da sua ótica. Aqui estão algumas áreas que podemos melhorar:\n\n🔹 Controle de estoque\n\n🔹 Atendimento ao cliente\n\n🔹 Treinamento de equipe\n\n');
        
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para consultoria: https://site.com');

    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await client.sendMessage(msg.from, '✅ 4 - Saber Mais Sobre a Consultoria Completa\n\nOferecemos uma consultoria estratégica completa para transformar sua ótica! Com ela, ajudamos você a crescer de forma estruturada e lucrativa. Nosso serviço inclui:\n\n✔️ Análise do mercado e posicionamento da sua ótica\n\n✔️ Estratégias de vendas e marketing eficazes\n\n✔️ Gestão financeira e precificação inteligente\n\n✔️ Melhoria da experiência do cliente e fidelização\n\n');


        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para consultoria: https://site.com');


    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await client.sendMessage(msg.from, '✅ 5 - Falar com um Especialista\n\nSe você deseja falar com um especialista, clique no link abaixo para agendar uma conversa gratuita com um de nossos consultores:\n\n👉 https://site.com');

    }

});