const { v4: uuid } = require('uuid');

module.exports = {
  execute: async payment => {
    return {
      referencia: uuid(),
      metodo: 'tarjeta',
      estado: 'completado',
      ...payment
    };
  }
};
