/**
 * services/http.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single HTTP primitive used by every API module.
 *
 * Responsibilities
 *  - Attach the JWT from localStorage to every request
 *  - Parse JSON (or throw a descriptive error for non-JSON responses)
 *  - Redirect to /login on 401
 *  - Surface backend error messages instead of generic "fetch failed"
 *  - Return a consistent { success, data, message, statusCode } shape on failure
 *  - Log errors with context for debugging
 */

export const API_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── Auth header ──────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem('token');

const buildHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

// ─── Response parsing ─────────────────────────────────────────────────────────

const parseResponse = async (res) => {
  // Session expired → clean up and bounce to login
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    const err = new Error('Session expired. Please log in again.');
    err.statusCode = 401;
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const err = new Error(
      `Unexpected response from server (status ${res.status}, type "${contentType}"). Is the backend running?`
    );
    err.statusCode = res.status;
    throw err;
  }

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.message || data?.error || `Server error ${res.status}`;
    const err = new Error(msg);
    err.statusCode = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

// ─── Error normaliser ─────────────────────────────────────────────────────────

const normaliseError = (error, context = 'API call') => {
  // Log error with context for debugging
  console.error(`[${context}]`, {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
  });

  if (
    error.message === 'Failed to fetch' ||
    error.message?.includes('Is the backend running')
  ) {
    return {
      success: false,
      message: 'Cannot reach the server. Check that the backend is running on port 5000.',
      statusCode: error.statusCode || 0,
    };
  }

  return {
    success: false,
    message: error.message || 'An unexpected error occurred.',
    statusCode: error.statusCode,
  };
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Authenticated fetch.
 *
 * @param {string} path        - Path relative to API_BASE, e.g. "/tasks"
 * @param {RequestInit} init   - Any fetch options (method, body, headers, …)
 * @param {string} context     - Label used in error logs
 * @returns {Promise<any>}     - Parsed JSON on success, error object on failure
 */
export const authFetch = async (path, init = {}, context = path) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: buildHeaders(init.headers),
    });
    return await parseResponse(res);
  } catch (error) {
    return normaliseError(error, context);
  }
};

/**
 * Unauthenticated fetch (signup / login).
 */
export const publicFetch = async (path, init = {}, context = path) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
    return await parseResponse(res);
  } catch (error) {
    return normaliseError(error, context);
  }
};