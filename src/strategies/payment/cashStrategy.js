module.exports = {
  execute: async payment => ({
    referencia: `CASH-${Date.now()}`,
    metodo: 'efectivo',
    estado: 'completado',
    ...payment
  })
};
