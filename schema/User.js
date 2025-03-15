// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  customMessages: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: () => new Map([
      ['greeting', 'Olá! Bem-vindo à (.....), sua ótica de confiança! 👓✨'],
      ['option1', { text: 'Comprar óculos', suboptions: ['Óculos de grau', 'Óculos de sol', 'Procurar por uma marca específica'] }],
      ['option2', { text: 'Agendar um exame de vista', suboptions: ['Manhã', 'Tarde'] }],
      ['option3', { text: 'Consultar minhas compras', suboptions: [] }],
      ['option4', { text: 'Falar com um atendente', suboptions: [] }],
      ['option5', { text: 'Saber mais sobre nossas promoções', suboptions: ['10% OFF na compra de óculos de grau', '20% OFF em óculos de sol', 'Frete grátis para compras acima de R$200'] }],
      ['option6', { text: 'Falar sobre nossos serviços (reparos, lentes, etc.)', suboptions: ['Reparos de óculos', 'Troca de lentes', 'Consultoria personalizada'] }],
    ]),
  },
});

module.exports = mongoose.model('User', userSchema);