const card = require('./cardStrategy');
const cash = require('./cashStrategy');
const transfer = require('./transferStrategy');

const strategies = {
  tarjeta: card,
  efectivo: cash,
  transferencia: transfer
};

const processPayment = async (method, payload) => {
  const strategy = strategies[method];
  if (!strategy) {
    throw new Error(`Método ${method} no soportado`);
  }

  return strategy.execute(payload);
};

module.exports = { processPayment };
