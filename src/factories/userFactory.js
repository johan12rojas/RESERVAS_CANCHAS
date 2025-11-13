const PASSWORD_COLUMN = 'contrase\u00f1a';

const buildUser = ({ nombre, email, password, tipo_usuario }) => {
  if (!nombre || !email || !password) {
    throw new Error('Nombre, email y contrasena son obligatorios');
  }

  return {
    nombre,
    email: email.toLowerCase(),
    [PASSWORD_COLUMN]: password,
    tipo_usuario: tipo_usuario || 'normal'
  };
};

module.exports = { buildUser, PASSWORD_COLUMN };
