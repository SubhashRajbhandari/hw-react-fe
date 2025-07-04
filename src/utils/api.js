const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  const data = await response.json();
  return { status: response.status, ...data };
};
