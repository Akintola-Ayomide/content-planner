const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: RequestInit) => 
    fetchApi(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) => 
    fetchApi(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'DELETE' }),
};
