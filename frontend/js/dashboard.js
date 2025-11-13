const renderAdminNotifications = (reservations, invoices = []) => {
  if (!refs.headerNotificationsList) return;
  if (state.profile?.tipo_usuario !== 'admin') return;
  const now = Date.now();
  const upcoming = reservations
    .filter(res => new Date(res.fecha_reserva).getTime() >= now && res.estado !== 'cancelada')
    .sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
  const pending = reservations.filter(res => res.estado !== 'confirmada' && res.estado !== 'cancelada');

  const items = [];
  if (pending.length) {
    items.push(
      `<div class="list-item"><div><strong>Reservas por gestionar</strong><p>${pending.length} pendientes de confirmación</p></div></div>`
    );
  }
  if (upcoming[0]) {
    const fieldName =
      state.fields.find(field => field.id === upcoming[0].id_cancha)?.nombre ||
      upcoming[0].cancha_nombre ||
      `Cancha #${upcoming[0].id_cancha}`;
    items.push(
      `<div class="list-item"><div><strong>Próxima reserva</strong><p>${fieldName} · ${new Date(
        upcoming[0].fecha_reserva
      ).toLocaleString()}</p></div></div>`
    );
  }
  const unpaid = invoices.filter(invoice => !invoice.metodo_pago || invoice.estado_pago !== 'completado');
  if (unpaid.length) {
    items.push(
      `<div class="list-item"><div><strong>Pagos por confirmar</strong><p>${unpaid.length} facturas sin método registrado</p></div></div>`
    );
  }
  if (!items.length) {
    items.push('<div class="empty-state">Sin notificaciones pendientes.</div>');
  }

  renderInfoList(refs.headerNotificationsList, items);
  if (refs.notificationDot) {
    const hasRealAlerts = items.some(item => !item.includes('Sin notificaciones'));
    refs.notificationDot.classList.toggle('hidden', !hasRealAlerts);
  }
};
const API_BASE = 'http://localhost:4000/api';
const token = localStorage.getItem('token');

if (!token) window.location.href = 'index.html';

const request = async (path, options = {}) => {
  const headers = { ...(options.headers || {}) };
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  headers.Authorization = `Bearer ${token}`;
  const fetchOptions = { ...options, headers };
  if (fetchOptions.body && !isFormData && typeof fetchOptions.body !== 'string') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  const res = await fetch(`${API_BASE}${path}`, fetchOptions);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'No se pudo completar la operacion');
  return data;
};

const refs = {
  userName: document.getElementById('user-name'),
  roleName: document.getElementById('role-name'),
  logoutBtn: document.getElementById('logout-btn'),
  statUsers: document.getElementById('stat-users'),
  statFields: document.getElementById('stat-fields'),
  statBookings: document.getElementById('stat-bookings'),
  statIncome: document.getElementById('stat-income'),
  usersList: document.getElementById('user-list'),
  userEditor: document.getElementById('user-editor'),
  userEditForm: document.getElementById('user-edit-form'),
  userEditEmail: document.getElementById('user-edit-email'),
  closeUserEditor: document.getElementById('close-user-editor'),
  userCreator: document.getElementById('user-creator'),
  userCreateForm: document.getElementById('user-create-form'),
  openUserCreator: document.getElementById('open-user-creator'),
  closeUserCreator: document.getElementById('close-user-creator'),
  fieldList: document.getElementById('field-list'),
  fieldGallerySummary: document.getElementById('field-gallery-summary'),
  playerFieldGallery: document.getElementById('player-field-gallery'),
  playerReservationField: document.getElementById('player-reservation-field'),
  playerReservationForm: document.getElementById('player-reservation-form'),
  playerReservationMethod: document.getElementById('player-reservation-method'),
  playerReservationPrice: document.getElementById('player-reservation-price'),
  playerPayments: document.getElementById('player-payments'),
  playerStatTotal: document.getElementById('player-stat-total'),
  playerStatUpcoming: document.getElementById('player-stat-upcoming'),
  playerStatSpent: document.getElementById('player-stat-spent'),
  playerStatFields: document.getElementById('player-stat-fields'),
  playerReservationsUpcoming: document.getElementById('player-reservations-upcoming'),
  playerReservationsHistory: document.getElementById('player-reservations-history'),
  playerExpenses: document.getElementById('player-expenses'),
  notifications: document.getElementById('notifications'),
  notificationDot: document.getElementById('notification-dot'),
  toggleNotifications: document.getElementById('toggle-notifications'),
  headerNotifications: document.getElementById('header-notifications'),
  headerNotificationsList: document.getElementById('header-notifications-list'),
  closeHeaderNotifications: document.getElementById('close-header-notifications'),
  playerExpensesSummary: document.getElementById('player-expenses-summary'),
  playerPaymentsSummary: document.getElementById('player-payments-summary'),
  playerInvoicesSummary: document.getElementById('player-invoices-summary'),
  playerNotificationsSummary: document.getElementById('player-notifications-summary'),
  playerInvoices: document.getElementById('player-invoices'),
  reservationList: document.getElementById('reservation-list'),
  paymentList: document.getElementById('payment-list'),
  paymentCard: document.getElementById('payment-card'),
  paymentTransfer: document.getElementById('payment-transfer'),
  paymentCash: document.getElementById('payment-cash'),
  invoiceList: document.getElementById('invoice-list'),
  maintenanceList: document.getElementById('maintenance-list'),
  employeeHighlight: document.getElementById('employee-highlight'),
  employeeNotes: document.getElementById('employee-notes'),
  employeeStatPending: document.getElementById('employee-stat-pending'),
  employeeStatProgress: document.getElementById('employee-stat-progress'),
  employeeStatCompleted: document.getElementById('employee-stat-completed'),
  employeeStatTotal: document.getElementById('employee-stat-total'),
  employeeTaskPending: document.getElementById('employee-task-pending'),
  employeeTaskProgress: document.getElementById('employee-task-progress'),
  employeeTaskCompleted: document.getElementById('employee-task-completed'),
  employeeTaskHistory: document.getElementById('employee-task-history'),
  taskCreateForm: document.getElementById('task-create-form'),
  taskEmployeeSelect: document.getElementById('task-employee'),
  taskTemplateSelect: document.getElementById('task-template'),
  taskTitleInput: document.getElementById('task-title'),
  taskDescriptionInput: document.getElementById('task-description'),
  taskPrioritySelect: document.getElementById('task-priority'),
  taskStatusSelect: document.getElementById('task-status'),
  taskDateInput: document.getElementById('task-date'),
  taskIdField: document.getElementById('task-id'),
  taskFilterEmployee: document.getElementById('task-filter-employee'),
  taskFilterStatus: document.getElementById('task-filter-status'),
  adminTaskList: document.getElementById('admin-task-list'),
  adminTaskHistory: document.getElementById('admin-task-history'),
  employeeOpsReservations: document.getElementById('employee-ops-reservations'),
  employeeOpsPayments: document.getElementById('employee-ops-payments'),
  headerWeather: document.getElementById('header-weather'),
  headerWeatherIcon: document.getElementById('header-weather-icon'),
  headerWeatherTemp: document.getElementById('header-weather-temp'),
  headerWeatherNote: document.getElementById('header-weather-note'),
  nextBooking: document.getElementById('next-booking'),
  playerSuggestions: document.getElementById('player-suggestions'),
  fieldForm: document.getElementById('field-form'),
  fieldImageInput: document.getElementById('field-image'),
  fieldImagePreview: document.getElementById('field-image-preview')
};

const TASK_TEMPLATES = [
  {
    id: 'iluminacion',
    titulo: 'Revisión de iluminación',
    descripcion: 'Verificar reflectores y reportar bombillos dañados.',
    prioridad: 'alta'
  },
  {
    id: 'drenaje',
    titulo: 'Revisión de drenaje',
    descripcion: 'Comprobar que los desagües estén libres y reportar bloqueos.',
    prioridad: 'media'
  },
  {
    id: 'inventario',
    titulo: 'Actualización de inventario',
    descripcion: 'Contar balones y equipamiento, registrar faltantes.',
    prioridad: 'media'
  },
  {
    id: 'limpieza',
    titulo: 'Coordinación de limpieza post-partido',
    descripcion: 'Asegurar que la cancha quede lista después del evento.',
    prioridad: 'alta'
  }
];

const PRICE_BY_CAPACITY = {
  5: 50000,
  7: 70000,
  11: 95000
};

const WEATHER_API_KEY = '2d073ceacf8ddad459e53481988d0f80';
const WEATHER_CITY = 'Cucuta,CO';
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&units=metric&lang=es&appid=${WEATHER_API_KEY}`;
const WEATHER_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutos

const getWeatherEmoji = conditionId => {
  if (conditionId >= 200 && conditionId < 300) return '⛈️';
  if (conditionId >= 300 && conditionId < 600) return '🌧️';
  if (conditionId >= 600 && conditionId < 700) return '❄️';
  if (conditionId >= 700 && conditionId < 800) return '🌫️';
  if (conditionId === 800) return '☀️';
  if (conditionId > 800 && conditionId < 900) return '☁️';
  return '🌡️';
};

const renderWeather = weather => {
  const hasData = weather && weather.cod === 200;
  const conditionId = hasData ? weather.weather[0].id : null;
  const isRainy = hasData && conditionId >= 200 && conditionId < 700;
  const tempText = hasData ? `${Math.round(weather.main.temp)}°C` : '--°C';
  const descText = hasData ? weather.weather[0].description : 'Sin datos disponibles';
  const iconText = hasData ? getWeatherEmoji(conditionId) : 'ℹ️';
  const humidity = hasData ? `${weather.main.humidity}% humedad` : '';
  const wind = hasData ? `Viento ${Math.round(weather.wind.speed)} km/h` : '';
  const updatedAt = hasData
    ? new Date(weather.dt * 1000).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : '';

  state.weatherIsRainy = isRainy;
  state.weather = weather || null;
  state.weatherAdvisory = hasData
    ? isRainy
      ? 'Se pronostica lluvia, considera reagendar.'
      : 'Clima favorable para jugar.'
    : 'No se pudo obtener el clima actualizado.';

  if (refs.headerWeather) {
    if (refs.headerWeatherTemp) refs.headerWeatherTemp.textContent = tempText;
    if (refs.headerWeatherIcon) refs.headerWeatherIcon.textContent = iconText;
    if (refs.headerWeatherNote) {
      const details = [descText];
      if (humidity) details.push(humidity);
      if (wind) details.push(wind);
      if (updatedAt) details.push(`Act. ${updatedAt}`);
      refs.headerWeatherNote.textContent = details.join(' · ');
    }
  }
};

const loadWeather = async () => {
  if (!WEATHER_API_KEY) return;
  try {
    const response = await fetch(WEATHER_URL);
    const data = await response.json();
    state.weather = data;
    renderWeather(data);
  } catch (error) {
    console.error('No se pudo cargar el clima', error);
    renderWeather(null);
  }
};

const tabs = document.querySelectorAll('[data-role-view="admin"] .dashboard-tabs .tab-button');
const tabPanels = document.querySelectorAll('[data-tab-panel]');
const playerTabs = document.querySelectorAll('.player-tabs .tab-button');
const playerPanels = document.querySelectorAll('[data-player-panel]');
const employeeTabs = document.querySelectorAll('.employee-tabs .tab-button');
const employeePanels = document.querySelectorAll('[data-employee-panel]');
const roleViews = document.querySelectorAll('[data-role-view]');

const state = {
  profile: null,
  fields: [],
  reservations: [],
  reservationsInvoices: [],
  users: [],
  editingUserId: null,
  editingFieldId: null,
  fieldImageBase64: null,
  fieldImageBlob: null,
  employeeTasks: [],
  employeeTaskHistory: [],
  adminTasks: [],
  adminTaskHistory: [],
  employeeOperationsReservations: [],
  employeeOperationsPayments: [],
  weather: null,
  weatherIsRainy: false,
  weatherAdvisory: ''
};

const setActiveTab = target => {
  tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === target));
  tabPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.tabPanel === target));
};

tabs.forEach(btn => btn.addEventListener('click', () => setActiveTab(btn.dataset.tab)));

const setActivePlayerTab = target => {
  if (!playerTabs.length) return;
  playerTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.playerTab === target));
  playerPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.playerPanel === target));
};

playerTabs.forEach(btn =>
  btn.addEventListener('click', () => setActivePlayerTab(btn.dataset.playerTab))
);

const setActiveEmployeeTab = target => {
  if (!employeeTabs.length) return;
  employeeTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.employeeTab === target));
  employeePanels.forEach(panel => panel.classList.toggle('active', panel.dataset.employeePanel === target));
};

employeeTabs.forEach(btn =>
  btn.addEventListener('click', () => setActiveEmployeeTab(btn.dataset.employeeTab))
);

const base64ToBlob = base64String => {
  const parts = base64String.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'image/jpeg';
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

const readFileAsDataURL = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const processImageFile = file => readFileAsDataURL(file);

if (refs.fieldImageInput) {
  refs.fieldImageInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) {
      state.fieldImageBase64 = null;
      state.fieldImageBlob = null;
      refs.fieldImagePreview.innerHTML = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen debe pesar menos de 2MB');
      e.target.value = '';
      return;
    }
    const processed = await processImageFile(file);
    const blob = base64ToBlob(processed);
    if (blob.size > 2 * 1024 * 1024) {
      alert('Reduce el tamaño de la imagen (máximo 2MB).');
      e.target.value = '';
      state.fieldImageBase64 = null;
      state.fieldImageBlob = null;
      refs.fieldImagePreview.innerHTML = '';
      return;
    }
    state.fieldImageBase64 = processed;
    state.fieldImageBlob = blob;
    refs.fieldImagePreview.innerHTML = `<img src="${state.fieldImageBase64}" alt="Vista previa" />`;
  });
}

const formatRole = role => (role === 'admin' ? 'Administrador' : role === 'empleado' ? 'Empleado' : 'Jugador');

const formatCurrency = value =>
  `$${Number(value || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const findFieldById = fieldId => state.fields.find(field => field.id === Number(fieldId));

const getFieldPrice = fieldId => {
  const field = findFieldById(fieldId);
  if (!field) return null;
  const capacidad = Number(field.capacidad);
  return field.precio !== undefined ? Number(field.precio) : PRICE_BY_CAPACITY[capacidad] || 60000;
};

const updateReservationPriceUI = () => {
  if (!refs.playerReservationField || !refs.playerReservationPrice) return;
  const fieldId = refs.playerReservationField.value;
  const price = getFieldPrice(fieldId);
  refs.playerReservationPrice.textContent = price ? formatCurrency(price) : '$ -';
};

const applyRoleView = role => {
  roleViews.forEach(view => view.classList.toggle('hidden', view.dataset.roleView !== role));
  refs.roleName.textContent = role === 'admin' ? 'Administracion' : role === 'empleado' ? 'Operaciones' : 'Jugador';
  if (role === 'admin') setActiveTab('usuarios');
  if (role === 'empleado') setActiveEmployeeTab('overview');
  if (role === 'normal') setActivePlayerTab('overview');
};

const renderUsers = () => {
  if (!refs.usersList) return;
  if (!state.users.length) {
    refs.usersList.innerHTML = '<p>No hay usuarios registrados.</p>';
    return;
  }
  const canEdit = state.profile?.tipo_usuario === 'admin';
  refs.usersList.innerHTML = state.users
    .map(user => `
      <div class="list-item">
        <div class="list-item-info">
          <strong>${user.nombre}</strong>
          <p>${user.email}</p>
        </div>
        <div class="list-badges">
          <span class="badge ${user.tipo_usuario === 'admin' ? 'admin' : 'user'}">${formatRole(user.tipo_usuario)}</span>
          <span class="badge success">Activo</span>
        </div>
        ${
          canEdit
            ? `<div class="list-actions">
                <button class="pill-btn" data-edit-user="${user.id}">Editar</button>
                ${
                  user.tipo_usuario !== 'admin'
                    ? '<button class="delete-btn" data-delete-user="' + user.id + '">Eliminar</button>'
                    : ''
                }
              </div>`
            : ''
        }
      </div>`)
    .join('');
};

const renderFields = () => {
  if (refs.fieldList) {
    if (refs.fieldGallerySummary) {
      refs.fieldGallerySummary.textContent = state.fields.length
        ? `${state.fields.length} ${state.fields.length === 1 ? 'cancha registrada' : 'canchas registradas'}`
        : 'Sin canchas registradas';
    }
    if (!state.fields.length) {
      refs.fieldList.innerHTML = '<div class="empty-state">No hay canchas registradas.</div>';
    } else {
      const canEdit = state.profile?.tipo_usuario === 'admin';
      refs.fieldList.innerHTML = state.fields
        .map(
          field => `
          <article class="field-item" data-field-id="${field.id}">
            <img src="${field.imagen}" alt="${field.nombre}" class="field-thumb" />
            <div class="field-meta">
              <div class="field-meta-header">
                <strong>${field.nombre}</strong>
                <span class="badge field-status">${field.estado}</span>
              </div>
              <p class="field-meta-price">${formatCurrency(field.precio)}</p>
              <p class="field-meta-details">${field.tipo_campo} · ${field.capacidad} jugadores</p>
              ${field.descripcion ? `<p class="field-meta-description">${field.descripcion}</p>` : ''}
            </div>
            ${
              canEdit
                ? `<div class="field-actions">
                    <button class="pill-btn" data-edit-field="${field.id}">Editar</button>
                    <button class="delete-btn" data-delete-field="${field.id}">Eliminar</button>
                  </div>`
                : ''
            }
          </article>`
        )
        .join('');
    }
  }

  if (refs.playerFieldGallery) {
    refs.playerFieldGallery.innerHTML = state.fields
      .map(field => `
        <div class="player-field-card" data-player-field="${field.id}">
          <img src="${field.imagen}" alt="${field.nombre}" />
          <strong>${field.nombre}</strong>
          <p>${formatCurrency(field.precio)}</p>
          <p>${field.tipo_campo} · ${field.capacidad} jugadores</p>
          <small>${field.descripcion || ''}</small>
        </div>`)
      .join('');
    if (refs.playerReservationField) {
      refs.playerReservationField.innerHTML = state.fields
        .map(field => `<option value="${field.id}">${field.nombre} (${field.capacidad})</option>`)
        .join('');
      updateReservationPriceUI();
    }
  }
};

const renderInfoList = (container, items) => {
  if (!container) return;
  container.innerHTML = items.length ? items.join('') : '<p>No hay registros.</p>';
};

const renderEmployeeData = () => {
  if (state.profile?.tipo_usuario !== 'empleado') return;
  const tasks = state.employeeTasks || [];
  const history = state.employeeTaskHistory || [];

  const pending = tasks.filter(task => task.estado === 'pendiente');
  const inProgress = tasks.filter(task => task.estado === 'en_progreso');
  const completed = tasks.filter(task => task.estado === 'completada');
  const upcoming = tasks
    .filter(task => task.fecha_programada)
    .sort((a, b) => new Date(a.fecha_programada) - new Date(b.fecha_programada));

  if (refs.employeeStatPending) refs.employeeStatPending.textContent = pending.length;
  if (refs.employeeStatProgress) refs.employeeStatProgress.textContent = inProgress.length;
  if (refs.employeeStatCompleted) refs.employeeStatCompleted.textContent = completed.length;
  if (refs.employeeStatTotal) refs.employeeStatTotal.textContent = tasks.length;

  const nextTask =
    upcoming[0] || inProgress[0] || pending[0] || completed[0] || null;

  if (refs.employeeHighlight) {
    if (!nextTask) {
      refs.employeeHighlight.innerHTML = `
        <h4>No tienes tareas asignadas</h4>
        <p>Cuando recibas una nueva instrucción aparecerá aquí.</p>
      `;
    } else {
      refs.employeeHighlight.innerHTML = `
        <div>
          <h4>${nextTask.titulo}</h4>
          <p>${nextTask.descripcion || 'Sin descripción'}</p>
        </div>
        <div class="highlight-meta">
          ${nextTask.fecha_programada ? `<span>${new Date(nextTask.fecha_programada).toLocaleString()}</span>` : ''}
          <span class="badge user">${nextTask.prioridad}</span>
          <span class="badge ${nextTask.estado === 'completada' ? 'success' : 'user'}">${nextTask.estado}</span>
        </div>
      `;
    }
  }

  if (refs.employeeNotes) {
    const overdue = pending.filter(
      task => task.fecha_programada && new Date(task.fecha_programada) < Date.now()
    ).length;
    refs.employeeNotes.innerHTML = `
      <h4>Resumen de la jornada</h4>
      <div class="highlight-meta">
        <span>${tasks.length} tareas totales</span>
        <span>${pending.length} pendientes</span>
        <span>${overdue} vencidas</span>
      </div>
      <p>${inProgress.length ? 'Mantén el ritmo con las tareas en progreso.' : 'Puedes iniciar nuevas tareas cuando estés listo.'}</p>
      ${state.weatherAdvisory ? `<p class="weather-advisory">${state.weatherAdvisory}</p>` : ''}
    `;
  }

  const formatTask = task => `
    <div class="list-item">
      <div class="list-item-info">
        <strong>${task.titulo}</strong>
        <p>${task.descripcion || 'Sin descripción'}</p>
        ${task.fecha_programada ? `<small>${new Date(task.fecha_programada).toLocaleString()}</small>` : ''}
      </div>
      <div class="reservation-row-meta">
        <span class="badge ${task.estado === 'completada' ? 'success' : 'user'}">${task.estado}</span>
        <span class="badge user">${task.prioridad}</span>
      </div>
    </div>`;

  renderInfoList(refs.employeeTaskPending, pending.map(formatTask));
  renderInfoList(refs.employeeTaskProgress, inProgress.map(formatTask));
  renderInfoList(
    refs.employeeTaskCompleted,
    completed.slice(0, 5).map(formatTask)
  );

  const maintenanceTasks = tasks.filter(task =>
    (task.titulo || '').toLowerCase().includes('mantenimiento') ||
    (task.descripcion || '').toLowerCase().includes('mantenimiento')
  );
  renderInfoList(refs.maintenanceList, maintenanceTasks.map(formatTask));

  const historyItems = history.map(
    item => `
      <div class="list-item">
        <div class="list-item-info">
          <strong>${item.titulo}</strong>
          <p>${item.cambio}: ${item.valor_anterior || '—'} → ${item.valor_nuevo || '—'}</p>
        </div>
        <div class="reservation-row-meta">
          <span class="badge user">${item.usuario_nombre}</span>
          <small>${new Date(item.fecha_cambio).toLocaleString()}</small>
        </div>
      </div>`
  );
  renderInfoList(refs.employeeTaskHistory, historyItems);

  const notificationsItems = [];
  let hasAlerts = false;
  if (nextTask) {
    hasAlerts = true;
    notificationsItems.push(
      `<div class="list-item"><div><strong>Próxima tarea</strong><p>${nextTask.titulo}${
        nextTask.fecha_programada ? ` · ${new Date(nextTask.fecha_programada).toLocaleString()}` : ''
      }</p></div></div>`
    );
  }
  const pendingCount = pending.length;
  if (!nextTask && pendingCount) {
    notificationsItems.push(
      `<div class="list-item"><div><strong>Tareas pendientes</strong><p>${pendingCount} por iniciar</p></div></div>`
    );
  }
  if (!notificationsItems.length) {
    notificationsItems.push('<div class="list-item"><div><strong>Sin notificaciones</strong><p>Todo al día</p></div></div>');
  }

  if (state.profile?.tipo_usuario === 'empleado') {
    renderInfoList(refs.notifications, notificationsItems);
    if (refs.headerNotificationsList) {
      renderInfoList(refs.headerNotificationsList, notificationsItems);
    }
    if (refs.notificationDot) {
      refs.notificationDot.classList.toggle('hidden', !hasAlerts);
    }
  }

  renderEmployeeOperations();
};

const applyOverview = overview => {
  refs.statUsers.textContent = overview.totals.users;
  refs.statFields.textContent = overview.totals.fields;
  refs.statBookings.textContent = `${overview.totals.confirmedReservations}/${overview.totals.reservations}`;
  refs.statIncome.textContent = `$${Number(overview.totals.income).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
  renderInfoList(
    refs.invoiceList,
    overview.recent.invoices.map(
      item => `
        <div class="list-item info-card">
          <div class="info-icon">📄</div>
          <div>
            <strong>Factura #${item.id}</strong>
            <p>Reserva ${item.id_reserva} · ${new Date(item.fecha_factura).toLocaleDateString()}</p>
            <small>${item.usuario_nombre || ''} ${item.cancha_nombre ? `· ${item.cancha_nombre}` : ''}</small>
          </div>
          <span class="badge user">${formatCurrency(item.monto)} ${
        item.metodo_pago ? `· ${formatPaymentMethod(item.metodo_pago)}` : ''
      }</span>
        </div>`
    )
  );
};

const renderAdminReservations = reservations => {
  if (!refs.reservationList) return;
  if (!reservations.length) {
    refs.reservationList.innerHTML = '<div class="empty-state">No hay reservas registradas.</div>';
    return;
  }
  const fieldMap = new Map(state.fields.map(field => [field.id, field]));
  const grouped = reservations.reduce((acc, item) => {
    const key = item.cancha_nombre;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  refs.reservationList.innerHTML = Object.entries(grouped)
    .map(([fieldName, items]) => `
      <div class="field-reservation-card">
        <div class="field-reservation-header">
          <img src="${fieldMap.get(items[0].id_cancha)?.imagen || 'assets/canchita.webp'}" alt="${fieldName}" class="field-reservation-thumb" />
          <div>
            <strong>${fieldName}</strong>
            <p>${items.length} ${items.length === 1 ? 'reserva' : 'reservas'}</p>
          </div>
        </div>
        <div class="reservation-rows">
          ${items
            .map(
              r => `
              <div class="reservation-row" data-reservation-id="${r.id}">
                <div class="reservation-row-info">
                  <strong>${r.usuario_nombre}</strong>
                  <p>${new Date(r.fecha_reserva).toLocaleString()}</p>
                </div>
                <div class="reservation-row-meta">
                  <span class="badge ${r.estado === 'confirmada' ? 'success' : 'user'}">${r.estado}</span>
                  <div class="reservation-row-actions">
                    ${r.estado !== 'confirmada' ? `<button class="pill-btn" data-confirm-reservation="${r.id}">Confirmar</button>` : ''}
                    ${r.estado !== 'cancelada' ? `<button class="delete-btn" data-cancel-reservation="${r.id}">Cancelar</button>` : ''}
                  </div>
                </div>
              </div>`
            )
            .join('')}
        </div>
      </div>`)
    .join('');
};

const formatPaymentMethod = method => {
  if (method === 'tarjeta') return 'Tarjeta';
  if (method === 'transferencia') return 'Transferencia';
  if (method === 'efectivo') return 'Efectivo';
  return method;
};

const renderAdminPayments = payments => {
  renderInfoList(
    refs.paymentList,
    payments.map(
      p => `
        <div class="list-item info-card">
          <div class="info-icon">💳</div>
          <div>
            <strong>${p.usuario_nombre || p.id_usuario}</strong>
            <p>${p.metodo_pago.toUpperCase()} · ${new Date(p.fecha_pago).toLocaleString()}</p>
          </div>
          <span class="badge ${p.estado_pago === 'completado' ? 'success' : 'user'}">${formatCurrency(p.monto)}</span>
        </div>`
    )
  );
};

const populateTaskTemplates = () => {
  if (!refs.taskTemplateSelect) return;
  refs.taskTemplateSelect.innerHTML = [
    '<option value="">Modelo personalizado</option>',
    ...TASK_TEMPLATES.map(template => `<option value="${template.id}">${template.titulo}</option>`)
  ].join('');
};

const populateTaskEmployees = () => {
  if (!refs.taskEmployeeSelect && !refs.taskFilterEmployee) return;
  const employees = (state.users || []).filter(user => user.tipo_usuario === 'empleado');
  const employeeOptions = employees
    .map(employee => `<option value="${employee.id}">${employee.nombre}</option>`)
    .join('');
  if (refs.taskEmployeeSelect) {
    refs.taskEmployeeSelect.innerHTML = `<option value="">Selecciona un empleado</option>${employeeOptions}`;
  }
  if (refs.taskFilterEmployee) {
    refs.taskFilterEmployee.innerHTML = `<option value="todos">Todos</option>${employeeOptions}`;
    refs.taskFilterEmployee.value = 'todos';
  }
};

const resetTaskForm = () => {
  if (!refs.taskCreateForm) return;
  refs.taskCreateForm.reset();
  if (refs.taskIdField) refs.taskIdField.value = '';
  if (refs.taskEmployeeSelect) refs.taskEmployeeSelect.value = '';
  if (refs.taskTemplateSelect) refs.taskTemplateSelect.value = '';
  if (refs.taskPrioritySelect) refs.taskPrioritySelect.value = 'media';
  if (refs.taskStatusSelect) refs.taskStatusSelect.value = 'pendiente';
  if (refs.taskDateInput) refs.taskDateInput.value = '';
  const submitBtn = refs.taskCreateForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Asignar tarea';
};

const setTaskFormFromTemplate = templateId => {
  const template = TASK_TEMPLATES.find(item => item.id === templateId);
  if (!template || !refs.taskCreateForm) return;
  if (refs.taskTitleInput) refs.taskTitleInput.value = template.titulo;
  if (refs.taskDescriptionInput) refs.taskDescriptionInput.value = template.descripcion;
  if (refs.taskPrioritySelect) refs.taskPrioritySelect.value = template.prioridad;
  if (refs.taskStatusSelect) refs.taskStatusSelect.value = 'pendiente';
  if (refs.taskDateInput) refs.taskDateInput.value = '';
};

const setTaskFormFromTask = task => {
  if (!refs.taskCreateForm || !task) return;
  if (refs.taskIdField) refs.taskIdField.value = task.id;
  if (refs.taskEmployeeSelect) refs.taskEmployeeSelect.value = task.asignado_a;
  if (refs.taskTitleInput) refs.taskTitleInput.value = task.titulo;
  if (refs.taskDescriptionInput) refs.taskDescriptionInput.value = task.descripcion || '';
  if (refs.taskPrioritySelect) refs.taskPrioritySelect.value = task.prioridad || 'media';
  if (refs.taskStatusSelect) refs.taskStatusSelect.value = task.estado || 'pendiente';
  if (refs.taskDateInput) refs.taskDateInput.value = task.fecha_programada ? task.fecha_programada.slice(0, 16) : '';
  if (refs.taskTemplateSelect) refs.taskTemplateSelect.value = '';
  const submitBtn = refs.taskCreateForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Actualizar tarea';
};

const renderAdminTasks = () => {
  if (!refs.adminTaskList) return;
  const tasks = state.adminTasks || [];
  const employeeFilter = refs.taskFilterEmployee ? refs.taskFilterEmployee.value : 'todos';
  const statusFilter = refs.taskFilterStatus ? refs.taskFilterStatus.value : 'todas';

  const filtered = tasks
    .filter(task => (employeeFilter === 'todos' ? true : String(task.asignado_a) === employeeFilter))
    .filter(task => (statusFilter === 'todas' ? true : task.estado === statusFilter))
    .sort((a, b) => new Date(b.fecha_actualizacion || b.fecha_creacion) - new Date(a.fecha_actualizacion || a.fecha_creacion));

  refs.adminTaskList.innerHTML = filtered.length
    ? filtered
        .map(
          task => `
        <div class="list-item">
          <div class="list-item-info">
            <strong>${task.titulo}</strong>
            <p>${task.descripcion || 'Sin descripción'}</p>
            <small>${task.asignado_nombre || ''} · ${task.prioridad} · ${task.fecha_programada ? new Date(task.fecha_programada).toLocaleString() : 'Sin fecha'}</small>
          </div>
          <div class="task-actions">
            <span class="badge ${task.estado === 'completada' ? 'success' : 'user'}">${task.estado}</span>
            <button class="pill-btn" data-task-edit="${task.id}">Editar</button>
            ${task.estado !== 'completada' ? `<button class="pill-btn" data-task-status="completada" data-task-id="${task.id}">Marcar completada</button>` : ''}
          </div>
        </div>`
        )
        .join('')
    : '<div class="empty-state">No hay tareas registradas.</div>';

  if (refs.adminTaskHistory) {
    const historyItems = tasks
      .slice()
      .sort((a, b) => new Date(b.fecha_actualizacion || b.fecha_creacion) - new Date(a.fecha_actualizacion || a.fecha_creacion))
      .slice(0, 10)
      .map(
        task => `
        <div class="list-item">
          <div class="list-item-info">
            <strong>${task.titulo}</strong>
            <p>${task.asignado_nombre || ''} · ${task.estado}</p>
          </div>
          <small>${new Date(task.fecha_actualizacion || task.fecha_creacion).toLocaleString()}</small>
        </div>`
      );
    refs.adminTaskHistory.innerHTML = historyItems.length
      ? historyItems.join('')
      : '<div class="empty-state">Sin movimientos recientes.</div>';
  }
};

const loadAdminTasks = async () => {
  if (state.profile?.tipo_usuario !== 'admin') return;
  try {
    const tasks = await request('/tasks');
    state.adminTasks = tasks;
    renderAdminTasks();
  } catch (error) {
    console.error('No se pudieron cargar las tareas del administrador', error);
    state.adminTasks = [];
    renderAdminTasks();
  }
};

const renderEmployeeOperations = () => {
  if (state.profile?.tipo_usuario !== 'empleado') return;
  if (refs.employeeOpsReservations) {
    const reservations = (state.employeeOperationsReservations || [])
      .slice()
      .sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
    const advisoryBanner = state.weatherIsRainy
      ? '<div class="weather-advisory">Pronóstico: lluvia en Cúcuta. Verifica con los clientes antes de confirmar.</div>'
      : '';
    refs.employeeOpsReservations.innerHTML = reservations.length
      ? advisoryBanner +
          reservations
            .map(reservation => {
              const fieldName =
                findFieldById(reservation.id_cancha)?.nombre ||
                reservation.cancha_nombre ||
                `Cancha #${reservation.id_cancha}`;
              return `
          <div class="list-item">
            <div class="list-item-info">
              <strong>${fieldName}</strong>
              <p>${reservation.usuario_nombre} · ${new Date(reservation.fecha_reserva).toLocaleString()}</p>
            </div>
            <div class="task-actions">
              <span class="badge ${reservation.estado === 'confirmada' ? 'success' : 'user'}">${reservation.estado}</span>
              ${
                reservation.estado !== 'confirmada'
                  ? `<button class="pill-btn" data-confirm-reservation="${reservation.id}">Confirmar</button>`
                  : ''
              }
              ${
                reservation.estado !== 'cancelada'
                  ? `<button class="delete-btn" data-cancel-reservation="${reservation.id}">Cancelar</button>`
                  : ''
              }
            </div>
          </div>`;
            })
            .join('')
      : advisoryBanner || '<div class="empty-state">No hay reservas registradas.</div>';
  }

  if (refs.employeeOpsPayments) {
    const payments = (state.employeeOperationsPayments || [])
      .slice()
      .sort((a, b) => new Date(b.fecha_pago) - new Date(a.fecha_pago));
    refs.employeeOpsPayments.innerHTML = payments.length
      ? payments
          .map(
            payment => `
        <div class="list-item">
          <div class="list-item-info">
            <strong>${payment.usuario_nombre || payment.id_usuario}</strong>
            <p>${formatPaymentMethod(payment.metodo_pago)} · ${new Date(payment.fecha_pago).toLocaleString()}</p>
          </div>
          <span class="badge ${payment.estado_pago === 'completado' ? 'success' : 'user'}">${formatCurrency(payment.monto)}</span>
        </div>`
          )
          .join('')
      : '<div class="empty-state">Sin pagos registrados.</div>';
  }
};

const renderAdminInvoices = invoices => {
  if (!refs.invoiceList) return;
  if (!invoices.length) {
    refs.invoiceList.innerHTML = '<div class="empty-state">No se han emitido facturas.</div>';
    return;
  }
  refs.invoiceList.innerHTML = invoices
    .map(
      invoice => `
      <div class="list-item">
        <div class="list-item-info">
          <strong>Factura #${invoice.id}</strong>
          <p>Reserva #${invoice.id_reserva} · ${new Date(invoice.fecha_factura).toLocaleString()}</p>
          <small>${invoice.usuario_nombre} · ${invoice.usuario_email}</small>
        </div>
        <div class="invoice-meta">
          <span>${invoice.cancha_nombre || 'Cancha'}</span>
          <span>${formatPaymentMethod(invoice.metodo_pago || 'Efectivo')}</span>
          <span class="badge success">${formatCurrency(invoice.monto)}</span>
        </div>
      </div>`
    )
    .join('');
  renderWeather(state.weather);
};

const loadFields = async () => {
  const rawFields = await request('/fields');
  state.fields = rawFields.map(field => {
    const capacidad = Number(field.capacidad);
    const precioSugerido = PRICE_BY_CAPACITY[capacidad] || 60000;
    return {
      ...field,
      capacidad,
      precio: Number(field.precio || precioSugerido)
    };
  });
  refs.statFields.textContent = state.fields.length;
  renderFields();
  if (state.profile?.tipo_usuario === 'admin') {
    renderAdminReservations(state.reservations);
    renderAdminNotifications(state.reservations, state.reservationsInvoices);
    renderAdminInvoices(state.reservationsInvoices);
  }
  if (state.profile?.tipo_usuario === 'normal') {
    await renderPlayerData();
  }
};

const loadUsers = async () => {
  if (state.profile?.tipo_usuario !== 'admin') return;
  state.users = await request('/users');
  renderUsers();
  populateTaskEmployees();
};

const loadReservations = async () => {
  if (state.profile?.tipo_usuario !== 'admin') return;
  try {
    const [reservations, invoices] = await Promise.all([request('/reservations'), request('/billing/admin')]);
    state.reservations = reservations;
    state.reservationsInvoices = invoices;
    renderAdminReservations(state.reservations);
    renderAdminNotifications(state.reservations, invoices);
    renderAdminInvoices(state.reservationsInvoices);
  } catch (error) {
    console.error('No se pudieron cargar las reservas o facturas del administrador', error);
    state.reservations = [];
    state.reservationsInvoices = [];
  }
};

const loadAdminInvoices = async () => {
  if (state.profile?.tipo_usuario !== 'admin') return;
  try {
    const invoices = await request('/billing/admin');
    state.reservationsInvoices = invoices;
    renderAdminInvoices(invoices);
    renderAdminNotifications(state.reservations, invoices);
  } catch (error) {
    console.error('No se pudieron cargar las facturas del administrador', error);
    state.reservationsInvoices = [];
  }
};

const loadEmployeeData = async () => {
  if (state.profile?.tipo_usuario !== 'empleado') return;
  try {
    const [tasks, history, reservations, payments] = await Promise.all([
      request('/tasks/mine'),
      request('/tasks/mine/history'),
      request('/reservations'),
      request('/payments/all')
    ]);
    state.employeeTasks = tasks;
    state.employeeTaskHistory = history;
    state.employeeOperationsReservations = reservations;
    state.employeeOperationsPayments = payments;
    renderWeather(state.weather);
    renderEmployeeData();
    renderEmployeeOperations();
  } catch (error) {
    console.error('No se pudieron cargar las tareas del empleado', error);
    state.employeeTasks = [];
    state.employeeTaskHistory = [];
    state.employeeOperationsReservations = [];
    state.employeeOperationsPayments = [];
    renderWeather(state.weather);
    renderEmployeeData();
    renderEmployeeOperations();
  }
};

const renderPlayerData = async () => {
  if (!state.profile || state.profile.tipo_usuario === 'admin') return;
  const [reservations, payments, invoices] = await Promise.all([
    request('/reservations/mine'),
    request('/payments'),
    request('/billing')
  ]);

  if (state.profile.tipo_usuario === 'normal') {
    // Solo refrescamos el clima si ya se cargó previamente
    if (state.weather) {
      renderWeather(state.weather);
    }
  }

  const now = Date.now();
  const upcoming = reservations
    .filter(res => new Date(res.fecha_reserva).getTime() >= now && res.estado !== 'cancelada')
    .sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
  const history = reservations
    .filter(res => new Date(res.fecha_reserva).getTime() < now || res.estado === 'cancelada')
    .sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva));

  const invoiceMap = new Map(invoices.map(invoice => [invoice.id_reserva, invoice]));
  const totalSpent = invoices.reduce((sum, invoice) => sum + Number(invoice.monto || 0), 0);
  const totalReservations = reservations.length;
  const uniqueFields = new Set(reservations.map(res => res.id_cancha)).size;
  const paymentsTotal = payments.reduce((sum, item) => sum + Number(item.monto || 0), 0);
  const expensesMap = invoices.reduce((acc, invoice) => {
    const key = invoice.cancha_nombre || `Cancha #${invoice.id_reserva}`;
    const entry = acc.get(key) || { total: 0, count: 0 };
    entry.total += Number(invoice.monto || 0);
    entry.count += 1;
    acc.set(key, entry);
    return acc;
  }, new Map());

  if (refs.playerStatTotal) refs.playerStatTotal.textContent = totalReservations;
  if (refs.playerStatUpcoming) refs.playerStatUpcoming.textContent = upcoming.length;
  if (refs.playerStatSpent) refs.playerStatSpent.textContent = formatCurrency(totalSpent);
  if (refs.playerStatFields) refs.playerStatFields.textContent = uniqueFields;

  const notificationsItems = [];
  if (upcoming[0]) {
    const fieldName =
      findFieldById(upcoming[0].id_cancha)?.nombre ||
      upcoming[0].cancha_nombre ||
      `Cancha #${upcoming[0].id_cancha}`;
    notificationsItems.push(
      `<div class="list-item"><div><strong>Siguiente partido</strong><p>${fieldName} · ${new Date(
        upcoming[0].fecha_reserva
      ).toLocaleString()}</p></div></div>`
    );
  }
  if (payments[0]) {
    notificationsItems.push(
      `<div class="list-item"><div><strong>Pago confirmado</strong><p>${formatPaymentMethod(
        payments[0].metodo_pago
      )} · ${new Date(payments[0].fecha_pago).toLocaleString()}</p></div></div>`
    );
  }
  if (state.weatherIsRainy) {
    notificationsItems.push(
      '<div class="list-item"><div><strong>Pronóstico de lluvia</strong><p>Se espera lluvia en Cúcuta, considera reservar para otro día.</p></div></div>'
    );
  }
  const hasImportantNotifications = notificationsItems.length && !notificationsItems.every(item => item.includes('Sin notificaciones'));
  if (!notificationsItems.length) {
    notificationsItems.push('<div class="list-item"><div><strong>Sin notificaciones</strong><p>Todo al día</p></div></div>');
  }

  const renderReservationList = (container, items, emptyMessage) => {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
      return;
    }
    container.innerHTML = items
      .map(reservation => {
        const field = findFieldById(reservation.id_cancha);
        const fieldName = field?.nombre || reservation.cancha_nombre || `Cancha #${reservation.id_cancha}`;
        const invoice = invoiceMap.get(reservation.id);
        const price = invoice ? invoice.monto : getFieldPrice(reservation.id_cancha);
        const statusClass =
          reservation.estado === 'confirmada'
            ? 'success'
            : reservation.estado === 'cancelada'
            ? 'user'
            : 'user';
        return `
          <div class="list-item">
            <div class="list-item-info">
              <strong>${fieldName}</strong>
              <p>${new Date(reservation.fecha_reserva).toLocaleString()}</p>
              <small>${formatCurrency(price)}</small>
            </div>
            <div class="reservation-row-meta">
              <span class="badge ${statusClass}">${reservation.estado}</span>
            </div>
          </div>`;
      })
      .join('');
  };

  renderReservationList(
    refs.playerReservationsUpcoming,
    upcoming,
    'No tienes reservas próximas.'
  );
  renderReservationList(
    refs.playerReservationsHistory,
    history,
    'Aún no registras reservas anteriores.'
  );

  renderInfoList(
    refs.playerPayments,
    payments.map(
      p => `
        <div class="list-item">
          <div>
            <strong>${formatPaymentMethod(p.metodo_pago)}</strong>
            <p>${new Date(p.fecha_pago).toLocaleString()}</p>
          </div>
          <span class="badge ${p.estado_pago === 'completado' ? 'success' : 'user'}">${formatCurrency(p.monto)}</span>
        </div>`
    )
  );

  renderInfoList(
    refs.playerInvoices,
    invoices.map(
      invoice => `
        <div class="list-item">
          <div>
            <strong>Factura #${invoice.id}</strong>
            <p>${invoice.cancha_nombre || 'Cancha'} · ${new Date(invoice.fecha_factura).toLocaleString()}</p>
            <small>${formatPaymentMethod(invoice.metodo_pago || 'efectivo')}</small>
          </div>
          <span class="badge success">${formatCurrency(invoice.monto)}</span>
        </div>`
    )
  );

  const expenseEntries = Array.from(expensesMap.entries()).sort((a, b) => b[1].total - a[1].total);

  if (refs.playerExpenses) {
    refs.playerExpenses.innerHTML = expenseEntries.length
      ? expenseEntries
          .map(
            ([fieldName, data]) => `
        <div class="list-item">
          <div class="list-item-info">
            <strong>${fieldName}</strong>
            <p>${data.count} ${data.count === 1 ? 'reserva' : 'reservas'}</p>
          </div>
          <span class="badge success">${formatCurrency(data.total)}</span>
        </div>`
          )
          .join('')
      : '<div class="empty-state">Aún no tienes gastos registrados.</div>';
  }

  renderInfoList(refs.notifications, notificationsItems);
  if (refs.headerNotificationsList) {
    renderInfoList(refs.headerNotificationsList, notificationsItems);
  }
  if (refs.notificationDot) {
    refs.notificationDot.classList.toggle('hidden', !hasImportantNotifications);
  }
  if (refs.playerExpensesSummary) {
    refs.playerExpensesSummary.textContent = expenseEntries.length
      ? `${expenseEntries.length} ${expenseEntries.length === 1 ? 'cancha' : 'canchas'} · ${formatCurrency(totalSpent)} invertidos`
      : 'Aún no tienes gastos registrados.';
  }
  if (refs.playerPaymentsSummary) {
    refs.playerPaymentsSummary.textContent = payments.length
      ? `${payments.length} pagos · ${formatCurrency(paymentsTotal)}`
      : 'Sin pagos registrados.';
  }
  if (refs.playerInvoicesSummary) {
    refs.playerInvoicesSummary.textContent = invoices.length
      ? `${invoices.length} ${invoices.length === 1 ? 'factura' : 'facturas'} emitidas`
      : 'Aún no tienes facturas.';
  }
  if (refs.playerNotificationsSummary) {
    refs.playerNotificationsSummary.textContent = hasImportantNotifications
      ? `${notificationsItems.length} ${notificationsItems.length === 1 ? 'aviso' : 'avisos'} pendientes`
      : 'Sin notificaciones importantes.';
  }

  if (refs.nextBooking) {
    if (!upcoming.length) {
      refs.nextBooking.innerHTML = '<p>No tienes reservas activas.</p>';
    } else {
      const topUpcoming = upcoming.slice(0, 3);
      refs.nextBooking.innerHTML = `
        <div class="player-card">
          <img src="${findFieldById(topUpcoming[0].id_cancha)?.imagen || ''}" alt="Reserva" />
          <div>
            <h4>${findFieldById(topUpcoming[0].id_cancha)?.nombre || topUpcoming[0].cancha_nombre || 'Reserva'}</h4>
            <p>${new Date(topUpcoming[0].fecha_reserva).toLocaleString()}</p>
            <span class="badge ${
              topUpcoming[0].estado === 'confirmada' ? 'success' : 'user'
            }">${topUpcoming[0].estado}</span>
          </div>
        </div>
        ${
          topUpcoming.length > 1
            ? `<ul class="next-booking-list">
                ${topUpcoming
                  .slice(1)
                  .map(
                    item => `
                  <li>
                    <span>${findFieldById(item.id_cancha)?.nombre || item.cancha_nombre || 'Reserva'}</span>
                    <small>${new Date(item.fecha_reserva).toLocaleString()}</small>
                  </li>`
                  )
                  .join('')}
              </ul>`
            : ''
        }
      `;
    }
  }

  if (refs.playerSuggestions) {
    const favouriteCount = reservations.reduce((acc, res) => {
      acc[res.id_cancha] = (acc[res.id_cancha] || 0) + 1;
      return acc;
    }, {});
    const favouriteEntry = Object.entries(favouriteCount).sort((a, b) => b[1] - a[1])[0];
    const favouriteField = favouriteEntry ? findFieldById(Number(favouriteEntry[0])) : null;
    const lastInvoice = invoices[0];

    refs.playerSuggestions.innerHTML = `
      <div>
        <h4>Resumen de actividad</h4>
        <div class="highlight-meta">
          <span>Total pagado: ${formatCurrency(totalSpent)}</span>
          ${
            favouriteField
              ? `<span>Cancha favorita: ${favouriteField.nombre} (${favouriteEntry[1]} visitas)</span>`
              : favouriteEntry
              ? `<span>Cancha favorita: ${
                  reservations.find(res => res.id_cancha === Number(favouriteEntry[0]))?.cancha_nombre ||
                  `Cancha #${favouriteEntry[0]}`
                } (${favouriteEntry[1]} visitas)</span>`
              : ''
          }
        </div>
      </div>
      ${
        lastInvoice
          ? `<p>Último pago: ${formatPaymentMethod(lastInvoice.metodo_pago || 'efectivo')} · ${new Date(lastInvoice.fecha_factura).toLocaleDateString()}</p>`
          : '<p>Todavía no registras pagos.</p>'
      }
      ${
        state.weatherAdvisory
          ? `<p class="weather-advisory">${state.weatherAdvisory}</p>`
          : ''
      }
    `;
  }
};

const init = async () => {
  populateTaskTemplates();
  try {
    state.profile = await request('/users/me');
    refs.userName.textContent = state.profile.nombre || state.profile.email;
    applyRoleView(state.profile.tipo_usuario || 'normal');

    const fieldPromise = loadFields();

    if (state.profile.tipo_usuario === 'admin') {
      const [overview, reservations, payments] = await Promise.all([
        request('/admin/overview'),
        request('/reservations'),
        request('/payments/all')
      ]);
      applyOverview(overview);
      state.reservations = reservations;
      renderAdminReservations(state.reservations);
      renderAdminPayments(payments);
      await Promise.all([loadUsers(), loadAdminInvoices()]);
      await loadAdminTasks();
    } else {
      refs.statUsers.textContent = '-';
      refs.statBookings.textContent = '-';
      refs.statIncome.textContent = '-';
    }

    await fieldPromise;
    if (state.profile.tipo_usuario === 'normal') {
      await renderPlayerData();
    }
    if (state.profile.tipo_usuario === 'empleado') {
      await loadEmployeeData();
    }

    if (!state.weather) {
      await loadWeather();
    } else {
      renderWeather(state.weather);
    }
    setInterval(loadWeather, WEATHER_REFRESH_INTERVAL);

  } catch (err) {
    console.error(err);
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
};

if (refs.fieldForm) {
  refs.fieldForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (state.profile?.tipo_usuario !== 'admin') {
      return alert('Solo los administradores pueden crear canchas');
    }
    const formData = new FormData();
    formData.append('nombre', refs.fieldForm.nombre.value);
    formData.append('capacidad', refs.fieldForm.capacidad.value);
    formData.append('tipo_campo', refs.fieldForm.tipo_campo.value);
    formData.append('descripcion', refs.fieldForm.descripcion.value);
    formData.append('estado', refs.fieldForm.estado.value);
    if (state.fieldImageBlob) {
      const type = state.fieldImageBlob.type || 'image/jpeg';
      const extension = type.split('/')[1] === 'jpeg' ? 'jpg' : type.split('/')[1] || 'jpg';
      formData.append('imagen', state.fieldImageBlob, `field-image.${extension}`);
    }
    const url = state.editingFieldId ? `/fields/${state.editingFieldId}` : '/fields';
    const method = state.editingFieldId ? 'PUT' : 'POST';
    try {
      await request(url, { method, body: formData });
      refs.fieldForm.reset();
      state.fieldImageBase64 = null;
      state.fieldImageBlob = null;
      state.editingFieldId = null;
      refs.fieldImagePreview.innerHTML = '';
      await loadFields();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (refs.fieldList) {
  refs.fieldList.addEventListener('click', async event => {
    const editBtn = event.target.closest('[data-edit-field]');
    const deleteBtn = event.target.closest('[data-delete-field]');
    if (editBtn) {
      const field = state.fields.find(f => f.id === Number(editBtn.dataset.editField));
      if (!field) return;
      state.editingFieldId = field.id;
      state.fieldImageBase64 = null;
      state.fieldImageBlob = null;
      refs.fieldForm.nombre.value = field.nombre;
      refs.fieldForm.capacidad.value = field.capacidad;
      refs.fieldForm.tipo_campo.value = field.tipo_campo;
      refs.fieldForm.estado.value = field.estado;
      refs.fieldForm.descripcion.value = field.descripcion || '';
      refs.fieldImagePreview.innerHTML = field.imagen ? `<img src="${field.imagen}" alt="${field.nombre}" />` : '';
      window.scrollTo({ top: refs.fieldForm.offsetTop - 80, behavior: 'smooth' });
      return;
    }
    if (deleteBtn) {
      if (state.profile?.tipo_usuario !== 'admin') {
        alert('No tienes permisos para eliminar canchas');
        return;
      }
      if (confirm('Eliminar esta cancha?')) {
        await request(`/fields/${deleteBtn.dataset.deleteField}`, { method: 'DELETE' });
        await loadFields();
      }
    }
  });
}

if (refs.playerFieldGallery) {
  refs.playerFieldGallery.addEventListener('click', event => {
    const card = event.target.closest('[data-player-field]');
    if (!card) return;
    refs.playerFieldGallery.querySelectorAll('.player-field-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    if (refs.playerReservationField) {
      refs.playerReservationField.value = card.dataset.playerField;
      updateReservationPriceUI();
    }
  });
}

if (refs.playerReservationField) {
  refs.playerReservationField.addEventListener('change', updateReservationPriceUI);
}

if (refs.playerReservationForm) {
  refs.playerReservationForm.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(refs.playerReservationForm);
    const fieldId = Number(form.get('id_cancha'));
    const metodo_pago = refs.playerReservationMethod ? refs.playerReservationMethod.value : 'tarjeta';
    const fecha_reserva = form.get('fecha_reserva');
    const monto = getFieldPrice(fieldId);
    if (!monto) {
      alert('No se pudo determinar el valor de la cancha seleccionada.');
      return;
    }
    const payload = { id_cancha: fieldId, fecha_reserva };
    if (state.weatherIsRainy) {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
      const warning = 'El pronóstico indica lluvia para hoy en Cúcuta. ¿Deseas continuar con la reserva?';
      if (!confirm(warning)) {
        const dateInput = refs.playerReservationForm.querySelector('input[name="fecha_reserva"]');
        if (dateInput && !dateInput.value) {
          dateInput.value = tomorrow;
        }
        return;
      }
    }
    try {
      const reservation = await request('/reservations', { method: 'POST', body: payload });
      try {
        await request('/payments', {
          method: 'POST',
          body: { id_reserva: reservation.id, metodo_pago, monto }
        });
        alert('Reserva y pago registrados correctamente');
      } catch (paymentError) {
        alert(`La reserva se creó, pero el pago no pudo registrarse: ${paymentError.message}`);
      }
      refs.playerReservationForm.reset();
      if (refs.playerReservationMethod) refs.playerReservationMethod.value = 'tarjeta';
      if (refs.playerReservationField && refs.playerReservationField.options.length) {
        refs.playerReservationField.selectedIndex = 0;
      }
      updateReservationPriceUI();
      await renderPlayerData();
    } catch (error) {
      alert(error.message);
    }
  });
}

const openUserEditor = user => {
  state.editingUserId = user.id;
  refs.userEditor.classList.remove('hidden');
  refs.userEditForm.nombre.value = user.nombre;
  refs.userEditForm.email.value = user.email;
  refs.userEditForm.tipo_usuario.value = user.tipo_usuario;
  refs.userEditEmail.textContent = user.email;
};

if (refs.usersList) {
  refs.usersList.addEventListener('click', event => {
    const editBtn = event.target.closest('[data-edit-user]');
    const deleteBtn = event.target.closest('[data-delete-user]');
    if (editBtn) {
      const user = state.users.find(u => u.id === Number(editBtn.dataset.editUser));
      if (user) openUserEditor(user);
      return;
    }
    if (deleteBtn) {
      const id = Number(deleteBtn.dataset.deleteUser);
      if (Number.isNaN(id)) return;
      if (confirm('¿Eliminar este usuario?')) {
        request(`/users/${id}`, { method: 'DELETE' })
          .then(loadUsers)
          .catch(error => alert(error.message));
      }
    }
  });
}

if (refs.closeUserEditor) {
  refs.closeUserEditor.addEventListener('click', () => {
    refs.userEditor.classList.add('hidden');
    state.editingUserId = null;
  });
}

if (refs.openUserCreator) {
  refs.openUserCreator.addEventListener('click', () => {
    if (refs.userCreator) {
      refs.userCreator.classList.remove('hidden');
      refs.userCreator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

if (refs.closeUserCreator && refs.userCreator) {
  refs.closeUserCreator.addEventListener('click', () => {
    refs.userCreator.classList.add('hidden');
    if (refs.userCreateForm) refs.userCreateForm.reset();
  });
}

if (refs.userCreateForm) {
  refs.userCreateForm.addEventListener('submit', async event => {
    event.preventDefault();
    const payload = {
      nombre: refs.userCreateForm.nombre.value,
      email: refs.userCreateForm.email.value,
      password: refs.userCreateForm.password.value,
      tipo_usuario: refs.userCreateForm.tipo_usuario.value
    };
    try {
      await request('/users/register', { method: 'POST', body: payload });
      alert('Usuario creado correctamente');
      refs.userCreateForm.reset();
      if (refs.userCreator) refs.userCreator.classList.add('hidden');
      await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (refs.userEditForm) {
  refs.userEditForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!state.editingUserId) return;
    const payload = {
      nombre: refs.userEditForm.nombre.value,
      email: refs.userEditForm.email.value,
      tipo_usuario: refs.userEditForm.tipo_usuario.value
    };
    await request(`/users/${state.editingUserId}`, { method: 'PUT', body: JSON.stringify(payload) });
    refs.userEditor.classList.add('hidden');
    state.editingUserId = null;
    await loadUsers();
  });
}

if (refs.taskTemplateSelect) {
  refs.taskTemplateSelect.addEventListener('change', event => {
    if (!event.target.value) {
      if (refs.taskIdField) refs.taskIdField.value = '';
      if (refs.taskTitleInput) refs.taskTitleInput.value = '';
      if (refs.taskDescriptionInput) refs.taskDescriptionInput.value = '';
      if (refs.taskPrioritySelect) refs.taskPrioritySelect.value = 'media';
      if (refs.taskStatusSelect) refs.taskStatusSelect.value = 'pendiente';
      if (refs.taskDateInput) refs.taskDateInput.value = '';
      return;
    }
    if (refs.taskIdField) refs.taskIdField.value = '';
    setTaskFormFromTemplate(event.target.value);
  });
}

if (refs.taskFilterEmployee) {
  refs.taskFilterEmployee.addEventListener('change', renderAdminTasks);
}

if (refs.taskFilterStatus) {
  refs.taskFilterStatus.addEventListener('change', renderAdminTasks);
}

if (refs.taskCreateForm) {
  refs.taskCreateForm.addEventListener('submit', async event => {
    event.preventDefault();
    const titulo = (refs.taskTitleInput?.value || '').trim();
    const descripcion = (refs.taskDescriptionInput?.value || '').trim();
    const payload = {
      asignado_a: Number(refs.taskEmployeeSelect?.value || 0),
      titulo,
      descripcion: descripcion || null,
      prioridad: refs.taskPrioritySelect?.value || 'media',
      fecha_programada: refs.taskDateInput?.value || null,
      estado: refs.taskStatusSelect?.value || 'pendiente'
    };

    if (!payload.asignado_a) {
      alert('Selecciona un empleado.');
      return;
    }
    if (!payload.titulo) {
      alert('El título es obligatorio.');
      return;
    }

    const taskId = refs.taskIdField?.value;
    const endpoint = taskId ? `/tasks/${taskId}` : '/tasks';
    const method = taskId ? 'PUT' : 'POST';

    try {
      await request(endpoint, { method, body: payload });
      alert(taskId ? 'Tarea actualizada' : 'Tarea asignada');
      resetTaskForm();
      await loadAdminTasks();
    } catch (error) {
      alert(error.message);
    }
  });
}

if (refs.adminTaskList) {
  refs.adminTaskList.addEventListener('click', async event => {
    const editBtn = event.target.closest('[data-task-edit]');
    const statusBtn = event.target.closest('[data-task-status]');
    if (editBtn) {
      const taskId = Number(editBtn.dataset.taskEdit);
      const task = (state.adminTasks || []).find(item => item.id === taskId);
      if (task) setTaskFormFromTask(task);
      window.scrollTo({ top: refs.taskCreateForm.offsetTop - 80, behavior: 'smooth' });
      return;
    }
    if (statusBtn) {
      const taskId = Number(statusBtn.dataset.taskId);
      const newStatus = statusBtn.dataset.taskStatus;
      try {
        await request(`/tasks/${taskId}/status`, { method: 'PUT', body: { estado: newStatus } });
        await loadAdminTasks();
      } catch (error) {
        alert(error.message);
      }
    }
  });
}

if (refs.employeeOpsReservations) {
  refs.employeeOpsReservations.addEventListener('click', async event => {
    const confirmBtn = event.target.closest('[data-confirm-reservation]');
    const cancelBtn = event.target.closest('[data-cancel-reservation]');
    try {
      if (confirmBtn) {
        const id = Number(confirmBtn.dataset.confirmReservation);
        await request(`/reservations/${id}/status`, {
          method: 'PUT',
          body: { estado: 'confirmada' }
        });
        await loadEmployeeData();
        return;
      }
      if (cancelBtn) {
        const id = Number(cancelBtn.dataset.cancelReservation);
        await request(`/reservations/${id}/status`, {
          method: 'PUT',
          body: { estado: 'cancelada' }
        });
        await loadEmployeeData();
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

if (refs.reservationList) {
  refs.reservationList.addEventListener('click', async event => {
    const confirmBtn = event.target.closest('[data-confirm-reservation]');
    const cancelBtn = event.target.closest('[data-cancel-reservation]');
    try {
      if (confirmBtn) {
        const id = Number(confirmBtn.dataset.confirmReservation);
        if (Number.isNaN(id)) return;
        await request(`/reservations/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ estado: 'confirmada' })
        });
        await loadReservations();
        return;
      }
      if (cancelBtn) {
        const id = Number(cancelBtn.dataset.cancelReservation);
        if (Number.isNaN(id)) return;
        await request(`/reservations/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ estado: 'cancelada' })
        });
        await loadReservations();
      }
    } catch (error) {
      alert(error.message);
    }
  });
}

const hideHeaderNotifications = () => {
  if (refs.headerNotifications) refs.headerNotifications.classList.add('hidden');
};

if (refs.toggleNotifications && refs.headerNotifications) {
  refs.toggleNotifications.addEventListener('click', event => {
    event.stopPropagation();
    refs.headerNotifications.classList.toggle('hidden');
  });
}

if (refs.closeHeaderNotifications) {
  refs.closeHeaderNotifications.addEventListener('click', hideHeaderNotifications);
}

document.addEventListener('click', event => {
  if (!refs.headerNotifications) return;
  const withinDropdown = refs.headerNotifications.contains(event.target);
  const withinToggle = refs.toggleNotifications?.contains(event.target);
  if (!withinDropdown && !withinToggle) {
    hideHeaderNotifications();
  }
});

refs.logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

init();
