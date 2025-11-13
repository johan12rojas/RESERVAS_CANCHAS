module.exports = {
  execute: async payment => ({
    referencia: `TR-${Math.random().toString(36).substring(2, 10)}`,
    metodo: 'transferencia',
    estado: 'pendiente',
    ...payment
  })
};
