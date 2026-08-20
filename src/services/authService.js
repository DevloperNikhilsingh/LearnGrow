/**
 * services/authService.js
 * -------------------------------------------------
 * Authentication service.
 * Currently: mock localStorage-based auth.
 * -------------------------------------------------
 */

// Static admin credentials (admin register nahi karega)
const ADMIN_CREDENTIALS = {
  id: 'admin-001',
  name: 'Admin User',
  email: 'admin@learngrow.in',
  password: 'admin123',
  role: 'admin',
  avatar: 'AU',
  enrolledCourses: [],
  progress: {}
};

/** Get all registered users from localStorage */
function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem('lg_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Save registered users to localStorage */
function saveRegisteredUsers(users) {
  localStorage.setItem('lg_registered_users', JSON.stringify(users));
}

/** Log in a user */
export async function login({ email, password }) {
  // Check admin first
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const { password: _pw, ...safeAdmin } = ADMIN_CREDENTIALS;
    localStorage.setItem('lg_user', JSON.stringify(safeAdmin));
    localStorage.setItem('lg_token', 'mock-jwt-token-admin');
    return Promise.resolve(safeAdmin);
  }

  // Check registered users
  const registeredUsers = getRegisteredUsers();
  const user = registeredUsers.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password. Please register first if you are new.');

  const { password: _pw, ...safeUser } = user;
  localStorage.setItem('lg_user', JSON.stringify(safeUser));
  localStorage.setItem('lg_token', 'mock-jwt-token-' + safeUser.id);
  return Promise.resolve(safeUser);
}

/** Register a new user */
export async function register({ name, email, password, role = 'student' }) {
  const registeredUsers = getRegisteredUsers();

  const existingUser = registeredUsers.find((u) => u.email === email);
  if (existingUser) throw new Error('An account with this email already exists. Please log in.');

  if (email === ADMIN_CREDENTIALS.email) throw new Error('This email is reserved. Please use a different email.');

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: role === 'instructor' ? 'instructor' : 'student',
    avatar: name.slice(0, 2).toUpperCase(),
    enrolledCourses: role === 'instructor' ? [] : [1, 3, 4],
    progress: role === 'instructor' ? {} : { 1: 60, 3: 30, 4: 10 }
  };

  registeredUsers.push(newUser);
  saveRegisteredUsers(registeredUsers);

  return Promise.resolve({ name: newUser.name, email: newUser.email, role: newUser.role });
}

/** Log out the current user */
export async function logout() {
  localStorage.removeItem('lg_user');
  localStorage.removeItem('lg_token');
  return Promise.resolve(true);
}

/** Get the currently logged-in user from localStorage */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('lg_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Check if user is logged in */
export function isAuthenticated() {
  return !!localStorage.getItem('lg_token');
}

/** Check if user is admin */
export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === 'admin';
}
