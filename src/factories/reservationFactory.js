const buildReservation = ({ id_usuario, id_cancha, fecha_reserva }) => {
  if (!id_usuario || !id_cancha || !fecha_reserva) {
    throw new Error('id_usuario, id_cancha y fecha_reserva son obligatorios');
  }

  return {
    id_usuario,
    id_cancha,
    fecha_reserva,
    estado: 'pendiente'
  };
};

module.exports = { buildReservation };
