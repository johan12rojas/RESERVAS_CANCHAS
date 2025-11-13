const fieldModel = require('./fieldModel');

const buildError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getDefaultImage = capacidad => {
  if (capacidad === 5) return 'assets/futbol5.webp';
  if (capacidad === 7) return 'assets/futbol7.webp';
  return 'assets/futbol11.webp';
};

const detectMimeFromBuffer = buffer => {
  if (!buffer || !buffer.length) return 'image/webp';
  const signature = buffer.slice(0, 12);
  if (signature[0] === 0x89 && signature[1] === 0x50 && signature[2] === 0x4e && signature[3] === 0x47) {
    return 'image/png';
  }
  if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    signature[0] === 0x52 &&
    signature[1] === 0x49 &&
    signature[2] === 0x46 &&
    signature[3] === 0x46 &&
    signature[8] === 0x57 &&
    signature[9] === 0x45 &&
    signature[10] === 0x42 &&
    signature[11] === 0x50
  ) {
    return 'image/webp';
  }
  return 'image/webp';
};

const isLikelyPath = value => typeof value === 'string' && !value.startsWith('data:') && !value.startsWith('http');

const sanitizeField = field => {
  if (!field) return null;
  const { imagen, ...rest } = field;
  let imagenUrl = null;
  if (imagen) {
    if (typeof imagen === 'string') {
      imagenUrl = isLikelyPath(imagen) ? imagen : imagen;
    } else {
    const buffer = Buffer.isBuffer(imagen) ? imagen : Buffer.from(imagen);
    const mime = detectMimeFromBuffer(buffer);
    imagenUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    }
  } else {
    imagenUrl = getDefaultImage(Number(field.capacidad));
  }
  return {
    ...rest,
    imagen: imagenUrl
  };
};

const listFields = async () => {
  const rows = await fieldModel.getFields();
  return rows.map(sanitizeField);
};

const getField = async id => {
  const field = await fieldModel.getFieldById(id);
  if (!field) {
    throw buildError('Cancha no encontrada', 404);
  }
  return sanitizeField(field);
};

const assertAdmin = requester => {
  if (!requester || requester.role !== 'admin') {
    throw buildError('No autorizado', 403);
  }
};

const allowedCapacities = [5, 7, 11];

const parseImage = imagen => {
  if (!imagen) return null;
  const parts = imagen.split(',');
  const base64 = parts.length > 1 ? parts[1] : parts[0];
  return Buffer.from(base64, 'base64');
};

const resolveImageBuffer = payload => {
  if (payload.imagenFile && payload.imagenFile.buffer) {
    return payload.imagenFile.buffer;
  }
  if (payload.imagen) {
    return parseImage(payload.imagen);
  }
  return null;
};

const createField = async payload => {
  assertAdmin(payload.requester);
  if (!payload.nombre || !payload.capacidad) {
    throw buildError('Nombre y capacidad son obligatorios');
  }
  const capacidad = Number(payload.capacidad);
  if (!allowedCapacities.includes(capacidad)) {
    throw buildError('La capacidad debe ser 5, 7 u 11');
  }
  const record = await fieldModel.createField({
    nombre: payload.nombre,
    capacidad,
    tipo_campo: payload.tipo_campo || 'sint\u00e9tica',
    descripcion: payload.descripcion || null,
    estado: payload.estado || 'disponible',
    imagen: resolveImageBuffer(payload)
  });
  return sanitizeField(await fieldModel.getFieldById(record.id));
};

const updateField = async (id, payload) => {
  assertAdmin(payload.requester);
  const existing = await fieldModel.getFieldById(id);
  if (!existing) {
    throw buildError('Cancha no encontrada', 404);
  }
  const data = {};
  if (payload.nombre) data.nombre = payload.nombre;
  if (payload.capacidad) {
    const capacidad = Number(payload.capacidad);
    if (!allowedCapacities.includes(capacidad)) {
      throw buildError('La capacidad debe ser 5, 7 u 11');
    }
    data.capacidad = capacidad;
  }
  if (payload.tipo_campo) data.tipo_campo = payload.tipo_campo;
  if (payload.descripcion !== undefined) data.descripcion = payload.descripcion;
  if (payload.estado) data.estado = payload.estado;
  const imageBuffer = resolveImageBuffer(payload);
  if (imageBuffer) {
    data.imagen = imageBuffer;
  }
  if (Object.keys(data).length === 0) {
    return sanitizeField(existing);
  }
  await fieldModel.updateField(id, data);
  return sanitizeField(await fieldModel.getFieldById(id));
};

const removeField = async (id, requester) => {
  assertAdmin(requester);
  await getField(id);
  await fieldModel.deleteField(id);
};

const checkAvailability = async (id, fecha) => {
  if (!fecha) {
    throw buildError('fecha es obligatoria');
  }
  const disponible = await fieldModel.isAvailable(id, fecha);
  return { disponible };
};

module.exports = { listFields, getField, createField, updateField, removeField, checkAvailability };
