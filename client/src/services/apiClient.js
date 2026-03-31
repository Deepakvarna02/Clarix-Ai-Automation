const normalizeBaseUrl = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

export const apiFetch = (path, options) => fetch(buildApiUrl(path), options);

export const apiFetchJson = async (path, options) => {
  const response = await apiFetch(path, options);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = result?.message || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = result;
    throw error;
  }

  return result;
};
