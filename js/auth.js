/* =============================================
   AUTH.JS – Login / Signup logic
   Multi-user: cada credencial = cuenta separada
   ============================================= */

// ---- Per-user storage key helper ----
// All app data is namespaced under the current user's accountId.
// Usage: localStorage.getItem(userKey('recim_invoices'))
function userKey(baseKey) {
  return baseKey;
}

// ---- Tab switching ----
function switchAuthTab(tab) {
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    tabLogin.classList.add('auth-tab--active');
    tabSignup.classList.remove('auth-tab--active');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabSignup.classList.add('auth-tab--active');
    tabLogin.classList.remove('auth-tab--active');
  }
}

// ---- Password toggle ----
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// =============================================
// EMAIL / PHONE LOGIN
// =============================================

async function handleLogin(evt) {
  evt.preventDefault();
  const identifier = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  const resetBtn = () => {
    btn.querySelector('span').classList.remove('hidden');
    btn.querySelector('.btn-spinner').classList.add('hidden');
    btn.disabled = false;
  };

  errorEl.classList.add('hidden');

  // Sync users from Firebase if active before checking local storage
  if (isFirebaseActive && db) {
    try {
      const snapshot = await db.ref('users').get();
      const cloudUsers = snapshot.val();
      if (cloudUsers) {
        localStorage.setItem('recim_users', JSON.stringify(cloudUsers));
      }
    } catch (err) {
      console.error("Firebase login sync error:", err);
    }
  }

  const users = JSON.parse(localStorage.getItem('recim_users') || '[]');
  const found = users.find(u => u.email?.toLowerCase() === identifier);

  if (!found) {
    errorEl.textContent = 'No existe una cuenta con ese correo.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (!found.password) {
    errorEl.textContent = 'Esta cuenta no tiene contraseña. Ve a “Crear Cuenta”, usa el mismo correo y elige una contraseña.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (found.password !== btoa(password)) {
    errorEl.textContent = 'Contraseña incorrecta.';
    errorEl.classList.remove('hidden');
    return;
  }

  btn.querySelector('span').classList.add('hidden');
  btn.querySelector('.btn-spinner').classList.remove('hidden');
  btn.disabled = true;

  setTimeout(() => {
    try {
      const session = {
        name: found.name,
        email: found.email,
        avatar: (found.avatar || found.name || 'U')[0].toUpperCase(),
        provider: 'email',
        accountId: found.accountId
      };
      localStorage.setItem('recim_session', JSON.stringify(session));
      showToast(`✅ Bienvenido de nuevo, ${found.name}`, 'success');
      initApp(session);
    } catch (err) {
      console.error('Login error:', err);
      resetBtn();
      errorEl.textContent = 'Error al iniciar sesión: ' + (err.message || err);
      errorEl.classList.remove('hidden');
    }
  }, 800);
}

// =============================================
// SIGNUP
// =============================================

async function handleSignup(evt) {
  evt.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const identity = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const errorEl = document.getElementById('signup-error');
  const btn = document.getElementById('signup-btn');

  const resetBtn = () => {
    btn.querySelector('span').classList.remove('hidden');
    btn.querySelector('.btn-spinner').classList.add('hidden');
    btn.disabled = false;
  };

  errorEl.classList.add('hidden');

  if (!name || !identity || !password) {
    errorEl.textContent = 'Por favor completa todos los campos.';
    errorEl.classList.remove('hidden');
    return;
  }

  const users = JSON.parse(localStorage.getItem('recim_users') || '[]');
  const existsIdx = users.findIndex(u => u.email?.toLowerCase() === identity);
  const exists = existsIdx >= 0 ? users[existsIdx] : null;

  if (exists && exists.password) {
    errorEl.textContent = 'Ya existe una cuenta con ese correo. Inicia sesión.';
    errorEl.classList.remove('hidden');
    return;
  }

  btn.querySelector('span').classList.add('hidden');
  btn.querySelector('.btn-spinner').classList.remove('hidden');
  btn.disabled = true;

  setTimeout(() => {
    try {
      let session;

      if (exists && !exists.password) {
        // Upgrade old social account with a password
        users[existsIdx] = { ...exists, name, password: btoa(password), provider: 'email', avatar: name[0].toUpperCase() };
        localStorage.setItem('recim_users', JSON.stringify(users));
        session = { name, email: exists.email, avatar: name[0].toUpperCase(), provider: 'email', accountId: exists.accountId };
        localStorage.setItem('recim_session', JSON.stringify(session));
        showToast('✅ Cuenta actualizada con contraseña', 'success');
      } else {
        // Brand-new account
        const accountId = `ACC-${Date.now()}`;
        const newUser = { name, email: identity, password: btoa(password), provider: 'email', accountId, avatar: name[0].toUpperCase(), createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('recim_users', JSON.stringify(users));
        session = { name, email: identity, avatar: name[0].toUpperCase(), provider: 'email', accountId };
        localStorage.setItem('recim_session', JSON.stringify(session));
        showToast('🎉 Cuenta creada exitosamente', 'success');

        // Sync users to Firebase if active
        if (isFirebaseActive && db) {
          db.ref('users').set(users).catch(err => console.error("Firebase users sync error:", err));
        }
      }

      initApp(session);
    } catch (err) {
      console.error('Signup error:', err);
      resetBtn();
      errorEl.textContent = 'Error al crear cuenta: ' + (err.message || err);
      errorEl.classList.remove('hidden');
    }
  }, 900);
}

// ---- Logout ----
function handleLogout() {
  if (!confirm('¿Seguro que deseas cerrar sesión?')) return;
  localStorage.removeItem('recim_session');
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  // Reset login form state
  const btn = document.getElementById('login-btn');
  if (btn) {
    btn.querySelector('span')?.classList.remove('hidden');
    btn.querySelector('.btn-spinner')?.classList.add('hidden');
    btn.disabled = false;
  }
  showToast('👋 Sesión cerrada', 'success');
}
