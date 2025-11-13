const API_BASE = 'http://localhost:4000/api';
const tabs = document.querySelectorAll('.tab-button');
const forms = document.querySelectorAll('.form');
const statusMessage = document.getElementById('status-message');
const request = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Ocurrio un error');
  return data;
};
const switchTab = target => {
  tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.target === target));
  forms.forEach(form => form.classList.toggle('active', form.id === `${target}-form`));
};
tabs.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.target)));
const setStatus = (message = '', variant = 'info') => {
  statusMessage.textContent = message;
  statusMessage.style.color = variant === 'error' ? '#ff9c9c' : '#1fcf82';
};
const redirectToDashboard = () => (window.location.href = 'dashboard.html');
const handleLogin = async event => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.target).entries());
  try {
    const result = await request('/users/login', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('token', result.token);
    setStatus('Inicio de sesion correcto, redirigiendo...');
    setTimeout(redirectToDashboard, 500);
  } catch (err) {
    setStatus(err.message, 'error');
  }
};
const handleRegister = async event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());
  if (payload.password !== payload.confirm) {
    setStatus('Las contrasenas no coinciden', 'error');
    return;
  }
  delete payload.confirm;
  try {
    const result = await request('/users/register', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('token', result.token);
    setStatus('Cuenta creada, redirigiendo al panel...');
    setTimeout(redirectToDashboard, 600);
  } catch (err) {
    setStatus(err.message, 'error');
  }
};
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);
const toggleButton = document.getElementById('toggle-test-credentials');
const modal = document.getElementById('test-credentials-modal');
const overlay = document.getElementById('test-credentials-overlay');
const closeModalButton = document.getElementById('close-test-credentials');
const credentialCards = document.querySelectorAll('.test-credential-card');
const loginForm = document.getElementById('login-form');

const openTestCredentials = () => {
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  if (toggleButton) toggleButton.textContent = 'Ocultar usuarios de prueba';
};

const closeTestCredentials = () => {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  if (toggleButton) toggleButton.textContent = 'Ver usuarios de prueba';
};

if (toggleButton && modal) {
  toggleButton.addEventListener('click', () => {
    if (modal.classList.contains('hidden')) {
      openTestCredentials();
    } else {
      closeTestCredentials();
    }
  });
}

[overlay, closeModalButton].forEach(element => {
  if (element) {
    element.addEventListener('click', closeTestCredentials);
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
    closeTestCredentials();
  }
});

const fillLoginForm = (email, password, role) => {
  if (!loginForm) return;
  const emailInput = loginForm.querySelector('input[name=\"email\"]');
  const passwordInput = loginForm.querySelector('input[name=\"password\"]');
  if (emailInput && passwordInput) {
    emailInput.value = email || '';
    passwordInput.value = password || '';
    setStatus(`Credenciales de ${role} autocompletadas.`, 'info');
  }
};

if (credentialCards.length) {
  credentialCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!modal || modal.classList.contains('hidden')) return;
      const { email, password, role } = card.dataset;
      fillLoginForm(email, password, role);
      closeTestCredentials();
    });
  });
}

if (localStorage.getItem('token')) redirectToDashboard();
