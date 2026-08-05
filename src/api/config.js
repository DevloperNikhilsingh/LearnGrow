/**
 * api/config.js
 * -------------------------------------------------
 * Central API configuration.
 *
 * MOCK MODE (current):
 *   Service files import JSON directly and return Promise.resolve(data).
 *
 * PRODUCTION MODE (Laravel backend):
 *   1. Set VITE_API_BASE_URL in your .env file, e.g.:
 *        VITE_API_BASE_URL=https://api.learngrow.in
 *   2. Replace Promise.resolve(...) in each service file with:
 *        return apiFetch('/api/endpoint');
 *   3. Components require zero changes.
 * -------------------------------------------------
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Shared fetch wrapper — used once real backend is connected.
 * Handles JSON parsing, auth headers, and error normalisation.
 *
 * @param {string} endpoint - e.g. '/api/courses'
 * @param {RequestInit} options - standard fetch options
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('lg_token');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
