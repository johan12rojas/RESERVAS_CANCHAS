const taskModel = require('./taskModel');
const notificationCenter = require('../../observers/notificationCenter');

const buildError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const ensureAdmin = requester => {
  if (!requester || requester.role !== 'admin') {
    throw buildError('No autorizado', 403);
  }
};

const ensureAssigneeOrAdmin = (requester, task) => {
  if (!requester) {
    throw buildError('No autorizado', 403);
  }
  if (requester.role === 'admin') return;
  if (task.asignado_a !== requester.id) {
    throw buildError('No autorizado para esta tarea', 403);
  }
};

const ALLOWED_STATUS = ['pendiente', 'en_progreso', 'completada', 'cancelada'];

const sanitizeTask = task => {
  if (!task) return null;
  return {
    ...task,
    fecha_programada: task.fecha_programada ? task.fecha_programada.toISOString() : null,
    fecha_creacion: task.fecha_creacion ? task.fecha_creacion.toISOString() : null,
    fecha_actualizacion: task.fecha_actualizacion ? task.fecha_actualizacion.toISOString() : null
  };
};

const sanitizeHistory = history =>
  history.map(item => ({
    ...item,
    fecha_cambio: item.fecha_cambio ? item.fecha_cambio.toISOString() : null
  }));

const createTask = async payload => {
  ensureAdmin(payload.requester);
  if (!payload.titulo) {
    throw buildError('El título es obligatorio');
  }
  if (!payload.asignado_a) {
    throw buildError('Debe seleccionar a un empleado', 400);
  }

  const fecha_programada = payload.fecha_programada ? new Date(payload.fecha_programada) : null;
  const taskRecord = await taskModel.createTask({
    titulo: payload.titulo,
    descripcion: payload.descripcion || null,
    prioridad: payload.prioridad || 'media',
    estado: payload.estado || 'pendiente',
    fecha_programada,
    creado_por: payload.requester.id,
    asignado_a: Number(payload.asignado_a)
  });

  await taskModel.createHistory({
    id_tarea: taskRecord.id,
    cambio: 'creacion',
    valor_anterior: null,
    valor_nuevo: taskRecord.estado,
    realizado_por: payload.requester.id
  });

  notificationCenter.emit('task.created', {
    taskId: taskRecord.id,
    assignedTo: taskRecord.asignado_a,
    title: taskRecord.titulo,
    fecha_programada
  });

  return sanitizeTask(await taskModel.findById(taskRecord.id));
};

const listTasks = async requester => {
  ensureAdmin(requester);
  const tasks = await taskModel.listAll();
  return tasks.map(sanitizeTask);
};

const listTasksForEmployee = async requester => {
  const tasks = await taskModel.listByAssignee(requester.id);
  return tasks.map(sanitizeTask);
};

const updateTaskStatus = async ({ taskId, estado, requester }) => {
  if (!ALLOWED_STATUS.includes(estado)) {
    throw buildError('Estado inválido');
  }
  const task = await taskModel.findById(taskId);
  if (!task) {
    throw buildError('Tarea no encontrada', 404);
  }

  ensureAssigneeOrAdmin(requester, task);

  await taskModel.updateTask(taskId, { estado });
  await taskModel.createHistory({
    id_tarea: taskId,
    cambio: 'estado',
    valor_anterior: task.estado,
    valor_nuevo: estado,
    realizado_por: requester.id
  });

  notificationCenter.emit('task.updated', {
    taskId,
    estado,
    assignedTo: task.asignado_a
  });

  return sanitizeTask(await taskModel.findById(taskId));
};

const getTaskHistory = async (taskId, requester) => {
  const task = await taskModel.findById(taskId);
  if (!task) {
    throw buildError('Tarea no encontrada', 404);
  }
  ensureAssigneeOrAdmin(requester, task);
  const history = await taskModel.listHistory(taskId);
  return sanitizeHistory(history);
};

const listHistoryForEmployee = async requester => {
  const history = await taskModel.listHistoryByAssignee(requester.id);
  return sanitizeHistory(history);
};

const updateTaskDetails = async ({ taskId, requester, data }) => {
  ensureAdmin(requester);
  const task = await taskModel.findById(taskId);
  if (!task) {
    throw buildError('Tarea no encontrada', 404);
  }
  const updates = {};
  if (data.titulo !== undefined) updates.titulo = data.titulo;
  if (data.descripcion !== undefined) updates.descripcion = data.descripcion || null;
  if (data.prioridad && ALLOWED_STATUS.concat(['baja', 'media', 'alta']).includes(data.prioridad)) {
    updates.prioridad = data.prioridad;
  }
  if (data.fecha_programada !== undefined) {
    updates.fecha_programada = data.fecha_programada ? new Date(data.fecha_programada) : null;
  }
  if (data.estado && ALLOWED_STATUS.includes(data.estado)) {
    updates.estado = data.estado;
  }
  if (!Object.keys(updates).length) {
    return sanitizeTask(task);
  }
  await taskModel.updateTask(taskId, updates);
  if (updates.estado && updates.estado !== task.estado) {
    await taskModel.createHistory({
      id_tarea: taskId,
      cambio: 'estado',
      valor_anterior: task.estado,
      valor_nuevo: updates.estado,
      realizado_por: requester.id
    });
  } else {
    await taskModel.createHistory({
      id_tarea: taskId,
      cambio: 'actualizacion',
      valor_anterior: JSON.stringify({
        titulo: task.titulo,
        descripcion: task.descripcion,
        prioridad: task.prioridad,
        fecha_programada: task.fecha_programada
      }),
      valor_nuevo: JSON.stringify({
        titulo: updates.titulo ?? task.titulo,
        descripcion: updates.descripcion ?? task.descripcion,
        prioridad: updates.prioridad ?? task.prioridad,
        fecha_programada: updates.fecha_programada ?? task.fecha_programada
      }),
      realizado_por: requester.id
    });
  }
  return sanitizeTask(await taskModel.findById(taskId));
};

module.exports = {
  createTask,
  listTasks,
  listTasksForEmployee,
  updateTaskStatus,
  updateTaskDetails,
  getTaskHistory,
  listHistoryForEmployee
};

